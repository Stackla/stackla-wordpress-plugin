<?php

/**
 * Fetch and save the plugin's settings.
 *
 *
 * @package    Stackla_WP
 * @subpackage Stackla_WP/includes
 * @author     Stackla <tech@stackla.com>
 */

require_once('class-stackla-wp-activator.php');
require_once('class-stackla-wp-metabox-validator.php');
require_once('class-stackla-wp-sdk-wrapper.php');

class Stackla_WP_Settings
{
    /**
    *   @var    $tabls                  string  the custom stackla settings table name;
    *   @var    $wpdb                   object  wordpress database object;
    *   @var    $user_id                int     the current wordpress user's id;
    *   @var    $user_has_settings      boolean user has settings true || false;
    *   @var    $stackla_stack          string  the user's stack name;
    *   @var    $stackla_client_id      string  the plugin instance's client id;
    *   @var    $stackla_client_secret  string  the plugin instance's client secret;
    *   @var    $stackla_post_types     array   the post types the user has selected to display the metabox on;
    *   @var    $exclude_options        array   an array of post types to exclude from the choices;
    *   @var    $errors                 array   settings errors array;
    */

    private $table;
    private $wpdb;
    private $user_id;
    private $user_has_settings = false;
    private $stackla_stack;
    private $stackla_client_id;
    private $stackla_client_secret;
    private $stackla_post_types = false;
    private $secret_key = 'the super secret key';
    private $secret_iv = 'the super secret iv';
    protected static $exclude_options = array(
        'attachment'
    );

    public $errors = array(
        'request' => false,
        'stack' => false,
        'client_id' => false,
        'client_secret' => false,
        'callback' => false
    );

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


        $phraseKeyFile = dirname(__DIR__) . '/stackla-phrase-key';
        $phraseKey = null;
        if (is_readable($phraseKeyFile)) {
            $phraseKey = file_get_contents($phraseKeyFile);
        }

        if (is_writeable(dirname(__DIR__))) {
            // generate phrase-key file
            if (empty($phraseKey)) {
                $phraseKey = $this->generateRandomString(32);
                $fh = fopen($phraseKeyFile, 'w+');
                fwrite($fh, $phraseKey);
                fclose($fh);
            }
        } else {
            $message = sprintf("Please make sure the plugin path is writeable. Plugin path: %s", dirname(__DIR__));
            ?>
<div id='wpbody' class="stackla-admin-setting">
    <div id='wpbody-content' aria-label='Main content' tabindex='0'>
        <div class='wrap'>
            <h2 class="header">Stackla For WordPress</h2>
            <div class='auth-notification failure'>
                <h3>Error</h3>
                <li>
                    <?php echo "{$message}"; ?>
                </li>
            </div>
        </div>
    </div>
</div>
            <?php
            die('');
        }

        $this->secret_key = $phraseKey;
        $this->secret_iv = $phraseKey . "iv";

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
    protected function send_errors()
    {
        echo json_encode($this->errors);
    }

    /**
    *   Validates the submitted options data;
    *   @param  array    $data    an array of POST data;
    *   @return boolean based on a valid or invalid result;
    */
    protected function validate_data($data)
    {
        $wp_post_types = $this->get_wp_post_types();

        if(!Stackla_WP_Metabox_Validator::validate_string($data['stack'])) {
            $this->errors['stack'] = "You must submit a valid stack name";
        } else {
            $this->stackla_stack = $data['stack'];
        }

        if(!Stackla_WP_Metabox_Validator::validate_string($data['client_id'])) {
            $this->errors['client_id'] = 'You must submit a valid client id';
        } else {
            $this->stackla_client_id = $data['client_id'];
        }

        if(!Stackla_WP_Metabox_Validator::validate_string($data['client_secret'])) {
            $this->errors['client_secret'] = 'You must submit a valid client secret';
        } else {
            $this->stackla_client_secret = $data['client_secret'];
        }

        foreach($this->errors as $k => $v) {
            if($v !== false) {
                return false;
            }
        }

        $postTypes = array();
        if(isset($data['types'])) {
            foreach($data['types'] as $type) {
                if(!array_key_exists($type, $wp_post_types)) {
                    $this->errors[] = "The post type $type is not valid or does not exist";
                } else {
                    $postTypes[$type] = array('enabled' => true, 'mandatory' => false);
                }
            }


            foreach($this->errors as $k => $v) {
                if($v !== false) {
                    return false;
                }
            }
        }

        if(isset($data['mandatoryTypes'])) {
            foreach($data['mandatoryTypes'] as $type) {
                if(!array_key_exists($type, $wp_post_types)) {
                    $this->errors[] = "The post mandatory type $type is not valid or does not exist";
                } else {
                    if (!isset($postTypes[$type])) {
                        $postTypes[$type] = array();
                    }
                    $postTypes[$type]['mandatory'] = true;
                }
            }

            foreach($this->errors as $k => $v) {
                if($v !== false) {
                    return false;
                }
            }

        }

        if (!empty($postTypes)) {
            $this->stackla_post_types = $postTypes;
        }

        return true;
    }

    /**
    *   Sets the user_has_settings boolean to determine if a user already has settings;
    *   @return void;
    */
    protected function set_user_has_settings()
    {
        $statement = "SELECT `id` FROM $this->table";
        $results = $this->wpdb->get_var($statement);

        (!empty($results) || !$results || is_null($results)) ? $this->user_has_settings = true : $this->user_has_settings = false;
    }

    /**
    *   Inserts the posted data into the db;
    *   @param  array    $data   an array of validated POST data;
    *   @return void;
    */
    public function save($data)
    {
        $validated = $this->validate_data($data);

        if($validated === false) {
            $this->send_errors();
            return;
        }

        try {
            $this->wpdb->query("TRUNCATE TABLE $this->table");
            $this->wpdb->insert(
                $this->table,
                array(
                    'stackla_stack' => $this->stackla_stack,
                    'stackla_client_id' => $this->stackla_client_id,
                    'stackla_client_secret' => $this->stackla_client_secret,
                    'stackla_post_types' => json_encode($this->stackla_post_types)
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
        } catch (Exception $e) {
            $this->errors['request'] = $e->getMessage();
            $this->send_errors();
            return;
        }

        echo '1';
    }

    public function isPostTypeMandatory($postId)
    {
        $settings = $this->get_user_settings();

        $mandatory = true;
        if($settings && $postId) {
            if(isset($settings['stackla_post_types']) && $settings['stackla_post_types']) {
                $currentPostType = get_post_type($postId);
                if ($currentPostType) {
                    $post_types = json_decode($settings['stackla_post_types'], 1);

                    if (count($post_types)) {
                        foreach ($post_types as $typeName => $type) {
                            if ($typeName == $currentPostType && (!isset($type['mandatory']) || !$type['mandatory'])) {
                                $mandatory = false;
                            }
                        }
                    }
                }
            }
        }

        return $mandatory;
    }

    /**
    *   Clears ALL access tokens from the usermeta table;
    *   @return void;
    */
    public function clear_access_tokens()
    {
        $this->wpdb->delete($this->wpdb->usermeta , array('meta_key' => 'stackla_access_token') , array('%s'));
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
        $token = $this->encrypt_decrypt('encrypt', $token);
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
        $statement = "SELECT * FROM $this->table";
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
        $token = $this->encrypt_decrypt('decrypt', $token);

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

        return new Stackla\Core\Credentials(Stackla_WP_SDK_Wrapper::getHost(), null , $current['stackla_stack']);
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

        $callback_url = Stackla_WP_SDK_Wrapper::getCallbackUrl();
        $credentials = $this->get_credentials();
        $access_uri = $credentials->getAccessUri($current['stackla_client_id'], $current['stackla_client_secret'], $callback_url);

        return $access_uri;
    }

    public function log($str)
    {
        $date = date("Y-m-d h:i:s");
        file_put_contents('/tmp/stackla-wp.log', sprintf("[%s] %s\n", $date, $str), FILE_APPEND);
    }

    /**
     * simple method to encrypt or decrypt a plain text string
     * initialization vector(IV) has to be the same when encrypting and decrypting
     * PHP 5.4.9
     *
     * this is a beginners template for simple encryption decryption
     * before using this in production environments, please read about encryption
     *
     * @param string $action: can be 'encrypt' or 'decrypt'
     * @param string $string: string to encrypt or decrypt
     *
     * @return string
     */
    function encrypt_decrypt($action, $string) {
        $output = false;

        $encrypt_method = "AES-256-CBC";

        // hash
        $key = hash('sha256', $this->secret_key);

        // iv - encrypt method AES-256-CBC expects 16 bytes - else you will get a warning
        $iv = substr(hash('sha256', $this->secret_iv), 0, 16);

        if( $action == 'encrypt' ) {
            $output = openssl_encrypt($string, $encrypt_method, $key, 0, $iv);
            $output = base64_encode($output);
        }
        else if( $action == 'decrypt' ){
            $output = openssl_decrypt(base64_decode($string), $encrypt_method, $key, 0, $iv);
        }

        return $output;
    }

    /**
     * generateRandomString will generate x characters string
     * @param integer $length
     * @return string
     */
    public function generateRandomString($length = 10)
    {
        $characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ $!@#%^&*()_+~';
        $charactersLength = strlen($characters);
        $randomString = '';

        for ($i = 0; $i < $length; $i++) {
            $randomString .= $characters[rand(0, $charactersLength - 1)];
        }

        return $randomString;
    }

}
