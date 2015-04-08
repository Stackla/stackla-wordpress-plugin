<?php
/**
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
 * Defines the options page for the plugin
 *
 * @since      1.0.0
 * @package    Stackla_WP
 * @subpackage Stackla_WP/includes
 * @author     Rohan Deshpande <rohan.deshpande@stackla.com>
 */

class Stackla_WP_Options {


    public function __construct()
    {
        $this->register_settings();
    }

    private function register_settings()
    {
        
    }
}