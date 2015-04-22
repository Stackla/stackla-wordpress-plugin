<?php  
    error_reporting(E_ALL);
    ini_set('error_reporting', E_ALL);
    require_once('../../../../../wp-load.php');
    require_once('../../includes/vendor/autoload.php');
    require_once('../../includes/class-stackla-wp-metabox.php');
    require_once('../../includes/class-stackla-wp-sdk-wrapper.php');

    $testing = false;
    $test_data = [
        'postId' => 66,
        'title' => 'Rohan Test v9',
        'terms' => [
            [
                'removed' => false,
                'edited'=> true,
                'errors'=> false,
                'id'=> 0,
                'name'=> "Rohan term 1 v9",
                'network'=> "instagram",
                'term'=> "user",
                'termDelimited'=> "instagram-user",
                'termId'=> "",
                'termValue'=> "rohandeshpande"
            ],
            [
                'removed' => false,
                'edited'=> true,
                'errors'=> false,
                'id'=> 1,
                'name'=> "Rohan term 2 v9",
                'network'=> "twitter",
                'term'=> "user",
                'termDelimited'=> "twitter-username",
                'termId'=> "",
                'termValue'=> "rohandeshpande_"
            ]
        ],
        'filters' => [
            [
                'edited'=> true,
                'errors'=> false,
                'id'=> 0,
                'media'=> [],
                'name'=> "Rohan filter 1 v9",
                'network'=> ["twitter" , "facebook"],
                'sorting'=> "latest",
                'filterId'=> '8371'
            ]
        ]
    ];

    $post_id = ($testing) ? $test_data['postId'] : $_POST['postId'];
    $title = ($testing) ? $test_data['title'] : $_POST['title'];
    $terms = ($testing) ? $test_data['terms'] : $_POST['terms'];
    $filters = ($testing) ? $test_data['filters'] : $_POST['filters'];

    $metabox = new Stackla_WP_Metabox($post_id);
    $sdk = new Stackla_WP_SDK_Wrapper($post_id);

    $metabox_results = $metabox->set_data(($testing) ? $test_data : $_POST);

    $stackla_tag = $sdk->push_tag($title.'-'.$post_id);
    $stackla_terms = $sdk->push_terms($terms);
    $stackla_filters = $sdk->push_filters($filters);

    $metabox->set_stackla_wp_terms($stackla_terms);
    $metabox->set_stackla_wp_filters($stackla_filters);

    echo 'success';
?>