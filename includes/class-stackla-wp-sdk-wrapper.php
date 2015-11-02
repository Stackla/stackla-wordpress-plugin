<?php

/**
 * Wrapper for the Stackla PHP SDK;
 *
 *
 *  @package    Stackla_WP
 *  @subpackage Stackla_WP/includes
 *  @author     Rohan Deshpande <rohan.deshpande@stackla.com>
 */

require_once('class-stackla-wp-metabox.php');

class Stackla_WP_SDK_Wrapper extends Stackla_WP_Metabox
{
    /**
    *   @var    $user_settings      array   array of existing user settings;
    *   @var    $existing_tag_id    string  existing postmeta stackla tag id;
    *   @var    $credentials        object  stackla credentials object;
    *   @var    $token              string  the user's access token;
    *   @var    $stack_name         string  the user's stack name;
    *   @var    $stack              object  the instantiated stack instance;
    *   @var    $tag                object  a stackla tag object;
    *   @var    $auth_host          string  the authorisation route;
    *   @var    $stack_host         string  the stackla api route
    */

    private $user_settings = false;
    private $existing_tag_id = false;
    private $credentials = false;
    private $token = false;
    private $stack_name = false;
    private $stack = false;
    private $widget_default_filter = false;
    private $filter_objects = array();

    public  $tag = false;
    public  $errors = array();

    public $host = "https://api.stackla.com/api/";

    /**
    *   -- CONSTRUCTOR --
    *   Sets the user's settings & token, then tries to perform setup;
    *   @return void;
    */
    public function __construct()
    {
        $settings = new Stackla_WP_Settings;
        $this->user_settings = $settings->get_user_settings();
        $this->token = $settings->get_user_access_token();

        $this->errors['request'] = false;
        $this->errors['title'] = false;
        $this->errors['terms'] = array();
        $this->errors['filters'] = array();
        $this->errors['widget'] = false;

        try
        {
            $this->setup();
        }
        catch(Exception $e)
        {
            $this->errors['request'] = $e->getMessage();
            return false;
        }
    }

    public function get_errors()
    {
        return json_encode(array('errors' => $this->errors , 'result' => '0'));
    }

    /**
    *   Tries to set up the SDK wrapper;
    *   @return void;
    */
    protected function setup()
    {
        if($this->user_settings === false)
        {
            throw new Exception('Credentials cannot be set, user has no settings');
        }

        $this->stack_name = $this->user_settings['stackla_stack'];
        $this->existing_tag_id = parent::$data['tag_id'];

        if(is_null($this->token) || strlen($this->token) <= 0)
        {
            throw new Exception('User is not authorized with Stackla');
        }

        $this->credentials = new Stackla\Core\Credentials(self::$host , $this->token , $this->stack_name);
        $this->stack = new Stackla\Api\Stack($this->credentials, self::$host, $this->stack_name);
    }

    /**
    *   Validates a terms array item;
    *   @param array    $term   a terms array item;
    *   @return boolean false || true   false if the term is invalid true if it is valid;
    */
    public function validate_term($term)
    {
        if(Stackla_WP_Metabox_Validator::validate_string($term['name']) === false) return false;

        if(Stackla_WP_Metabox_Validator::validate_string($term['network']) === false) return false;

        if(Stackla_WP_Metabox_Validator::validate_string($term['term']) === false) return false;

        if(Stackla_WP_Metabox_Validator::validate_string($term['termValue']) === false) return false;

        return true;
    }

    /**
    *   Validates a filters array item;
    *   @param array    $filter a filters array item;
    *   @return boolean false || true   false if invalid, true if valid;
    */
    public function validate_filter($filter)
    {
        if(Stackla_WP_Metabox_Validator::validate_string($filter['name']) === false) return false;

        if(Stackla_WP_Metabox_Validator::validate_string($filter['sorting']) === false) return false;

        return true;
    }

    /**
    *   Flushes the array of any items with the key 'removed' set to true;
    *   @param $array   array   contains a 'removed' key with a boolean value set;
    *   @return $array  array   contains the flushed array;
    */
    public function flush($array)
    {
        if(empty($array)) return array();

        $length = count($array);

        for($i = 0 ; $i < $length ; $i ++)
        {
            if(!isset($array[$i]['removed'])) continue;

            if($array[$i]['removed'] === true || $array[$i]['removed'] === 'true')
            {
                unset($array[$i]);
            }
        }

        return array_values($array);
    }

    /**
    *   Pushes a tag to Stackla;
    *   @param $name    string  the name of the tag;
    *   @return object || boolean   $tag || false   Stackla Tag object if successful, false on fail;
    */
    public function push_tag($name)
    {
        $tag;

        if($this->existing_tag_id !== '')
        {
            $tag = $this->stack->instance('Tag' , $this->existing_tag_id);
        }
        else
        {
            $tag = $this->stack->instance('Tag');
            $tag->type = Stackla\Api\Tag::TYPE_CONTENT;
            $tag->publicly_visible = Stackla\Api\Tag::VISIBLE;
        }

        $deslashed = stripslashes($name);

        $tag->tag = $deslashed;
        $tag->slug = $deslashed;

        try
        {
            if(Stackla_WP_Metabox_Validator::validate_string($this->existing_tag_id))
            {
                $tag->update();
            }
            else
            {
                $tag->create();
            }

            $this->tag = $tag;

            return $tag;
        }
        catch(Exception $e)
        {
            $this->errors['title'] = implode(', ' , $tag->getErrors());
            return false;
        }

    }

    /**
    *   Pushes terms to stackla;
    *   @see Stackla_WP_Metabox_Validator - removed terms are NOT validated at the metabox level
    *   @param $terms   array   an array of terms;
    *   @return $terms  array   the modified terms array for WP database insertion;
    */

    public function push_terms($terms , $tag)
    {
        if($this->tag === false)
        {
            throw new Error('Tag object not set');
        }

        $i = -1;

        foreach($terms as $t)
        {
            $i++;
            $term;
            $error = false;

            if($t['edited'] === false || $t['edited'] === 'false') continue;

            if($this->validate_term($t) === false) continue;

            if(Stackla_WP_Metabox_Validator::validate_string($t['termId']) === true)
            {
                $term = $this->stack->instance('Term' , $t['termId']);

                if($t['removed'] === 'true' || $t['removed'] === true)
                {
                    $term->delete();
                    continue;
                }
            }
            else
            {
                $term = $this->stack->instance('Term');
            }

            $deslashed = stripslashes($t['name']);

            $term->name = $deslashed;
            $term->display_name = $deslashed;
            $term->network = $t['network'];
            $term->type = $t['term'];
            $term->term = $t['termValue'];

            try
            {
                if(Stackla_WP_Metabox_Validator::validate_string($t['termId']))
                {
                    $term->update();
                }
                else
                {
                    $term->create();
                    $term->addTag($tag);
                    $terms[$i]['termId'] = $term->id;
                }
            }
            catch(Exception $e)
            {
                $error = array('sdk' => implode(', ' , $term->getErrors()));
            }

            $this->errors['terms'][$t['id']] = $error;
        }

        return $this->flush($terms);
    }

    public function push_filters($filters , $tag)
    {
        if($this->tag === false)
        {
            throw new Error('Tag object not set');
        }

        $i = -1;

        foreach($filters as $f)
        {
            $i++;
            $filter;
            $error = false;

            if($f['edited'] === false || $f['edited'] === 'false') continue;

            if($this->validate_filter($f) === false) continue;

            if(Stackla_WP_Metabox_Validator::validate_string($f['filterId']) === true)
            {
                $filter = $this->stack->instance('Filter' , $f['filterId']);

                if($f['removed'] === 'true' || $f['removed'] === true)
                {
                    $filter->delete();
                    continue;
                }
            }
            else
            {
                $filter = $this->stack->instance('Filter');
                $filter->addTag($tag);
            }

            $filter->name = stripslashes($f['name']);
            $filter->networks  = $f['network'];
            $filter->media = $f['media'];

            try
            {
                if(Stackla_WP_Metabox_Validator::validate_string($f['filterId']))
                {
                    $filter->update();
                }
                else
                {
                    $filter->create();
                    $filters[$i]['filterId'] = $filter->id;
                }

                $this->filter_objects[] = $filter;
            }
            catch(Exception $e)
            {
                $error = array('sdk' => implode(', ' , $filter->getErrors()));
            }

            $this->errors['filters'][$f['id']] = $error;
        }

        return $this->flush($filters);
    }

    /**
    *   Handles creating, updating, cloning and deriving of a new widget instance;
    *   @param  array   $options    an array of options to configure the widget;
    *   @return array   $options    the options with the potential widget id set;
    */
    public function push_widget($name , $filter , $options)
    {
        $widget;
        $filter_id = $filter['filterId'];

        if(Stackla_WP_Metabox_Validator::validate_string($options['copyId']) === true)
        {
            $parent = $this->stack->instance('Widget' , (int) $options['copyId'] , false);

            if(Stackla_WP_Metabox_Validator::validate_string($options['id']) === true)
            {
                $old_widget = $this->stack->instance('Widget' , (int) $options['id'] , false);
                $old_widget->delete();
            }

            if($options['type'] == 'clone')
            {
                $widget = $parent->duplicate();
                $widget->type_style = $options['style'];
                $options['id'] = $widget->id;
            }
            elseif($options['type'] == 'derive')
            {
                $widget = $parent->derive($filter_id , $name);
                $options['id'] = $widget->id;
                $options['embed'] = $widget->embed_code;
                return $options;
            }
        }
        elseif(Stackla_WP_Metabox_Validator::validate_string($options['id']) === false)
        {
            $widget = $this->stack->instance('Widget');
        }
        else
        {
            $widget = $this->stack->instance('Widget' , $options['id']);
        }

        $widget->name = stripslashes($name);
        $widget->type = \Stackla\Api\Widget::TYPE_FLUID;
        $widget->type_style = (isset($options['style'])) ? $options['style'] : \Stackla\Api\Widget::STYLE_VERTICAL_FLUID;
        $widget->filter_id = $filter_id;

        try
        {
            if(
                Stackla_WP_Metabox_Validator::validate_string($options['id']) === false
                && Stackla_WP_Metabox_Validator::validate_string($options['copyId']) === false
            )
            {
                $widget->create();
                $options['id'] = $widget->id;
            }
            else
            {
                $widget->update();
            }

            $options['embed'] = $widget->embed_code;
        }
        catch(Exception $e)
        {
            $this->errors['widget'] = implode(', ' , $widget->getErrors());
            return false;
        }

        return $options;
    }

    /**
    *   Gets the existing widgets from the user's stack;
    *   @return array   $widgets    an array of widget objects;
    */
    public function get_widgets()
    {
        $widgets = $this->stack->instance('Widget');
        $widgets->get(25, 1, array('derived' => 'false'));
        $parsed = array();

        foreach($widgets as $widget)
        {
            $parsed[$widget->id] = $widget->name;
        }

        return $parsed;
    }

    /**
    *   Validates the SDK wrapper requests;
    *   @return boolean false if invalid, true if valid;
    */
    public function validate()
    {
        if($this->errors['request'] !== false)
        {
            return false;
        }

        if($this->errors['title'] !== false)
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

    /**
    *   Removes a Stackla Tag;
    *   @param int  $id the stackla tag id;
    *   @return void;
    */
    public function remove_tag($id)
    {
        $tag = $this->stack->instance('Tag', $id , false);

        try
        {
            $tag->delete();
        }
        catch(Exception $e)
        {

        }
    }

    /**
    *   Removes a Stackla Term;
    *   @param int  $id the stackla term id;
    *   @return void;
    */
    public function remove_term($id)
    {
        $term = $this->stack->instance('Term', $id, false);

        try
        {
            $term->delete();
        }
        catch(Exception $e)
        {

        }
    }

    /**
    *   Removes a Stackla Filter;
    *   @param int  $id the stackla filter id;
    *   @return void;
    */
    public function remove_filter($id)
    {
        $filter = $this->stack->instance('Filter', $id, false);

        try
        {
            $filter->delete();
        }
        catch(Exception $e)
        {

        }
    }

    /**
    *   Removes a Stackla Widget;
    *   @param int  $id the stackla widget id;
    *   @return void;
    */
    public function remove_widget($id)
    {
        $widget = $this->stack->instance('Widget', $id, false);

        try
        {
            $widget->delete();
        }
        catch(Exception $e)
        {

        }
    }
}
