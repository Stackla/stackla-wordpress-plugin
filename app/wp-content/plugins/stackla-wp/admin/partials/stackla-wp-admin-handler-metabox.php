<?php  
    error_reporting(E_ALL);
    ini_set('error_reporting', E_ALL);
    require_once('../../../../../wp-load.php');
    require_once('../../includes/vendor/autoload.php');
    require_once('../../includes/class-stackla-wp-metabox.php');
    require_once('../../includes/class-stackla-wp-sdk-wrapper.php');

    $testing = true;
    $test_data = [
        'postId' => 66,
        'title' => 'Testing SDK v3',
        'terms' => [
            [
                'edited'=> true,
                'errors'=> false,
                'id'=> 0,
                'name'=> "term v5",
                'network'=> "instagram",
                'term'=> "user",
                'termDelimited'=> "instagram-user",
                'termId'=> "",
                'termValue'=> "rohandeshpande"
            ],
            [
                'edited'=> true,
                'errors'=> false,
                'id'=> 1,
                'name'=> "term 2 v5",
                'network'=> "twitter",
                'term'=> "user",
                'termDelimited'=> "twitter-username",
                'termId'=> "531",
                'termValue'=> "rohandeshpande_"
            ]
        ],
        'filters' => [
            [
                'edited'=> true,
                'errors'=> false,
                'id'=> 0,
                'media'=> [],
                'name'=> "filter v5",
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

    if(isset($_POST['removeStacklaTerm']) && $_POST['removeStacklaTerm'] === true)
    {
        $result = $sdk->remove_term($_POST['termId']);
        if($result)
        {
            echo 'term removed';
        }
        else
        {
            echo 'term not removed';
        }
        return;
    }
    
    $metabox_results = $metabox->set_data(($testing) ? $test_data : $_POST);

    $stackla_tag = $sdk->push_tag($title.'-'.$post_id);
    $stackla_terms = $sdk->push_terms($terms);
    $stackla_filters = $sdk->push_filters($filters);

    $metabox->set_stackla_wp_terms($stackla_terms);
    $metabox->set_stackla_wp_filters($stackla_filters);

    echo 'success';
?>