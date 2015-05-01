<?php  
    wp_nonce_field( basename( __FILE__ ), 'stackla_for_wordpress_nonce' );
    $metabox = new Stackla_WP_Metabox($object->ID);
    $settings = new Stackla_WP_Settings;
    $sdk = new Stackla_WP_SDK_Wrapper;
    $access_token = $settings->get_user_access_token();
    $access_uri = $settings->get_access_uri();
    $metabox_json = $metabox->get_json();
    $widgets_json = ($access_token) ? $metabox->set_json($sdk->get_widgets()) : '';
?>
<div id='stackla-metabox'
    data-stackla='<?php echo $metabox_json; ?>'
    data-postid="<?php echo $object->ID ?>"
    data-validator="<?php echo plugin_dir_url(__FILE__) ?>stackla-wp-admin-handler-metabox-validator.php"
    data-handler="<?php echo plugin_dir_url(__FILE__) ?>stackla-wp-admin-handler-metabox.php"
    data-accessuri="<?php echo $access_uri ?>"
    data-token="<?php echo ($access_token) ? '1' : '' ?>"
    data-widgets='<?php echo $widgets_json; ?>'
></div>