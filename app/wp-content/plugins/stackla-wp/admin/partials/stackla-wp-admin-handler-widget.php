<?php  
    error_reporting(E_ALL);
    ini_set('error_reporting', E_ALL);
    require_once('../../../../../wp-load.php');
    require_once('../../includes/class-stackla-wp-widget.php');

    $widget = new Stackla_WP_Widget($_POST['postId']);
    $results = $widget->set_data($_POST);
    echo json_encode($results);
?>