<?php

/**
 * The admin-specific functionality of the plugin.
 *
 * @link       https://stackla.com
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
 * @author     Stackla <tech@stackla.com>
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
        try{
            $sdk = new Stackla_WP_SDK_Wrapper();
        } catch (Exception $e) {
            $stackla_wp_settings->log($e->getMessage());
        }
        $settings = array(
            "current" => $stackla_wp_settings->get_user_settings(),
            "post_type_options" => $stackla_wp_settings->get_post_type_options(),
            "post_types" => false
        );
        $access_token = $stackla_wp_settings->get_user_access_token();
        if ($access_token) {
            $access_token = $sdk->isTokenValid();
        }
        $access_uri = $stackla_wp_settings->get_access_uri();
        $enableAuthorize = false;
        if (
            !empty($settings['current']) &&
            !empty($settings['current']['stackla_stack']) &&
            !empty($settings['current']['stackla_client_id']) &&
            !empty($settings['current']['stackla_client_secret'])
           ) {
            $enableAuthorize = true;
        }

        if(is_array($settings['current']) && isset($settings['current']['stackla_post_types']))
        {
            $settings['post_types'] = json_decode($settings['current']['stackla_post_types'], 1);
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

		wp_enqueue_script(
            $this->plugin_name,
            plugin_dir_url( __FILE__ ) . 'js/stackla-wp-admin.js',
            array( 'jquery' ),
            $this->version,
            true
        );
	}

    public function query_vars($vars)
    {
        $vars[] = 'code';
        return $vars;
    }

    public function template_redirect()
    {
        if (get_query_var('code')) {
            $code = get_query_var('code');
            $settings = new Stackla_WP_Settings();
            $currentSettings = $settings->get_user_settings();

            /** @var Stackla\Core\Credentials $credentials */
            $credentials = $settings->get_credentials();
            // $access_uri = $settings->get_access_uri();
            $access_token = $settings->get_user_access_token();
            $token_response = false;
            $token_saved = false;
            $callback_url = Stackla_WP_SDK_Wrapper::getCallbackUrl();

            if($credentials !== false && $currentSettings !== false) {
                try {
                    $token_response = $credentials->generateToken(
                        $currentSettings['stackla_client_id'],
                        $currentSettings['stackla_client_secret'],
                        $code,
                        $callback_url
                    );
                    if($token_response) {
                        $access_token = $credentials->token;
                        $token_saved = $settings->save_access_token($access_token);
                    }
                } catch(Exception $e) {
                    $settings->log($e->getMessage());
                }
            }
            wp_redirect(admin_url('admin.php?page=stackla'));
            die();
        }
    }

    public function wp_ajax_revoke_token()
    {
        try {
            $settings = new Stackla_WP_Settings();
            $settings->clear_access_tokens();
            echo json_encode(array('status' => true));
        } catch(Exception $e) {
            $settings->log($e->getMessage());
        }

        wp_die();
    }

    public function wp_ajax_setting_save()
    {
        $settings = new Stackla_WP_Settings;
        $settings->save($_POST);

        wp_die();
    }

    public function wp_ajax_metabox_validation()
    {
        $validator = new Stackla_WP_Metabox_Validator($_POST);
        $valid = $validator->validate();

        echo json_encode(array('errors' => $validator->errors, 'result' => $valid ? '1' : '0'));

        wp_die();
    }

    public function wp_ajax_metabox_save()
    {
        $post_id = $_POST['postId'];
        $tagName = "WP-{$post_id}";
        $terms = empty($_POST['terms']) ? array() : $_POST['terms'];
        // $filters = $_POST['filters'];
        $widget = $_POST['widget'];
        $mediaType = isset($_POST['media_type']) ? $_POST['media_type'] : array();

        // $settings = new Stackla_WP_Settings();
        $validator = new Stackla_WP_Metabox_Validator($_POST);
        $valid = $validator->validate();

        $response = array('errors' => false, 'result' => '1');
        try {
            if ($valid) {
                if (!$validator->emptyTerm) {
                    $metabox = new Stackla_WP_Metabox($post_id);
                    $sdk = new Stackla_WP_SDK_Wrapper($post_id);
                    $oldData = $metabox->get_data();
                    $oldWidget = json_decode($oldData['widget'], 1);

                    $defaultTag = $sdk->push_tag($tagName);

                    if ($defaultTag === false) {
                        echo $sdk->get_errors();
                        wp_die();
                    }
                    $metabox->set_stackla_wp_tag($defaultTag);

                    $defaultFilter = $sdk->prepareDefaultFilter($defaultTag, $tagName . " - ", $mediaType);

                    if ($defaultFilter === false && $defaultTag === false) {
                        echo $sdk->get_errors();
                        wp_die();
                    }
                    $metabox->set_stackla_wp_defaultFilter($defaultFilter);
                    $metabox->set_stackla_wp_defaultFilterMedia($mediaType);

                    $stackla_terms = $sdk->push_terms($terms, $defaultTag, $tagName . " - ");
                    // $stackla_filters = $sdk->push_filters($filters , $defaultTag, $tagName . " - ");
                    $stackla_widget = $sdk->push_widget($tagName, $defaultFilter, $widget, $oldWidget);

                    $sdk_valid = $sdk->validate();

                    if ($sdk_valid === false || $stackla_widget === false) {
                        echo $sdk->get_errors();
                        wp_die();
                    }

                    $responseData[Stackla_WP_Metabox::$terms_meta_key] = $metabox->set_json($stackla_terms);
                    $responseData[Stackla_WP_Metabox::$filter_id_meta_key] = $defaultFilter->id;
                    $responseData[Stackla_WP_Metabox::$media_type_meta_key] = $metabox->set_json($mediaType);
                    $responseData[Stackla_WP_Metabox::$widget_meta_key] = $metabox->set_json(array(
                        'id' => $stackla_widget['id'],
                        'copyId' => $stackla_widget['copyId'],
                        'style' => $stackla_widget['style'],
                        'type' => $stackla_widget['type']
                    ));

                    $responseData[Stackla_WP_Metabox::$widget_embed_meta_key] = $stackla_widget['embed'];

                    $metabox->set_stackla_wp_terms($stackla_terms);
                    // $metabox->set_stackla_wp_filters($stackla_filters);
                    $metabox->set_stackla_wp_widget($stackla_widget);

                    $response['data'] = $responseData;
                }
            } else {
                $response['errors'] = $validator->errors;
                $response['result'] = '0';
            }
        } catch (Exception $e) {
            $response['errors'] = array(
                'title' => $e->getMessage()
            );
            $response['result'] = '0';
        }
        echo json_encode($response);

        wp_die();
    }
}
