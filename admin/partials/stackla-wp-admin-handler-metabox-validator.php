<?php
    error_reporting(E_ALL);
    ini_set('error_reporting', E_ALL);
    require_once('../../../../../wp-load.php');
    require_once('../../includes/vendor/autoload.php');
    require_once('../../includes/class-stackla-wp-metabox-validator.php');

    $post_id = isset($_POST['postId']) ? $_POST['postId'] : false;
    $settings = new Stackla_WP_Settings();
    $validator = new Stackla_WP_Metabox_Validator($_POST);
    $valid = $validator->validate();

    if ($valid) {
        echo json_encode(array('errors' => $validator->errors, 'result' => '1'));
    } else {
        echo json_encode(array('errors' => $validator->errors, 'result' => '0'));
    }
