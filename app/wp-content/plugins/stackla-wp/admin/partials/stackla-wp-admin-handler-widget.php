<?php  
    error_reporting(E_ALL);
    ini_set('error_reporting', E_ALL);
    require_once('../../../../../wp-load.php');
    require_once('../../includes/class-stackla-wp-widget.php');

    $widget = new Stackla_WP_Widget(false);
    $widget->validate($_POST);
    echo json_encode(array('errors' => $widget->errors));
?>