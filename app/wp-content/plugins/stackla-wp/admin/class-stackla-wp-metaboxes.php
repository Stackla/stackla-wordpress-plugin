<?php

class Stackla_WP_Metaboxes
{
    private $config;
    private $view = 'partials/stackla-wp-admin-metabox.php';

    protected function add_metabox($post_type)
    {
        add_meta_box(
            'stackla-meta-box',
            'Stackla For WordPress',
            array($this , 'render_metabox'),
            $post_type,
            'normal',
            'high'
        );
    }

    public function setup_metaboxes()
    {
        $this->config = new Stackla_WP_Settings;
        $settings = $this->config->get_user_settings();

        if($settings === false) return;

        if(!$settings['stackla_post_types'] || $settings['stackla_post_types'] == '') return;

        $post_types = explode(',' , $settings['stackla_post_types']); 
        
        foreach($post_types as $post_type)
        {
            $this->add_metabox($post_type);
        }
    }

    public function save_metabox($post_id)
    {
        $post = get_post($post_id);

        if(!isset($_POST['stackla_for_wordpress_nonce']))
        {
            //todo - verify the wp nonce;
            return $post_id;
        }

        $meta_key = 'stackla-widget-title';
        $new_meta_value = $_POST['stackla-widget-title'];
        $current_meta_value = get_post_meta($post_id , $meta_key , true);

        if($current_meta_value)
        {
            update_post_meta($post_id , $meta_key , $new_meta_value);
        }
        else
        {
            add_post_meta($post_id , $meta_key , $new_meta_value);
        }
    }

    public function render_metabox($object , $box)
    {
        include($this->view);
    }
}