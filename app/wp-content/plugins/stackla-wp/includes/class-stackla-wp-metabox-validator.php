<?php

/**
 * Validate metabox data;
 *
 *
 * @package    Stackla_WP
 * @subpackage Stackla_WP/includes
 * @author     Rohan Deshpande <rohan.deshpande@stackla.com>
 */

class Stackla_WP_Metabox_Validator {

    private $data;
    protected $allowed_networks = ['twitter' , 'facebook' , 'instagram' , 'youtube'];
    protected $allowed_media = ['text' , 'image' , 'video'];
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
    *   Sets the data the validator validates;
    *   @param {$data} the data to validate;
    *   @return void;
    */
    public function __construct($data)
    {
        $this->data = $data;
        $this->errors['title'] = false;
        $this->errors['terms'] = array();
        $this->errors['filters'] = array();
    }

    /**
    *   Validates a string;
    *   @param {$var} a string;
    *   @return boolean;
    */
    public static function validate_string($var)
    {
        return (!$var || $var === '' || strlen($var) <= 0 || !isset($var)) ? false : true;
    }

    /**
    *   Validates an array;
    *   @param {$var} an array;
    *   @return boolean;
    */
    public static function validate_array($var)
    {
        return (!is_array($var) || empty($var)) ? false : true;
    }

    /**
    *   Validates the widget title field;
    *   Pushes the result into the $this->errors array;
    *   @return void;
    */
    protected function validate_widget_title()
    {
        if(self::validate_string($this->data['title']) === false)
        {
            $this->errors['title'] = $this->error_title;
        }
    }

    /**
    *   Validates the widget's terms;
    *   Pushes the result into the $this->errors array;
    *   @return void;
    */
    protected function validate_widget_terms()
    {
        foreach($this->data['terms'] as $term)
        {
            $this->errors['terms'][$term['id']] = array(
                'name' => false,
                'network' => false,
                'term' => false,
                'termValue' => false
            );

            //don't validate removed terms

            if($term['removed'] === true || $term['removed'] === 'true')
            {
                $this->errors['terms'][$term['id']] = false;
                continue;
            }

            if(self::validate_string($term['name']) === false)
            {
                $this->errors['terms'][$term['id']]['name'] = $this->error_term_name;
            }

            if(self::validate_string($term['network']) === false)
            {
                $this->errors['terms'][$term['id']]['network'] = $this->error_network;
            }

            if(!in_array($term['network'] , $this->allowed_networks))
            {
                $this->errors['terms'][$term['id']]['network'] = $this->error_illegal_network;
            }

            if(self::validate_string($term['term']) === false)
            {
                $this->errors['terms'][$term['id']]['term'] = $this->error_term_term;
            }

            if(self::validate_string($term['termValue']) === false)
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
    *   @return void;
    */
    protected function validate_widget_filters()
    {
        foreach($this->data['filters'] as $filter)
        {
            $this->errors['filters'][$filter['id']] = array(
                'name' => false,
                'network' => false,
                'media' => false,
                'sorting' => false
            );

            //don't validate removed filters

            if($filter['removed'] === true || $filter['removed'] === 'true')
            {
                $this->errors['filters'][$filter['id']] = false;
                continue;
            }

            if(self::validate_string($filter['name']) === false)
            {
                $this->errors['filters'][$filter['id']]['name'] = $this->error_filter_name;
            }

            if(isset($filter['media']) && self::validate_array($filter['media']))
            {
                foreach($filter['media'] as $media)
                {
                    if(!in_array($media , $this->allowed_media))
                    {
                        $this->errors['filters'][$filter['id']]['media'] = $this->error_illegal_media;
                    }
                }
            }

            if(isset($filter['network']) && self::validate_array($filter['network']))
            {
                foreach($filter['network'] as $network)
                {
                    if(!in_array($network , $this->allowed_networks))
                    {
                        $this->errors['filters'][$filter['id']]['network'] = $this->error_illegal_network;
                    }
                }
            }

            if(self::validate_string($filter['sorting']) === false)
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
    *   Runs all validation methods; Determines if valid is true or false;
    *   @return void;
    */
    public function validate()
    {
        $this->validate_widget_title();
        $this->validate_widget_terms();
        $this->validate_widget_filters();

        if($this->errors['title'] !== false)
        {
            return false;
        }

        if(empty($this->errors['terms']) || empty($this->errors['filters']))
        {
            return false;
        }

        if(
            count($this->data['terms']) !== count($this->errors['terms']) || 
            count($this->data['filters']) !== count($this->errors['filters'])
        )
        {
            return false;
        }

        foreach($this->errors['terms'] as $k => $v)
        {
            if($v !== false)
            {
                return false;
            }
        }

        foreach($this->errors['filters'] as $k => $v)
        {
            if($v !== false)
            {
                return false;
            }
        }

        return true;
    }
}
