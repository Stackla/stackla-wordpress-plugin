<?php

/**
 * Wrapper for the Stackla PHP SDK;
 *
 *
 *  @package    Stackla_WP
 *  @subpackage Stackla_WP/includes
 *  @author     Rohan Deshpande <rohan.deshpande@stackla.com>
 */

class Stackla_WP_SDK_Wrapper 
{
    private $user_settings = false;
    private $post_id = false;
    private $existing_tag_id = false;
    private $credentials = false;
    private $token = false;
    private $stack = false;
    private $stack_instance = false;
    public  $auth_host = "https://api.qa.stackla.com/api/";
    public  $stack_host = "https://my.qa.stackla.com/api/";
    public  $errors = array();

    public function __construct($post_id)
    {
        $this->post_id = $post_id;
        $settings = new Stackla_WP_Settings;
        $this->user_settings = $settings->get_user_settings();

        try
        {
            $this->setup();
        }
        catch(Exception $e)
        {
            $this->errors[] = $e->getMessage();
            return false;
        }
    }

    protected function setup()
    {
        if($this->user_settings === false)
        {
            throw new Exception('Credentials cannot be set, user has no settings');
        }

        $this->token = $this->user_settings['stackla_token'];
        $this->stack = $this->user_settings['stackla_stack'];
        $this->existing_tag_id = get_post_meta($this->post_id , 'stackla_wp_tag_id' , true);

        if(is_null($token) || strlen($token) <= 0)
        {
            throw new Exception('User is not authorized with Stackla');
        }

        $this->credentials = new Stackla\Core\Credentials($this->auth_host , $this->token , $this->stack);
        $this->stack_instance = new Stackla\Api\Stack($this->credentials, $this->token, $this->stack);
    }

    protected function set_existing_id($result)
    {
        return ($result === '' || $result || is_null($result)) ? false : $result;
    }

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
        
        $tag->tag = $name;
        $tag->slug = $name;
        
        if($this->existing_tag_id)
        {
            $tag->update();
        }
        else
        {
             $tag->create();
        }

        return $tag;
    }

    public function push_terms($terms , Stackla\Api\Tag $tag)
    {
        foreach($terms as $t)
        {
            $term;

            if(isset($t['id']))
            {
                $term = $this->stack->instance('Term' , $t['id']);
            }
            else
            {
                $term = $this->stack->instance('Term');
            }

            $term->name = $t['name'];
            $term->display_name = $t['name'];
            $term->network = $t['network'];
            $term->type = $t['term'];
            $term->term = $t['termValue'];

            if($isset($t['id']))
            {
                $term->update();
            }
            else
            {
                $term->create();
                $term->addTag($tag);
                $t['id'] = $term->id;
            }
        }

        return $terms;
    }

    public function push_filters($filters , Stackla\Api\Tag $tag)
    {
        foreach($filters as $f)
        {
            $filter;

            if(isset($f['id']))
            {
                $filter = $this->stack->instance('Filter' , $f['id']);
            }
            else
            {
                $filter = $this->stack->instance('Filter');
                $filter->addTag($tag);
            }

            $filter->name = $f['name'];

            foreach($f['network'] as $network)
            {
                $filter->addNetwork($network);
            }

            foreach($f['media'] as $media)
            {
                $filter->addMedia($media);
            }

            if(isset($f['id']))
            {
                $filter->update();
            }
            else
            {
                $filter->create();
                $f['id'] = $filter->id;
            }
        }

        return $filters;
    }

}
