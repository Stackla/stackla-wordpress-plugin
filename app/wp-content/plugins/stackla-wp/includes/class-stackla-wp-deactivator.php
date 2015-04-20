<?php

/**
 * Fired during plugin deactivation
 *
 * @link       http://example.com
 * @since      1.0.0
 *
 * @package    Stackla_WP
 * @subpackage Stackla_WP/includes
 */

/**
 * Fired during plugin deactivation.
 *
 * This class defines all code necessary to run during the plugin's deactivation.
 *
 * @since      1.0.0
 * @package    Stackla_WP
 * @subpackage Stackla_WP/includes
 * @author     Your Name <email@example.com>
 */

require_once('class-stackla-wp-activator.php');

class Stackla_WP_Deactivator {

	/**
	 * Short Description. (use period)
	 *
	 * Long Description.
	 *
	 * @since    1.0.0
	 */
	public static function deactivate() 
    {
        if(WP_DEBUG === false) return;

        global $wpdb;
        
        $tables = array(
            Stackla_WP_Activator::$settings_table
        );

        foreach($tables as $table)
        {
            $sql = "DROP TABLE IF EXISTS $table";

            try
            {
                $wpdb->query($sql);
            }
            catch (Exception $e)
            {
                echo $e->getMessage();
            }
        }

	}

}
