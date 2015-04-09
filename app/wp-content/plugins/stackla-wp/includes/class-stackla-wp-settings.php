<?php

/**
 * Fetch and save the plugin's settings.
 *
 *
 * @package    Stackla_WP
 * @subpackage Stackla_WP/includes
 * @author     Rohan Deshpande <rohan.deshpande@stackla.com>
 */

class Stackla_WP_Settings {

    private static $table;
    public static $errors = array();
    protected static $exclude_options = array(
        'attachment'
    );

    public function __construct()
    {
        self::$table = Stackla_WP_Activator::$settings_table;
    }

    public static function get_post_type_options()
    {
        $post_types = get_post_types(array(
            'public' => true
        ));

        foreach(self::$exclude_options as $option)
        {
            if(array_key_exists($option, $post_types))
            {
                unset($post_types[$option]);
            }
        }

        return $post_types;
    }

    public static function save_settings($data)
    {
        global $wpdb;

        $key = $data['apiKey'];
        $types;

        if(!isset($data['types']))
        {
            $types = '';
        }
        else
        {
            $types = implode(',' , $data['types']);
        }

        echo $key;
        echo $types;
    }

    public static function validate_api_key($key)
    {
        if($key === false || $key == '')
        {
            self::$errors[] = "You must submit a valid API key"
        }
    }

    public static function validate_post_type($type)
    {
        //todo;
    }
}
