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

class Stackla_WP_Settings {

    private $table;
    private $wpdb;
    private $user_id;
    private $user_has_settings = false;
    private $stackla_api_key;
    private $stackla_post_types = false;
    public $errors = array();

    protected static $exclude_options = array(
        'attachment'
    );

    public function __construct()
    {
        global $wpdb;
        $this->wpdb = $wpdb;
        $this->table = Stackla_WP_Activator::$settings_table;
        $this->user_id = get_current_user_id();
    }

    protected function get_wp_post_types()
    {
        $post_types = get_post_types(array(
            'public' => true
        ));

        return $post_types;
    }

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

    protected function get_errors()
    {
        if(empty($this->errors)) return;

        echo implode(", \n" , $this->errors);
    }

    protected function validate_data($data)
    {
        $stackla_api_key = $data['apiKey'];
        $wp_post_types = $this->get_wp_post_types();

        if($stackla_api_key === false || $stackla_api_key == '')
        {
            $this->errors[] = 'You must submit a valid API key';
            return false;
        }
        else
        {
            $this->stackla_api_key = $stackla_api_key;
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
    }

    protected function set_user_has_settings()
    {
        $statement = "SELECT `id` FROM $this->table WHERE `wp_user_id` = $this->user_id";
        $results = $this->wpdb->get_results($statement , ARRAY_N);

        (!empty($results) || !is_array($results)) ? $this->user_has_settings = true : $this->user_has_settings = false;
    }

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
                        'stackla_api_key' => $this->stackla_api_key,
                        'stackla_post_types' => $this->stackla_post_types
                    ),
                    array(
                        'wp_user_id' => $this->user_id
                    ),
                    array(
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
                        'stackla_api_key' => $this->stackla_api_key,
                        'stackla_post_types' => $this->stackla_post_types
                    ),
                    array(
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

    public function get_user_settings()
    {
        $statement = "SELECT * FROM $this->table WHERE `wp_user_id` = $this->user_id";
        $results = $this->wpdb->get_row($statement);

        if(empty($results))
        {
            return false;
        }

        return $results;
    }
}
