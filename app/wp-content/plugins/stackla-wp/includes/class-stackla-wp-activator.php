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

    private static $tags_table = 'wp_stackla_tags';
    private static $terms_table = 'wp_stackla_terms';
    private static $filters_table = 'wp_stackla_filters';

	/**
	 * Creates the plugin specific database tables.
	 *
	 *
	 * @since    1.0.0
	 */
	public static function activate() 
    {
        global $wpdb;

        self::create_tags_table($wpdb);
        self::create_terms_table($wpdb);
        self::create_filters_table($wpdb);
	}

    /**
    *   Sets the statement for creating the stackla tags table;
    *   @param {$wpdb} a WordPress database connection object;
    *   @return {$statement} an SQL statement;
    */

    protected static function create_tags_table($wpdb)
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
    *   Sets the statement for creating the stackla terms table;
    *   @param {$wpdb} a WordPress database connection object;
    *   @return {$statement} an SQL statement;
    */

    protected static function create_terms_table($wpdb)
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
    *   Sets the statement for creating the stackla filters table;
    *   @param {$wpdb} a WordPress database connection object;
    *   @return {$statement} an SQL statement;
    */

    protected static function create_filters_table($wpdb)
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