<?php

/**
 * The plugin bootstrap file
 *
 * This file is read by WordPress to generate the plugin information in the plugin
 * admin area. This file also includes all of the dependencies used by the plugin,
 * registers the activation and deactivation functions, and defines a function
 * that starts the plugin.
 *
 * @link              http://stackla.com
 * @since             1.0.0
 * @package           Stackla_WP
 *
 * @wordpress-plugin
 * Plugin Name:       Stackla
 * Plugin URI:        http://stackla.com/
 * Description:       Enables Stackla widget integrations with the WordPress platform.
 * Version:           1.0.4
 * Author:            Stackla
 * Author URI:        http://stackla.com/
 * License:           GPLv2 or later
 */

// If this file is called directly, abort.
if ( ! defined( 'WPINC' ) ) {
	die;
}

/**
 * The code that runs during plugin activation.
 * This action is documented in includes/class-stackla-wp-activator.php
 */
function activate_stackla_wp() {
	require_once plugin_dir_path( __FILE__ ) . 'includes/class-stackla-wp-activator.php';
	Stackla_WP_Activator::activate();
}

/**
 * The code that runs during plugin deactivation.
 * This action is documented in includes/class-stackla-wp-deactivator.php
 */
function deactivate_stackla_wp() {
	require_once plugin_dir_path( __FILE__ ) . 'includes/class-stackla-wp-deactivator.php';
	Stackla_WP_Deactivator::deactivate();
}

register_activation_hook( __FILE__, 'activate_stackla_wp' );
register_deactivation_hook( __FILE__, 'deactivate_stackla_wp' );

/**
 * The core plugin class that is used to define internationalization,
 * admin-specific hooks, and public-facing site hooks.
 */
require_once plugin_dir_path( __FILE__ ) . 'includes/class-stackla-wp.php';

/**
 * Begins execution of the plugin.
 *
 * Since everything within the plugin is registered via hooks,
 * then kicking off the plugin from this point in the file does
 * not affect the page life cycle.
 *
 * @since    1.0.0
 */
function run_stackla_wp() {

	$plugin = new Stackla_WP();
	$plugin->run();

}
run_stackla_wp();
