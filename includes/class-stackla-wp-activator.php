<?php

/**
 * Fired during plugin activation
 *
 * @link       http://example.com
 * @since      1.0.0
 *
 * @package    Stackla_WP
 * @subpackage Stackla_WP/includes
 */

/**
 * Fired during plugin activation.
 *
 * This class defines all code necessary to run during the plugin's activation.
 *
 * @since      1.0.0
 * @package    Stackla_WP
 * @subpackage Stackla_WP/includes
 * @author     Rohan Deshpande <rohan.deshpande@stackla.com>
 */
class Stackla_WP_Activator {

    public static $settings_table = 'stackla_settings';

	/**
	 * Creates the plugin specific database tables.
	 *
	 *
	 * @since    1.0.0
	 */
	public static function activate() 
    {
        global $wpdb;

        self::create_settings_table($wpdb);
	}

    /**
    *   Creates the stackla settings table if it does not already exist;
    *   @param {$wpdb} a WordPress database connection object;
    *   @return void;
    */

    private static function create_settings_table($wpdb)
    {
        $statement = "CREATE TABLE IF NOT EXISTS " . self::$settings_table . " (
        `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY ,
        `stackla_stack` TEXT NOT NULL ,
        `stackla_client_id` TEXT NOT NULL ,
        `stackla_client_secret` TEXT NOT NULL ,
        `stackla_callback_uri` TEXT NOT NULL ,
        `stackla_post_types` TEXT NOT NULL
        ) ENGINE = InnoDB ;";

        $wpdb->query($statement);
    }
}