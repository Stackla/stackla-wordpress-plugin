<?php
    error_reporting(E_ALL);
    ini_set('error_reporting', E_ALL);
    require_once('../../../../../wp-load.php');
    require_once('../../includes/vendor/autoload.php');
    require_once('../../includes/class-stackla-wp-metabox.php');
    require_once('../../includes/class-stackla-wp-sdk-wrapper.php');

    $post_id = $_POST['postId'];
    $title = "WP-{$post_id}";
    $terms = $_POST['terms'];
    $filters = $_POST['filters'];
    $widget = $_POST['widget'];

    $settings = new Stackla_WP_Settings();
    $mandatory = $settings->isPostTypeMandatory($post_id);
    $validator = new Stackla_WP_Metabox_Validator($_POST);
    $valid = $validator->validate();

    if ($valid) {
        $metabox = new Stackla_WP_Metabox($post_id);
        $sdk = new Stackla_WP_SDK_Wrapper($post_id);
        $oldData = $metabox->get_data();
        $oldWidget = json_decode($oldData['widget'], 1);

        if($sdk === false)
        {
            echo $sdk->get_errors();
            exit();
        }

        $stackla_tag = $sdk->push_tag($title);

        if($stackla_tag === false)
        {
            echo $sdk->get_errors();
            exit();
        }

        $metabox->set_stackla_wp_tag($stackla_tag);

        $stackla_terms = $sdk->push_terms($terms , $stackla_tag, $title . " - ");
        $stackla_filters = $sdk->push_filters($filters , $stackla_tag, $title . " - ");
        $stackla_widget = $sdk->push_widget($title , $stackla_filters[0] , $widget, $oldWidget);

        $sdk_valid = $sdk->validate();

        if($sdk_valid === false || $stackla_widget === false)
        {
            echo $sdk->get_errors();
            die();
        }

        $metabox->set_data($_POST);

        $metabox->set_stackla_wp_terms($stackla_terms);
        $metabox->set_stackla_wp_filters($stackla_filters);
        $metabox->set_stackla_wp_widget($stackla_widget);

        echo json_encode(array('errors' => false , 'result' => '1'));
    } elseif (!$mandatory) {
        echo json_encode(array('errors' => false , 'result' => '1'));
    } else {
        echo json_encode(array('errors' => $validator->errors , 'result' => '0'));
    }

?>
