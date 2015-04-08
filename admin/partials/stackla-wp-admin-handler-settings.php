<?php  
    error_reporting(E_ALL);
    ini_set('error_reporting', E_ALL);
    require_once('../../../../../wp-load.php');
    require_once('../../includes/class-stackla-wp-settings.php');

    $settings = new Stackla_WP_Settings;
    $settings->save($_POST);
?>