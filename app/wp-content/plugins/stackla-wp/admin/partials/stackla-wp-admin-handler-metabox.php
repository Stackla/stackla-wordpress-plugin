<?php  
    error_reporting(E_ALL);
    ini_set('error_reporting', E_ALL);
    require_once('../../../../../wp-load.php');
    require_once('../../includes/class-stackla-wp-metabox.php');

    $metabox = new Stackla_WP_Metabox($_POST['postId']);
    $results = $metabox->set_data($_POST);
    echo json_encode($results);
?>