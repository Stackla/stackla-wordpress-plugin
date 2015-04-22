<?php

/**
 * Fetch and save metabox data;
 *
 *
 *  @package    Stackla_WP
 *  @subpackage Stackla_WP/includes
 *  @author     Rohan Deshpande <rohan.deshpande@stackla.com>
 *  @see        https://codex.wordpress.org/Function_Reference/get_post_meta
 *  @see        https://codex.wordpress.org/Function_Reference/add_post_meta
 *  @see        https://codex.wordpress.org/Function_Reference/update_post_meta
 */

require_once('class-stackla-wp-activator.php');

class Stackla_WP_Metabox 
{
    protected static $data;
    protected $id;

    public static $title_meta_key = "stackla_wp_title";
    public static $terms_meta_key = "stackla_wp_terms";
    public static $filters_meta_key = "stackla_wp_filters";
    public static $tag_meta_key = "stackla_wp_tag";
    public static $tag_id_meta_key = "stackla_wp_tag_id";

    /**
    *   -- CONSTRUCTOR --
    *   Sets the existing metabox data for a post;
    *   @param  int $id a post id;
    *   @return void;
    */

    public function __construct($id)
    {
        //todo; consider getting all this in one query
        
        $this->id = $id;
        self::$data = array(
            "title" => get_post_meta($this->id , self::$title_meta_key , true),
            "terms" => get_post_meta($this->id , self::$terms_meta_key , true),
            "filters" => get_post_meta($this->id , self::$filters_meta_key , true),
            "tag" => get_post_meta($this->id , self::$tag_meta_key , true),
            "tag_id" => get_post_meta($this->id , self::$tag_id_meta_key , true),
        );
    }

    /**
    *   Returns the metabox object data as an array;
    *   @return array   self::$data an associative array containing all the metabox data;
    */

    public function get_data()
    {
        return self::$data;
    }

    /**
    *   Returns the metabox object data as a json string;
    *   @return string  self::$data a json string which has special characters turned into their hex values;
    */

    public function get_json()
    {
        return json_encode(self::$data , JSON_HEX_TAG | JSON_HEX_APOS | JSON_HEX_QUOT | JSON_HEX_AMP | JSON_UNESCAPED_UNICODE);
    }

    public function set_json($data)
    {
        return json_encode($data , JSON_HEX_TAG | JSON_HEX_APOS | JSON_HEX_QUOT | JSON_HEX_AMP | JSON_UNESCAPED_UNICODE);
    }

    /**
    *   Sets the data of the metabox;
    *   @param  array   $new        the new data to be saved;
    *   @return array   $results    the results of the save;
    */

    public function set_data($new)
    {
        $results = array();

        foreach(self::$data as $k => $v)
        {
            switch($k)
            {
                case "title":
                    $this->set_stackla_wp_title($new['title']);
                break;
                case "terms":
                    $this->set_stackla_wp_terms($new['terms']);
                break;
                case "filters":
                    $this->set_stackla_wp_filters($new['filters']);
                break;
            }
        }

        return $results;
    }

    public function set_stackla_wp_tag(Stackla\Api\Tag $tag)
    {
        if(self::$data['tag'] === '')
        {
            add_post_meta($this->id , self::$tag_meta_key , $tag->tag);
        }
        else
        {
            update_post_meta($this->id , self::$tag_meta_key , $tag->tag);
        }

        if(self::$data['tag_id'] === '')
        {
            add_post_meta($this->id , self::$tag_id_meta_key , $tag->id);
        }
        else
        {
            update_post_meta($this->id , self::$tag_id_meta_key , $tag->id);
        }
    }

    public function set_stackla_wp_title($title)
    {
        if(self::$data['title'] === '')
        {
            add_post_meta($this->id , self::$title_meta_key , $title);
        }
        else
        {
            update_post_meta($this->id , self::$title_meta_key , $title);
        }
    }

    public function set_stackla_wp_terms($terms)
    {
        if(self::$data['terms'] === '')
        {
            add_post_meta($this->id , self::$terms_meta_key , $this->set_json($terms));
        }
        else
        {
            update_post_meta($this->id , self::$terms_meta_key , $this->set_json($terms));
        }
    }

    public function set_stackla_wp_filters($filters)
    {
        if(self::$data['filters'] === '')
        {
            add_post_meta($this->id , self::$filters_meta_key , $this->set_json($filters));
        }
        else
        {
            update_post_meta($this->id , self::$filters_meta_key , $this->set_json($filters));
        }
    }
}
