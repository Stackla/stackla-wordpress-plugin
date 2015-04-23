<?php  
    error_reporting(E_ALL);
    ini_set('error_reporting', E_ALL);
    require_once('../../../../../wp-load.php');
    require_once('../../includes/vendor/autoload.php');
    require_once('../../includes/class-stackla-wp-metabox.php');
    require_once('../../includes/class-stackla-wp-sdk-wrapper.php');

    $post_id = $_POST['postId'];
    $title = $_POST['title'];
    $terms = $_POST['terms'];
    $filters = $_POST['filters'];

    $metabox = new Stackla_WP_Metabox($post_id);
    $sdk = new Stackla_WP_SDK_Wrapper($post_id);

    $metabox_results = $metabox->set_data($_POST);

    $stackla_tag = $sdk->push_tag($title.'-'.$post_id);
    $stackla_terms = $sdk->push_terms($terms , $stackla_tag);
    $stackla_filters = $sdk->push_filters($filters , $stackla_tag);

    $metabox->set_stackla_wp_tag($stackla_tag);
    $metabox->set_stackla_wp_terms($stackla_terms);
    $metabox->set_stackla_wp_filters($stackla_filters);

    echo 'success';
?>