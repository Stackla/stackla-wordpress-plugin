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
    
    public function render_metabox($object , $box)
    {
        include($this->view);
    }
}