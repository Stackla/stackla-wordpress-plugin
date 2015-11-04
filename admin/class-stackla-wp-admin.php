<?php

/**
 * The admin-specific functionality of the plugin.
 *
 * @link       http://example.com
 * @since      1.0.0
 *
 * @package    Stackla_WP
 * @subpackage Stackla_WP/admin
 */

/**
 * The admin-specific functionality of the plugin.
 *
 * Defines the plugin name, version, and two examples hooks for how to
 * enqueue the admin-specific stylesheet and JavaScript.
 *
 * @package    Stackla_WP
 * @subpackage Stackla_WP/admin
 * @author     Your Name <email@example.com>
 */
class Stackla_WP_Admin {

	/**
	 * The ID of this plugin.
	 *
	 * @since    1.0.0
	 * @access   private
	 * @var      string    $plugin_name    The ID of this plugin.
	 */
	private $plugin_name;

	/**
	 * The version of this plugin.
	 *
	 * @since    1.0.0
	 * @access   private
	 * @var      string    $version    The current version of this plugin.
	 */
	private $version;

	/**
	 * Initialize the class and set its properties.
	 *
	 * @since    1.0.0
	 * @param      string    $plugin_name       The name of this plugin.
	 * @param      string    $version    The version of this plugin.
	 */

	public function __construct( $plugin_name , $version ) {

		$this->plugin_name = $plugin_name;
		$this->version = $version;
	}

	/**
	*   Adds the Stackla Settings link in the Settings sidebar nav;
	*	https://codex.wordpress.org/Function_Reference/add_options_page
	*   @return void;
	*/
	public function add_settings_link()
	{
		add_options_page(
			'Stackla',
			'Stackla',
			'manage_options',
			'stackla'
		);
	}

	/**
	*   Adds the Stackla Settings page;
	*	https://codex.wordpress.org/Function_Reference/add_menu_page
	*   @return void;
	*/

	public function add_settings_page()
	{
		add_menu_page(
			'Stackla',
			'Stackla',
			'manage_options',
			'stackla',
			array($this , 'render_settings_page'),
			plugin_dir_url(__FILE__).'/img/icon.png',
			'21.1'
		);
	}

	/**
	*   Includes the markup for the settings page;
	*   @return void;
	*/

	public function render_settings_page()
	{
        $stackla_wp_settings = new Stackla_WP_Settings;
        $settings = array(
            "current" => $stackla_wp_settings->get_user_settings(),
            "post_type_options" => $stackla_wp_settings->get_post_type_options(),
            "post_types" => false
        );
        $access_token = $stackla_wp_settings->get_user_access_token();
        $access_uri = $stackla_wp_settings->get_access_uri();
        $callback_url = Stackla_WP_SDK_Wrapper::getCallbackUrl();

        if(is_array($settings['current']) && isset($settings['current']['stackla_post_types']))
        {
            $settings['post_types'] = explode("," , $settings['current']['stackla_post_types']);
        }

        if($access_uri === false)
        {
            $state = 'init';
        }
        elseif($access_uri !== false && $access_token === false)
        {
            $state = 'authenticated';
        }
        else
        {
            $state = 'authorized';
        }

		include('partials/stackla-wp-admin-display.php');
	}

	/**
	 * Register the stylesheets for the admin area.
	 *
	 * @since    1.0.0
	 */
	public function enqueue_styles() {

		/**
		 * This function is provided for demonstration purposes only.
		 *
		 * An instance of this class should be passed to the run() function
		 * defined in Stackla_WP_Loader as all of the hooks are defined
		 * in that particular class.
		 *
		 * The Stackla_WP_Loader will then create the relationship
		 * between the defined hooks and the functions defined in this
		 * class.
		 */

		wp_enqueue_style( $this->plugin_name, plugin_dir_url( __FILE__ ) . 'css/stackla-wp-admin.css', array(), $this->version, 'all' );

	}

	/**
	 * Register the JavaScript for the admin area.
	 *
	 * @since    1.0.0
	 */
	public function enqueue_scripts() {

		/**
		 * This function is provided for demonstration purposes only.
		 *
		 * An instance of this class should be passed to the run() function
		 * defined in Stackla_WP_Loader as all of the hooks are defined
		 * in that particular class.
		 *
		 * The Stackla_WP_Loader will then create the relationship
		 * between the defined hooks and the functions defined in this
		 * class.
		 */

		if(preg_match('/(?i)msie [7-9]/', $_SERVER['HTTP_USER_AGENT']))
		{
			wp_enqueue_script( 'console-polyfill', plugin_dir_url( __FILE__ ) . 'js/console-polyfill.js', array(), $this->version , false );
			wp_enqueue_script( 'es5-shim', plugin_dir_url( __FILE__ ) . 'js/es5-shim.min.js', array(), $this->version , false );
			wp_enqueue_script( 'html5shiv', plugin_dir_url( __FILE__ ) . 'js/html5shiv.min.js', array(), $this->version , false );
		}

		wp_enqueue_script( $this->plugin_name, plugin_dir_url( __FILE__ ) . 'js/stackla-wp-admin.js', array( 'jquery' ), $this->version, false );
	}

}
