<?php

/**
 * Fetch, validate and save widget data;
 *
 *
 * @package    Stackla_WP
 * @subpackage Stackla_WP/includes
 * @author     Rohan Deshpande <rohan.deshpande@stackla.com>
 */

require_once('class-stackla-wp-activator.php');

class Stackla_WP_Widget {

    protected $data;
    protected $allowed_networks = ['twitter' , 'facebook' , 'instagram' , 'youtube'];
    protected $allowed_media = ['text-only' , 'images' , 'video'];
    protected $allowed_sorting = ['latest' , 'greatest' , 'votes'];
    protected $error_title = "You must set a widget title";
    protected $error_terms = "You must define at least one term";
    protected $error_filters = "You must define at least one filter";
    protected $error_term_name = "You must set a valid term name";
    protected $error_network = "You must set a valid network name";
    protected $error_illegal_network = "The network you selected is not allowed";
    protected $error_term_term = "You must enter a valid term";
    protected $error_term_value = "You must enter a valid term value";
    protected $error_filter_name = "You must set a valid filter name";
    protected $error_filter_network = "You must set a valid network name";
    protected $error_illegal_media = "The media type you've selected is not allowed";
    protected $error_filter_sorting = "You must enter a valid sorting method";
    protected $error_filter_illegal_sorting = "The sorting method you've selected is not allowed";

    public $errors = array();

    /**
    *   -- CONSTRUCTOR --
    *   Gets the existing widget data for a post;
    *   @param {$id[optional]} a post id;
    *   @return void;
    */

    public function __construct($id = false)
    {
        if($id)
        {
            $this->data = array(
                "title" => get_post_meta($id , 'stackla_wp_title' , true),
                "terms" => get_post_meta($id , 'stackla_wp_terms' , true),
                "filters" => get_post_meta($id , 'stackla_wp_filters' , true),
                "tag" => get_post_meta($id , 'stackla_wp_tag' , true)
            );
        }
    }

    /**
    *   Returns the widget object data;
    *   @return {$this->data} an associative array containing all the widget data;
    */

    public function get_data()
    {
        return $this->data;
    }

    protected function validate_string($var)
    {
        if(!$var || $var == '') return false;
        return true;
    }

    protected function validate_array($var)
    {
        return (!is_array($var) || empty($var)) ? false : true;
    }

    public function validate($data)
    {
        /*
            Validate higher level values...
        */

        if($this->validate_string($data['title']) === false)
        {
            $this->errors[] = array('title' => $this->error_title);
        }

        if(!isset($data['terms']) || $this->validate_array($data['terms']) === false)
        {
            $this->errors[] = array('terms' => $this->error_terms);
        }

        if(!isset($data['filters']) || $this->validate_array($data['filters']) === false)
        {
            $this->errors[] = array('filters' => $this->error_filters);
        }

        if(!empty($this->errors))
        {
            return false;
        }

        /*
            Validate terms...
        */

        $this->errors['terms'] = array();

        foreach($data['terms'] as $term)
        {
            $this->errors['terms'][$term['id']] = array(
                'name' => false,
                'network' => false,
                'term' => false,
                'termValue' => false
            );

            if($this->validate_string($term['name']) === false)
            {
                $this->errors['terms'][$term['id']]['name'] = $this->error_term_name;
            }

            if($this->validate_string($term['network']) === false)
            {
                $this->errors['terms'][$term['id']]['network'] = $this->error_network;
            }

            if(!in_array($term['network'] , $this->allowed_networks))
            {
                $this->errors['terms'][$term['id']]['network'] = $this->error_illegal_network;
            }

            if($this->validate_string($term['term']) === false)
            {
                $this->errors['terms'][$term['id']]['term'] = $this->error_term_term;
            }

            if($this->validate_string($term['termValue']) === false)
            {
                $this->errors['terms'][$term['id']]['termValue'] = $this->error_term_value;
            }
        }

        /*
            Validate filters...
        */

        $this->errors['filters'] = array();

        foreach($data['filters'] as $filter)
        {
            $this->errors['filters'][$filter['id']] = array(
                'name' => false,
                'network' => false,
                'media' => false,
                'sorting' => false
            );

            if($this->validate_string($filter['name']) === false)
            {
                $this->errors['filters'][$filter['id']]['name'] = $this->error_filter_name;
            }

            if($this->validate_string($filter['network']) === false)
            {
                $this->errors['filters'][$filter['id']]['network'] = $this->error_network;
            }

            if(!in_array($filter['network'] , $this->allowed_networks))
            {
                $this->errors['filters'][$filter['id']]['network'] = $this->error_illegal_network;
            }

            if(isset($filter['media']) && $this->validate_array($filter['media']))
            {
                foreach($filter['media'] as $media)
                {
                    if(!in_array($media , $this->allowed_media))
                    {
                        $this->errors['filters'][$filter['id']]['media'] = $this->error_illegal_media;
                    }
                }
            }

            if($this->validate_string($filter['sorting']) === false)
            {
                $this->errors['filters'][$filter['id']]['sorting'] = $this->error_filter_sorting;
            }

            if(!in_array($filter['sorting'] , $this->allowed_sorting))
            {
                $this->errors['filters'][$filter['id']]['sorting'] = $this->error_filter_illegal_sorting;
            }
        }
    }
}
