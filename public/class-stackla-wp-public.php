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
 * @author     Stackla <tech@stackla.com>
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
		$post_id = $wp_query->post->ID;
		$data = array(
			'title' => get_post_meta($post_id , Stackla_WP_Metabox::$title_meta_key , true),
			'tag' => get_post_meta($post_id , Stackla_WP_Metabox::$tag_meta_key , true),
			'tag_id' => get_post_meta($post_id , Stackla_WP_Metabox::$tag_id_meta_key , true),
			'terms' => get_post_meta($post_id , Stackla_WP_Metabox::$terms_meta_key , true),
			// 'filters' => get_post_meta($post_id , Stackla_WP_Metabox::$filters_meta_key , true),
			'embed' => get_post_meta($post_id , Stackla_WP_Metabox::$widget_embed_meta_key , true),
			'widget' => get_post_meta($post_id , Stackla_WP_Metabox::$widget_meta_key , true)
		);

		if(Stackla_WP_Metabox_Validator::validate_string($data['tag_id']) === false)
		{
			echo 'You don\'t seem to have a Stackla Tag ID set, please try saving your Stackla For WordPress metabox for this post again.' ;
			return;
		}

		// $filters = json_decode($data['filters']);

		// if(Stackla_WP_Metabox_Validator::validate_array($filters) === false)
		// {
		//     echo 'You don\'t seem to have a Stackla Filter set, please try saving your Stackla For WordPress metabox for this post again.' ;
		//     return;
		// }

		if(Stackla_WP_Metabox_Validator::validate_string($data['embed']) === false)
		{
			echo 'You don\'t seem to have a widget embed code, please try saving your Stackla For WordPress metabox for this post again.';
			return;
		}

		if(Stackla_WP_Metabox_Validator::validate_string($data['widget']) === false)
		{
			echo 'You don\'t seem to have any widget data saved, please try saving your Stackla For WordPress metabox for this post again';
			return;
		}

		$widget_data = json_decode($data['widget']);
		$widget_id = $widget_data->id;

        $html = "";
		$html .=	"<div class='stackla-widget-wrapper' data-widgetid='$widget_id'>";
		// $html .= 		"<nav class='stackla-widget-nav'>";
		// $html .= 			"<ul class='stackla-widget-filters'>";

		// foreach($filters as $filter)
		// {
		//     $html .=			"<li class='stackla-widget-filter'>";
		//     $html .= 				"<a href='#' class='stackla-widget-anchor' data-filter='$filter->filterId'>$filter->name</a>";
		//     $html .=			"</li>";
		// }

		// $html .= 			"</ul>";
		// $html .= 		"</nav>";


		$html .= 		$data['embed'];
		$html .= 	"</div>";

        return $html;
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
