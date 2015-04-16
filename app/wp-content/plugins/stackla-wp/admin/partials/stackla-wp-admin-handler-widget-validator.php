<?php  
    error_reporting(E_ALL);
    ini_set('error_reporting', E_ALL);
    require_once('../../includes/class-stackla-wp-widget-validator.php');

    $validator = new Stackla_WP_Widget_Validator($_POST);
    $valid = $validator->validate();

    if($valid === false)
    {
        echo json_encode(array('errors' => $validator->errors , 'result' => '0'));
    }
    else
    {
        echo json_encode(array('errors' => $validator->errors , 'result' => '1'));
    }
?>