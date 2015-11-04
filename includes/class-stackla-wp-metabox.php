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
    /**
    *   @var    $data                   array   an array of the post's stackla post meta;
    *   @var    $id                     int     the post's id;
    *   @var    $title_meta_key         string  postmeta table key for the widget title;
    *   @var    $terms_meta_key         string  postmeta table key for the widget terms json;
    *   @var    $filters_meta_key       string  postmeta table key for the widget filters json;
    *   @var    $tag_meta_key           string  postmeta table key for the widget tag name;
    *   @var    $tag_id_meta_key        string  postmeta table key for the widget tag id;
    *   @var    $widget_meta_key        string  postmeta table key for the widget config json;
    *   @var    $widget_embed_meta_key  string  postmeta table key for the widget embed code;
    */

    protected static $data;
    protected $id;
    public static $title_meta_key = "stackla_wp_title";
    public static $terms_meta_key = "stackla_wp_terms";
    public static $filters_meta_key = "stackla_wp_filters";
    public static $tag_meta_key = "stackla_wp_tag";
    public static $tag_id_meta_key = "stackla_wp_tag_id";
    public static $widget_meta_key = "stackla_wp_widget";
    public static $widget_embed_meta_key = "stackla_wp_widget_embed";

    /**
    *   -- CONSTRUCTOR --
    *   Sets the existing metabox data for a post;
    *   @param  int $id a post id;
    *   @return void;
    */
    public function __construct($id)
    {
        $this->id = $id;

        self::$data = array(
            "title" => get_post_meta($this->id , self::$title_meta_key , true),
            "terms" => get_post_meta($this->id , self::$terms_meta_key , true),
            "filters" => get_post_meta($this->id , self::$filters_meta_key , true),
            "tag" => get_post_meta($this->id , self::$tag_meta_key , true),
            "tag_id" => get_post_meta($this->id , self::$tag_id_meta_key , true),
            "widget" => get_post_meta($this->id , self::$widget_meta_key , true)
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

    /**
    *   Returns a json encoded string;
    *   @param $data    array   an array of data;
    *   @return string  self::$data a json string which has special characters turned into their hex values;
    */
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

    /**
    *   Sets the stackla tag data into the postmeta table for $this->id;
    *   @param object   $tag    a Stackla Tag object;
    *   @return void;
    */
    public function set_stackla_wp_tag(Stackla\Api\Tag $tag)
    {
        delete_post_meta($this->id , self::$tag_meta_key);
        add_post_meta($this->id , self::$tag_meta_key , $tag->tag);

        delete_post_meta($this->id , self::$tag_id_meta_key);
        add_post_meta($this->id , self::$tag_id_meta_key , $tag->id);
    }

    /**
    *   Sets the stackla widget title into the postmeta table for $this->id;
    *   @param string   $title  the title for the widget;
    *   @return void;
    */
    public function set_stackla_wp_title($title)
    {
        delete_post_meta($this->id , self::$title_meta_key);
        add_post_meta($this->id , self::$title_meta_key , $title);
    }

    /**
    *   Sets the stackla widget terms into the postmeta table as json for $this->id;
    *   @param array    $terms  an array of terms;
    *   @return void;
    */
    public function set_stackla_wp_terms($terms)
    {
        delete_post_meta($this->id , self::$terms_meta_key);
        add_post_meta($this->id , self::$terms_meta_key , $this->set_json($terms));
    }

    /**
    *   Sets the stackla widget filters into the postmeta table as json for $this->id;
    *   @param array    $filters  an array of filters;
    *   @return void;
    */
    public function set_stackla_wp_filters($filters)
    {
        delete_post_meta($this->id , self::$filters_meta_key);
        add_post_meta($this->id , self::$filters_meta_key , $this->set_json($filters));
    }

    /**
    *   Sets the stackla widget config into the postmeta table as json for $this->id;
    *   @param array    $widget an array containing the widget config;
    *   @return void;
    */
    public function set_stackla_wp_widget($widget)
    {
        $data = array(
            'id' => $widget['id'],
            'copyId' => $widget['copyId'],
            'style' => $widget['style'],
            'type' => $widget['type']
        );

        delete_post_meta($this->id , self::$widget_meta_key);
        add_post_meta($this->id , self::$widget_meta_key , $this->set_json($data));

        delete_post_meta($this->id , self::$widget_embed_meta_key);
        add_post_meta($this->id , self::$widget_embed_meta_key , $widget['embed']);
    }

    public function clear()
    {
        delete_post_meta($this->id, self::$tag_meta_key);
        delete_post_meta($this->id, self::$tag_id_meta_key);
        delete_post_meta($this->id, self::$title_meta_key);
        delete_post_meta($this->id, self::$terms_meta_key);
        delete_post_meta($this->id, self::$filters_meta_key);
        delete_post_meta($this->id, self::$widget_meta_key);
        delete_post_meta($this->id, self::$widget_embed_meta_key);
    }
}
