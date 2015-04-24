<?php

/**
 * Fetch and save the plugin's settings.
 *
 *
 * @package    Stackla_WP
 * @subpackage Stackla_WP/includes
 * @author     Rohan Deshpande <rohan.deshpande@stackla.com>
 */

require_once('class-stackla-wp-activator.php');
require_once('class-stackla-wp-metabox-validator.php');
require_once('class-stackla-wp-sdk-wrapper.php');

class Stackla_WP_Settings 
{
    private $table;
    private $wpdb;
    private $user_id;
    private $user_has_settings = false;
    private $stackla_stack;
    private $stackla_client_id;
    private $stackla_client_secret;
    private $stackla_callback_uri;
    private $stackla_post_types = false;
    protected static $exclude_options = array(
        'attachment'
    );

    public $errors = array();

    /**
    *   -- CONSTRUCTOR --
    *   Sets class properties;
    *   @return void;
    */
    public function __construct()
    {
        global $wpdb;
        $this->wpdb = $wpdb;
        $this->table = Stackla_WP_Activator::$settings_table;
        $this->user_id = get_current_user_id();
    }

    /**
    *   Gets the public wordpress post types;
    *   @return array   $post_types  public post types array;
    */
    protected function get_wp_post_types()
    {
        $post_types = get_post_types(array(
            'public' => true
        ));

        return $post_types;
    }

    /**
    *   Filters the wordpress public post types against the exclude_options array;
    *   @return array   $post_types the filtered post_types array;
    */
    public function get_post_type_options()
    {
        $post_types = $this->get_wp_post_types();

        foreach(self::$exclude_options as $option)
        {
            if(array_key_exists($option, $post_types))
            {
                unset($post_types[$option]);
            }
        }

        return $post_types;
    }

    /**
    *   Checks the errors property, and if not empty echoes them out to the client;
    *   @return void;
    */
    protected function get_errors()
    {
        if(empty($this->errors)) return;

        echo implode(", \n" , $this->errors);
    }

    /**
    *   Validates the submitted options data;
    *   @param  array    $data    an array of POST data;
    *   @return boolean based on a valid or invalid result;
    */
    protected function validate_data($data)
    {
        $wp_post_types = $this->get_wp_post_types();

        if(!Stackla_WP_Metabox_Validator::validate_string($data['stack']))
        {
            $this->errors[] = "You must submit a valid stack name";
        }
        else
        {
            $this->stackla_stack = $data['stack'];
        }

        if(!Stackla_WP_Metabox_Validator::validate_string($data['client_id']))
        {
            $this->errors[] = 'You must submit a valid client id';
        }
        else
        {
            $this->stackla_client_id = $data['client_id'];
        }

        if(!Stackla_WP_Metabox_Validator::validate_string($data['client_secret']))
        {
            $this->errors[] = 'You must submit a valid client secret';
        }
        else
        {
            $this->stackla_client_secret = $data['client_secret'];
        }

        if(!Stackla_WP_Metabox_Validator::validate_string($data['callback']))
        {
            $this->errors[] = 'You must submit a valid callback URI';
        }
        else
        {
            $this->stackla_callback_uri = $data['callback'];
        }

        if(!empty($this->errors))
        {
            return false;
        }

        if(isset($data['types']))
        {
            foreach($data['types'] as $type)
            {
                if(!array_key_exists($type, $wp_post_types))
                {
                    $this->errors[] = "The post type $type is not valid or does not exist";
                }
            }

            if(!empty($this->errors))
            {
                return false;
            }

            $this->stackla_post_types = implode(',' , $data['types']);
        }

        return true;
    }

    /**
    *   Sets the user_has_settings boolean to determine if a user already has settings;
    *   @return void;
    */
    protected function set_user_has_settings()
    {
        $statement = "SELECT `id` FROM $this->table WHERE `wp_user_id` = $this->user_id";
        $results = $this->wpdb->get_results($statement , ARRAY_N);

        (!empty($results)) ? $this->user_has_settings = true : $this->user_has_settings = false;
    }

    /**
    *   Inserts the posted data into the db;
    *   @param  array    $data   an array of validated POST data;
    *   @return void;
    */

    public function save($data)
    {
        $validated = $this->validate_data($data);

        if($validated === false)
        {
            $this->get_errors();
            return;
        }

        $this->set_user_has_settings();

        if($this->user_has_settings)
        {
            try
            {
                $this->wpdb->update(
                    $this->table,
                    array(
                        'stackla_stack' => $this->stackla_stack,
                        'stackla_client_id' => $this->stackla_client_id,
                        'stackla_client_secret' => $this->stackla_client_secret,
                        'stackla_callback_uri' => $this->stackla_callback_uri,
                        'stackla_post_types' => $this->stackla_post_types
                    ),
                    array(
                        'wp_user_id' => $this->user_id
                    ),
                    array(
                        '%s',
                        '%s',
                        '%s',
                        '%s',
                        '%s'
                    )
                );
            }
            catch (Exception $e)
            {
                $this->errors[] = $e->getMessage();
                $this->get_errors();
                return;
            }
        }
        else
        {
            try
            {
                $this->wpdb->insert(
                    $this->table,
                    array(
                        'wp_user_id' => $this->user_id,
                        'stackla_stack' => $this->stackla_stack,
                        'stackla_client_id' => $this->stackla_client_id,
                        'stackla_client_secret' => $this->stackla_client_secret,
                        'stackla_callback_uri' => $this->stackla_callback_uri,
                        'stackla_post_types' => $this->stackla_post_types
                    ),
                    array(
                        '%s',
                        '%s',
                        '%s',
                        '%s',
                        '%s',
                        '%s'
                    )
                );
            }
            catch (Exception $e)
            {
                $this->errors[] = $e->getMessage();
                $this->get_errors();
                return;
            }
        }

        echo '1';
    }

    /**
    *   Saves the user's access token;
    *   @param $token   string  the long term access token from stackla;
    *   @return $result int || false;
    */
    public function save_access_token($token)
    {
        $this->set_user_has_settings();

        if(!$this->user_has_settings) return;

        delete_user_meta($this->user_id , 'stackla_access_token');
        $result = add_user_meta($this->user_id , 'stackla_access_token' , $token);

        return $result;
    }

    /**
    *   Gets the current user's settings if they exist;
    *   @return array   $results    an array containing the user settings if they exist;
    *   @return boolean false   if no settings exist
    */
    public function get_user_settings()
    {
        $statement = "SELECT * FROM $this->table WHERE `wp_user_id` = $this->user_id";
        $results = $this->wpdb->get_row($statement , ARRAY_A);

        if(empty($results))
        {
            return false;
        }

        return $results;
    }

    /**
    *   Gets the user's access token;
    *   @return mixed   string || false if token is set, return it, if not return false;
    */
    public function get_user_access_token()
    {
        $token = get_user_meta($this->user_id , 'stackla_access_token' , true);
        return (!is_null($token) && strlen($token) > 0) ? $token : false;
    }

    /**
    *   Get the user's credentials;
    *   @return mixed object || false credentials object if success, false if fail;
    */
    public function get_credentials()
    {
        $current = $this->get_user_settings();

        if($current === false)
        {
            return false;
        }
        elseif(Stackla_WP_Metabox_Validator::validate_string($current['stackla_stack']) === false)
        {
            return false;
        }

        return new Stackla\Core\Credentials(Stackla_WP_SDK_Wrapper::$auth_host , null , $current['stackla_stack']);
    }

    /**
    *   Get the stackla access uri;
    *   @return mixed   string || false if authenticated, return the access uri if not, return false;
    */
    public function get_access_uri()
    {
        $current = $this->get_user_settings();

        if($current === false)
        {
            return false;
        }
        elseif(Stackla_WP_Metabox_Validator::validate_string($current['stackla_client_id']) === false)
        {
            return false;
        }
        elseif(Stackla_WP_Metabox_Validator::validate_string($current['stackla_client_secret']) === false)
        {
            return false;
        }
        elseif(Stackla_WP_Metabox_Validator::validate_string($current['stackla_callback_uri']) === false)
        {
            return false;
        }

        $credentials = $this->get_credentials();
        $access_uri = $credentials->getAccessUri($current['stackla_client_id'], $current['stackla_client_secret'],  $current['stackla_callback_uri']);

        return $access_uri;
    }
}
