<?php  
    wp_nonce_field( basename( __FILE__ ), 'stackla_for_wordpress_nonce' );
    $metabox = new Stackla_WP_Metabox($object->ID);
    $settings = new Stackla_WP_Settings;
    $access_token = $settings->get_user_access_token();
    $widget_json = $metabox->get_json();
?>
<?php  
    if(!$access_token):
?>
    <div class='auth-notification failure'>
        <p>
            You have not authorized this plugin instance with Stackla. To authorize, please visit the 
            <a href="<?php echo get_admin_url()?>/?page=stackla"> settings page</a>. Until your plugin is authorized, you will unable to make changes to your Stack from WordPress.
        </p>
    </div>
<?php
    endif;
?>
<div id='stackla-metabox' 
    data-stackla='<?php echo $widget_json; ?>'
    data-postid="<?php echo $object->ID ?>"
    data-validator="<?php echo plugin_dir_url(__FILE__) ?>stackla-wp-admin-handler-metabox-validator.php"
    data-handler="<?php echo plugin_dir_url(__FILE__) ?>stackla-wp-admin-handler-metabox.php"
    data-token="<?php echo ($access_token) ? $access_token : '' ?>"
></div>