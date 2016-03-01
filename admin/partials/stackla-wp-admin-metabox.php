<?php
    wp_nonce_field( basename( __FILE__ ), 'stackla_for_wordpress_nonce' );
    $metabox = new Stackla_WP_Metabox($object->ID);
    $settings = new Stackla_WP_Settings;
    try {
        $sdk = new Stackla_WP_SDK_Wrapper;
        $access_token = $settings->get_user_access_token();
        $access_uri = $settings->get_access_uri();
        $metabox_json = $metabox->get_json();
        $widgets_json = ($access_token) ? $metabox->set_json($sdk->get_widgets()) : '';
    } catch (Exception $e) { // if error exception happen, we assumpt that will be the invalid token
        $access_token = false;
    }
?>
<div id='stackla-metabox'
    data-stackla="<?php echo esc_attr($metabox_json); ?>"
    data-postid="<?php echo esc_attr($object->ID) ?>"
    data-accessuri="<?php echo esc_attr($access_uri) ?>"
    data-token="<?php echo ($access_token) ? '1' : '' ?>"
    data-widgets='<?php echo esc_attr($widgets_json) ?>'
></div>
