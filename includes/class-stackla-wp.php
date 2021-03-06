<?php

/**
 * The file that defines the core plugin class
 *
 * A class definition that includes attributes and functions used across both the
 * public-facing side of the site and the admin area.
 *
 * @link       https://stackla.com
 * @since      1.0.0
 *
 * @package    Stackla_WP
 * @subpackage Stackla_WP/includes
 */

/**
 * The core plugin class.
 *
 * This is used to define internationalization, admin-specific hooks, and
 * public-facing site hooks.
 *
 * Also maintains the unique identifier of this plugin as well as the current
 * version of the plugin.
 *
 * @since      1.0.0
 * @package    Stackla_WP
 * @subpackage Stackla_WP/includes
 * @author     Stackla <tech@stackla.com>
 */
class Stackla_WP {

	/**
	 * The loader that's responsible for maintaining and registering all hooks that power
	 * the plugin.
	 *
	 * @since    1.0.0
	 * @access   protected
	 * @var      Stackla_WP_Loader    $loader    Maintains and registers all hooks for the plugin.
	 */
	protected $loader;

	/**
	 * The unique identifier of this plugin.
	 *
	 * @since    1.0.0
	 * @access   protected
	 * @var      string    $plugin_name    The string used to uniquely identify this plugin.
	 */
	protected $plugin_name;

	/**
	 * The current version of the plugin.
	 *
	 * @since    1.0.0
	 * @access   protected
	 * @var      string    $version    The current version of the plugin.
	 */
	protected $version;

	/**
	 * Define the core functionality of the plugin.
	 *
	 * Set the plugin name and the plugin version that can be used throughout the plugin.
	 * Load the dependencies, define the locale, and set the hooks for the admin area and
	 * the public-facing side of the site.
	 *
	 * @since    1.0.0
	 */
	public function __construct() {

		$this->plugin_name = 'stackla-wp';
		$this->version = '1.0.0';

		$this->load_dependencies();
		$this->set_locale();
		$this->define_admin_hooks();
		$this->define_public_hooks();
	}

	/**
	 * Load the required dependencies for this plugin.
	 *
	 * Include the following files that make up the plugin:
	 *
	 * - Stackla_WP_Loader. Orchestrates the hooks of the plugin.
	 * - Stackla_WP_i18n. Defines internationalization functionality.
	 * - Stackla_WP_Admin. Defines all hooks for the admin area.
	 * - Stackla_WP_Public. Defines all hooks for the public side of the site.
	 *
	 * Create an instance of the loader which will be used to register the hooks
	 * with WordPress.
	 *
	 * @since    1.0.0
	 * @access   private
	 */
	private function load_dependencies() {

		/**
		 * Autoload the Stackla PHP SDK dependencies;
		 */

		require_once plugin_dir_path( dirname( __FILE__ ) ) . 'includes/vendor/autoload.php';

		/**
		*   Utility functions;
		*/
		require_once plugin_dir_path( dirname( __FILE__ ) ) . 'includes/U.php';

		/**
		 * The class responsible for orchestrating the actions and filters of the
		 * core plugin.
		 */
		require_once plugin_dir_path( dirname( __FILE__ ) ) . 'includes/class-stackla-wp-loader.php';

		/**
		 * The class responsible for defining internationalization functionality
		 * of the plugin.
		 */
		require_once plugin_dir_path( dirname( __FILE__ ) ) . 'includes/class-stackla-wp-i18n.php';

		/**
		 * The class responsible for handling the settings
		 * of the plugin.
		 */
		require_once plugin_dir_path( dirname( __FILE__ ) ) . 'includes/class-stackla-wp-settings.php';

		/**
		 * The class responsible for validating the metabox data
		 * of the plugin.
		 */
		require_once plugin_dir_path( dirname( __FILE__ ) ) . 'includes/class-stackla-wp-metabox-validator.php';

		/**
		 * The class responsible for wrapping the Stackla PHP SDK
		 * of the plugin.
		 */
		require_once plugin_dir_path( dirname( __FILE__ ) ) . 'includes/class-stackla-wp-sdk-wrapper.php';

		/**
		 * The class responsible for handling the metabox connection to the db
		 * of the plugin.
		 */
		require_once plugin_dir_path( dirname( __FILE__ ) ) . 'includes/class-stackla-wp-metabox.php';

		/**
		 * The class responsible for handling the removal of both wordpress and stackla data
		 * of the plugin.
		 */
		require_once plugin_dir_path( dirname( __FILE__ ) ) . 'includes/class-stackla-wp-remover.php';

		/**
		 * The class responsible for handling the custom metaboxes
		 * of the plugin.
		 */
		require_once plugin_dir_path( dirname( __FILE__ ) ) . 'admin/class-stackla-wp-metaboxes.php';

		/**
		 * The class responsible for defining all actions that occur in the admin area.
		 */
		require_once plugin_dir_path( dirname( __FILE__ ) ) . 'admin/class-stackla-wp-admin.php';

		/**
		 * The class responsible for defining all actions that occur in the public-facing
		 * side of the site.
		 */
		require_once plugin_dir_path( dirname( __FILE__ ) ) . 'public/class-stackla-wp-public.php';


		$this->loader = new Stackla_WP_Loader();

	}

	/**
	 * Define the locale for this plugin for internationalization.
	 *
	 * Uses the Stackla_WP_i18n class in order to set the domain and to register the hook
	 * with WordPress.
	 * @since    1.0.0
	 * @access   private
	 */
	private function set_locale() {

		$plugin_i18n = new Stackla_WP_i18n();
		$plugin_i18n->set_domain( $this->get_plugin_name() );

		$this->loader->add_action( 'plugins_loaded', $plugin_i18n, 'load_plugin_textdomain' );

	}

	/**
	 * Register all of the hooks related to the admin area functionality
	 * of the plugin.
	 *
	 * @since    1.0.0
	 * @access   private
	 */
	private function define_admin_hooks() {

		$plugin_admin = new Stackla_WP_Admin( $this->get_plugin_name(), $this->get_version() );
		$metaboxes = new Stackla_WP_Metaboxes;
		$remover = new Stackla_WP_Remover;

        if (!Stackla_WP::hasCurlModule()) {
			add_action('admin_notices', array('Stackla_WP', 'curlModuleError'));
        }

		$this->loader->add_action('wp_ajax_stackla_setting_save', $plugin_admin, 'wp_ajax_setting_save');
		$this->loader->add_action('wp_ajax_stackla_revoke_token', $plugin_admin, 'wp_ajax_revoke_token');
		$this->loader->add_action('wp_ajax_stackla_metabox_save', $plugin_admin, 'wp_ajax_metabox_save');
		$this->loader->add_action('wp_ajax_stackla_metabox_validation', $plugin_admin, 'wp_ajax_metabox_validation');
		$this->loader->add_action('admin_enqueue_scripts', $plugin_admin, 'enqueue_styles');
		$this->loader->add_action('admin_enqueue_scripts', $plugin_admin, 'enqueue_scripts');
        $this->loader->add_action('query_vars' , $plugin_admin , 'query_vars');
        $this->loader->add_action('template_redirect' , $plugin_admin , 'template_redirect');
		$this->loader->add_action('admin_menu' , $plugin_admin , 'add_settings_page');
		$this->loader->add_action('add_meta_boxes' , $metaboxes , 'setup_metaboxes');
		$this->loader->add_action('before_delete_post' , $remover , 'remove_metabox_widget');
	}

	/**
	 * Register all of the hooks related to the public-facing functionality
	 * of the plugin.
	 *
	 * @since    1.0.0
	 * @access   private
	 */
	private function define_public_hooks() {

		$plugin_public = new Stackla_WP_Public( $this->get_plugin_name(), $this->get_version() );

		$this->loader->add_action('wp_enqueue_scripts', $plugin_public, 'enqueue_styles');
		$this->loader->add_action('wp_enqueue_scripts', $plugin_public, 'enqueue_scripts');
		$this->loader->add_action('template_redirect' , $plugin_public , 'register_widget_shortcode');
	}

	/**
	 * Run the loader to execute all of the hooks with WordPress.
	 *
	 * @since    1.0.0
	 */
	public function run() {
		$this->loader->run();
	}

	/**
	 * The name of the plugin used to uniquely identify it within the context of
	 * WordPress and to define internationalization functionality.
	 *
	 * @since     1.0.0
	 * @return    string    The name of the plugin.
	 */
	public function get_plugin_name() {
		return $this->plugin_name;
	}

	/**
	 * The reference to the class that orchestrates the hooks with the plugin.
	 *
	 * @since     1.0.0
	 * @return    Stackla_WP_Loader    Orchestrates the hooks of the plugin.
	 */
	public function get_loader() {
		return $this->loader;
	}

	/**
	 * Retrieve the version number of the plugin.
	 *
	 * @since     1.0.0
	 * @return    string    The version number of the plugin.
	 */
	public function get_version() {
		return $this->version;
	}

	/**
	 * Check if php-cUrl module is available.
	 *
	 * @since     1.0.4
	 * @return    bool
	 */
    public static function hasCurlModule() {
        if (extension_loaded('curl')) {
            return true;
        }

        return false;
    }

	/**
	 * Construct cURL error message.
	 *
	 * @since     1.0.4
	 * @return    null
	 */
    public static function curlModuleError() {
        ?>
<div class="error notice">
	<p><?php _e( '<b>Stackla for WordPress</b> plugin requires the PHP cURL module. Please contact your server administrator to find out how to enable PHP cURL on your server.', 'stackla_wp_error_message' ); ?></p>
</div>
        <?php
    }

}
