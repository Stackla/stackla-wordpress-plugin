<?php  
    error_reporting(E_ALL);
    ini_set('error_reporting', E_ALL);
    require_once('../../../../../wp-load.php');
    require_once('../../includes/class-stackla-wp-metabox.php');

    if(!isset($_GET['postId']))
    {
        echo json_encode(array('error' => 'The post id was not set'));
        return;
    }

    $metabox = new Stackla_WP_Metabox($_GET['postId']);
    $json = $metabox->get_json();

    echo $json;
?>