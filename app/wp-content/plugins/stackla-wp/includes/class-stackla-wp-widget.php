<?php

/**
 * Fetch and save widget data;
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

class Stackla_WP_Widget {

    protected $data;
    protected $id;
    protected $title_meta_key = "stackla_wp_title";
    protected $terms_meta_key = "stackla_wp_terms";
    protected $filters_meta_key = "stackla_wp_filters";
    protected $tag_meta_key = "stackla_wp_tag";
    protected $tag_id_meta_key = "stackla_wp_tag_id";
    protected $terms_id_meta_key = "stackla_wp_terms_id";
    protected $filters_id_meta_key = "stackla_wp_filters_id";

    /**
    *   -- CONSTRUCTOR --
    *   Sets the existing widget data for a post;
    *   @param {$id} a post id;
    *   @return void;
    */

    public function __construct($id)
    {
        //todo; consider getting all this in one query
        
        $this->id = $id;
        $this->data = array(
            "title" => get_post_meta($this->id , $this->title_meta_key , true),
            "terms" => get_post_meta($this->id , $this->terms_meta_key , true),
            "filters" => get_post_meta($this->id , $this->filters_meta_key , true),
            "tag" => get_post_meta($this->id , $this->tag_meta_key , true),
            "tag_id" => get_post_meta($this->id , $this->tag_id_meta_key , true),
            "terms_id" => get_post_meta($this->id , $this->terms_id_meta_key , true),
            "filters_id" => get_post_meta($this->id , $this->filters_id_meta_key , true)
        );
    }

    /**
    *   Returns the widget object data as an array;
    *   @return {$this->data} an associative array containing all the widget data;
    */

    public function get_data()
    {
        return $this->data;
    }

    /**
    *   Returns the widget object data as a json string;
    *   @return {$this->data} a json string which has special characters turned into their hex values;
    */

    public function get_json()
    {
        return json_encode($this->data , JSON_HEX_TAG | JSON_HEX_APOS | JSON_HEX_QUOT | JSON_HEX_AMP | JSON_UNESCAPED_UNICODE);
    }

    public function set_data($new)
    {
        $results = array();

        foreach($this->data as $k => $v)
        {
            switch($k)
            {
                case "title":
                    if($v === '')
                    {
                        $results['title'] = add_post_meta($this->id , $this->title_meta_key , $new['title']);
                    }
                    else
                    {
                        $results['title'] = update_post_meta($this->id , $this->title_meta_key , $new['title']);
                    }
                break;
                case "terms":
                    if($v === '')
                    {
                        $results['terms'] = add_post_meta($this->id , $this->terms_meta_key , json_encode($new['terms']));
                    }
                    else
                    {
                        $results['terms'] = update_post_meta($this->id , $this->terms_meta_key , json_encode($new['terms']));
                    }
                break;
                case "filters":
                    if($v === '')
                    {
                        $results['filters'] = add_post_meta($this->id , $this->filters_meta_key , json_encode($new['filters']));
                    }
                    else
                    {
                        $results['filters'] = update_post_meta($this->id , $this->filters_meta_key , json_encode($new['filters']));
                    }
                break;
                case "tag":
                    if($v === '')
                    {
                        $results['tag'] = add_post_meta($this->id , $this->tag_meta_key , $new['title'].'-'.$this->id);
                    }
                    else
                    {
                        $results['tag'] = update_post_meta($this->id , $this->tag_meta_key , $new['title'].'-'.$this->id);
                    }
                break;
            }
        }

        return $results;
    }
}
