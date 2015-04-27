<?php

/**
 * The public-facing functionality of the plugin.
 *
 * @link       http://example.com
 * @since      1.0.0
 *
 * @package    Stackla_WP
 * @subpackage Stackla_WP/public
 */

/**
 * The public-facing functionality of the plugin.
 *
 * Defines the plugin name, version, and two examples hooks for how to
 * enqueue the admin-specific stylesheet and JavaScript.
 *
 * @package    Stackla_WP
 * @subpackage Stackla_WP/public
 * @author     Your Name <email@example.com>
 */
class Stackla_WP_Public {

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
	 * @param      string    $plugin_name       The name of the plugin.
	 * @param      string    $version    The version of this plugin.
	 */
	public function __construct( $plugin_name, $version ) {

		$this->plugin_name = $plugin_name;
		$this->version = $version;

	}

	public function render_widget()
	{
		global $wp_query;

		$data = array(
			'title' => get_post_meta($wp_query->post->ID , Stackla_WP_Metabox::$title_meta_key , true),
			'tag' => get_post_meta($wp_query->post->ID , Stackla_WP_Metabox::$tag_meta_key , true),
			'tag_id' => get_post_meta($wp_query->post->ID , Stackla_WP_Metabox::$tag_id_meta_key , true),
			'terms' => get_post_meta($wp_query->post->ID , Stackla_WP_Metabox::$terms_meta_key , true),
			'filters' => get_post_meta($wp_query->post->ID , Stackla_WP_Metabox::$filters_meta_key , true),
		);

		if(Stackla_WP_Metabox_Validator::validate_string($data['tag_id']) === false)
		{
			echo 'These are not the widgets you\'re looking for';
			return;
		}

		$filters = json_decode($data['filters']);

		if(Stackla_WP_Metabox_Validator::validate_array($filters) === false)
		{
			echo 'Something\'s wrong, your widget doesn\'t have any filters'; 
			return;
		}

		echo "<nav class='stackla-widget-nav'>";
		echo 	"<ul class='stackla-widget-filters'>";

		foreach($filters as $filter)
		{
			echo	"<li class='stackla-widget-filter'>";
			echo 		"<a href='#' class='stackla-widget-anchor' data-filter='$filter->filterId'>$filter->name</a>";
			echo	"</li>";
		}

		echo 	"</ul>";
		echo "</nav>";
	}

	public function register_widget_shortcode()
	{
		add_shortcode('stackla' , array($this , 'render_widget'));
	}

	/**
	 * Register the stylesheets for the public-facing side of the site.
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

		wp_enqueue_style( $this->plugin_name, plugin_dir_url( __FILE__ ) . 'css/stackla-wp-public.css', array(), $this->version, 'all' );

	}

	/**
	 * Register the stylesheets for the public-facing side of the site.
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

		wp_enqueue_script( $this->plugin_name, plugin_dir_url( __FILE__ ) . 'js/stackla-wp-public.js', array( 'jquery' ), $this->version, false );

	}

}
