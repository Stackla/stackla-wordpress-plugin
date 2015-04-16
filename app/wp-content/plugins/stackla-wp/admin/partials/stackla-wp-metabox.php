<?php  
    wp_nonce_field( basename( __FILE__ ), 'stackla_for_wordpress_nonce' );
    $widget = new Stackla_WP_Widget($object->ID);
    $widget_json = $widget->get_json();
?>
<div id='stackla-metabox' 
    data-stackla='<?php echo $widget_json; ?>'
    data-postid="<?php echo $object->ID ?>"
    data-validator="<?php echo plugin_dir_url(__FILE__) ?>stackla-wp-admin-handler-widget-validator.php"
    data-handler="<?php echo plugin_dir_url(__FILE__) ?>stackla-wp-admin-handler-widget.php"
></div>