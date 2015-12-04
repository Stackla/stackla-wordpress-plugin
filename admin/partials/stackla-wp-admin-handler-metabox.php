<?php
error_reporting(E_ALL);
ini_set('error_reporting', E_ALL);
require_once '../../../../../wp-load.php';
require_once '../../includes/vendor/autoload.php';
require_once '../../includes/class-stackla-wp-metabox.php';
require_once '../../includes/class-stackla-wp-sdk-wrapper.php';

$post_id = $_POST['postId'];
$tagName = "WP-{$post_id}";
$terms = $_POST['terms'];
// $filters = $_POST['filters'];
$widget = $_POST['widget'];
$mediaType = isset($_POST['media_type']) ? $_POST['media_type'] : array();

$settings = new Stackla_WP_Settings();
$validator = new Stackla_WP_Metabox_Validator($_POST);
$valid = $validator->validate();

$response = array('errors' => false, 'result' => '1');
try {
    if ($valid) {
        $metabox = new Stackla_WP_Metabox($post_id);
        $sdk = new Stackla_WP_SDK_Wrapper($post_id);
        $oldData = $metabox->get_data();
        $oldWidget = json_decode($oldData['widget'], 1);

        $defaultTag = $sdk->push_tag($tagName);

        if ($defaultTag === false) {
            echo $sdk->get_errors();
            exit();
        }
        $metabox->set_stackla_wp_tag($defaultTag);

        $defaultFilter = $sdk->prepareDefaultFilter($defaultTag, $tagName . " - ", $mediaType);

        if ($defaultFilter === false && $defaultTag === false) {
            echo $sdk->get_errors();
            exit();
        }
        $metabox->set_stackla_wp_defaultFilter($defaultFilter);
        $metabox->set_stackla_wp_defaultFilterMedia($mediaType);

        $stackla_terms = $sdk->push_terms($terms, $defaultTag, $tagName . " - ");
        // $stackla_filters = $sdk->push_filters($filters , $defaultTag, $tagName . " - ");
        $stackla_widget = $sdk->push_widget($tagName, $defaultFilter, $widget, $oldWidget);

        $sdk_valid = $sdk->validate();

        if ($sdk_valid === false || $stackla_widget === false) {
            echo $sdk->get_errors();
            die();
        }

        $responseData[Stackla_WP_Metabox::$terms_meta_key] = $metabox->set_json($stackla_terms);
        $responseData[Stackla_WP_Metabox::$filter_id_meta_key] = $defaultFilter->id;
        $responseData[Stackla_WP_Metabox::$media_type_meta_key] = $metabox->set_json($mediaType);
        $responseData[Stackla_WP_Metabox::$widget_meta_key] = $metabox->set_json(array(
            'id' => $stackla_widget['id'],
            'copyId' => $stackla_widget['copyId'],
            'style' => $stackla_widget['style'],
            'type' => $stackla_widget['type']
        ));

        $responseData[Stackla_WP_Metabox::$widget_embed_meta_key] = $stackla_widget['embed'];

        $metabox->set_stackla_wp_terms($stackla_terms);
        // $metabox->set_stackla_wp_filters($stackla_filters);
        $metabox->set_stackla_wp_widget($stackla_widget);

        $response['data'] = $responseData;
    } else {
        $response['errors'] = $validator->errors;
        $response['result'] = '0';
    }
} catch (Exception $e) {
    $response['errors'] = array(
        'title' => $e->getMessage()
    );
    $response['result'] = '0';
}
echo json_encode($response);

