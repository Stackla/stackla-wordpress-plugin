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

        // Clean postmeta data related to stackla data
        $sql = "DELETE FROM {$wpdb->postmeta} pm WHERE pm.meta_key like 'stackla_wp_%';";
        $wpdb->query($sql);

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

        delete_user_meta(get_current_user_id() , 'stackla_access_token');

	}

}
