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
    *   @param {$id:optional} a post id;
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

    /**
    *   Validates a string;
    *   @param {$var} a string;
    *   @return boolean;
    */

    protected function validate_string($var)
    {
        return (!$var || $var == '' || strlen($var) <= 0) ? false : true;
    }

    /**
    *   Validates an array;
    *   @param {$var} an array;
    *   @return boolean;
    */

    protected function validate_array($var)
    {
        return (!is_array($var) || empty($var)) ? false : true;
    }

    /**
    *   Validates the widget title field;
    *   Pushes the result into the $this->errors array;
    *   @param {$data} an array of data passed by the client;
    *   @return void;
    */

    protected function validate_widget_title($data)
    {
        $this->errors['title'] = false;

        if($this->validate_string($data['title']) === false)
        {
            $this->errors['title'] = $this->error_title;
        }
    }

    /**
    *   Validates the widget's terms;
    *   Pushes the result into the $this->errors array;
    *   @param {$data} an array of data passed by the client;
    *   @return void;
    */

    public function validate_widget_terms($data)
    {
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

            if(
                $this->errors['terms'][$term['id']]['name'] === false &&
                $this->errors['terms'][$term['id']]['network'] === false &&
                $this->errors['terms'][$term['id']]['term'] === false &&
                $this->errors['terms'][$term['id']]['termValue'] === false
            )
            {
                $this->errors['terms'][$term['id']] = false;
            }
        }
    }

    /**
    *   Validates the widget's filters;
    *   Pushes the result into the $this->errors array;
    *   @param {$data} an array of data passed by the client;
    *   @return void;
    */

    protected function validate_widget_filters($data)
    {
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

            if(isset($filter['network']) && $this->validate_array($filter['network']))
            {
                foreach($filter['network'] as $network)
                {
                    if(!in_array($network , $this->allowed_networks))
                    {
                        $this->errors['filters'][$filter['id']]['network'] = $this->error_illegal_network;
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

            if(
                $this->errors['filters'][$filter['id']]['name'] === false &&
                $this->errors['filters'][$filter['id']]['network'] === false &&
                $this->errors['filters'][$filter['id']]['media'] === false &&
                $this->errors['filters'][$filter['id']]['sorting'] === false
            )
            {
                $this->errors['filters'][$filter['id']] = false;
            }
        }
    }

    /**
    *   Runs all validation methods;
    *   @param {$data} an array of data passed by the client;
    *   @return void;
    */

    public function validate($data)
    {
        $this->validate_widget_title($data);
        $this->validate_widget_terms($data);
        $this->validate_widget_filters($data);        
    }
}
