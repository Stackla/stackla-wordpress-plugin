<?php  
    wp_nonce_field( basename( __FILE__ ), 'stackla_for_wordpress_nonce' );
    $widget = new Stackla_WP_Widget($object->ID);
    $widget_data = $widget->get_data();
?>
<div id='stackla-metabox' 
    data-stackla='<?php echo json_encode($widget_data) ?>'
    data-handler="<?php echo plugin_dir_url(__FILE__) ?>stackla-wp-admin-handler-widget.php"
></div>