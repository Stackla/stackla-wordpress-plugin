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
    public static $tags_table = 'stackla_tags';
    public static $terms_table = 'stackla_terms';
    public static $filters_table = 'stackla_filters';

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
        self::create_tags_table($wpdb);
        self::create_terms_table($wpdb);
        self::create_filters_table($wpdb);
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
        `stackla_api_key` TEXT NOT NULL ,
        `stackla_post_types` TEXT NOT NULL
        ) ENGINE = InnoDB ;";

        $wpdb->query($statement);
    }

    /**
    *   Creates the stackla tags table if it does not already exist;
    *   @param {$wpdb} a WordPress database connection object;
    *   @return void;
    */

    private static function create_tags_table($wpdb)
    {
        $statement = "CREATE TABLE IF NOT EXISTS " . self::$tags_table . " (
        `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY ,
        `stackla_tag_id` INT NOT NULL ,
        `stackla_tag_name` VARCHAR (255) NOT NULL ,
        `stackla_term_id` INT NOT NULL,
        `wp_post_id` INT NOT NULL
        ) ENGINE = InnoDB ;";

        $wpdb->query($statement);
    }

    /**
    *   Creates the stackla terms table if it does not already exist;
    *   @param {$wpdb} a WordPress database connection object;
    *   @return void;
    */

    private static function create_terms_table($wpdb)
    {
        $statement = "CREATE TABLE IF NOT EXISTS " . self::$terms_table . " (
        `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY ,
        `stackla_term_id` INT NOT NULL ,
        `stackla_term_name` VARCHAR (255) NOT NULL,
        `stackla_term_type` VARCHAR (255) NOT NULL,
        `wp_post_id` INT NOT NULL
        ) ENGINE = InnoDB ;";

        $wpdb->query($statement);
    }

    /**
    *   Creates the stackla filters table if it does not already exist;
    *   @param {$wpdb} a WordPress database connection object;
    *   @return void;
    */

    private static function create_filters_table($wpdb)
    {
        $statement = "CREATE TABLE IF NOT EXISTS " . self::$filters_table . " (
        `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY ,
        `stackla_filter_id` INT NOT NULL ,
        `stackla_tag_id` INT NOT NULL ,
        `stackla_filter_name` VARCHAR (255) NOT NULL,
        `stackla_media_type` VARCHAR (255) NOT NULL,
        `stackla_sort_by` VARCHAR (255) NOT NULL,
        `wp_post_id` INT NOT NULL
        ) ENGINE = InnoDB ;";

        $wpdb->query($statement);
    }

}