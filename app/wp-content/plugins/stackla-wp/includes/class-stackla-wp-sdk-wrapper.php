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

    public  $tag = false;
    public  $auth_host = "https://api.qa.stackla.com/api/";
    public  $stack_host = "https://my.qa.stackla.com/api/";
    public  $errors = array();

    public function __construct()
    {
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
        $this->stack_name = $this->user_settings['stackla_stack'];
        $this->existing_tag_id = parent::$data['tag_id'];

        if(is_null($this->token) || strlen($this->token) <= 0)
        {
            throw new Exception('User is not authorized with Stackla');
        }

        $this->credentials = new Stackla\Core\Credentials($this->auth_host , $this->token , $this->stack_name);
        $this->stack = new Stackla\Api\Stack($this->credentials, $this->stack_host, $this->stack_name);
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

        $deslashed = stripslashes($name);
        
        $tag->tag = $deslashed;
        $tag->slug = $deslashed;
        
        if(Stackla_WP_Metabox_Validator::validate_string($this->existing_tag_id))
        {
            $tag->update();
        }
        else
        {
             $tag->create();
        }

        $this->tag = $tag;

        parent::set_stackla_wp_tag($tag);
        return $tag;
    }

    public function push_terms($terms)
    {
        if($this->tag === false)
        {
            throw new Error('Tag object not set');
        }

        $i = -1;

        foreach($terms as $t)
        {
            $i++;

            if($t['edited'] === false) continue;

            $term;

            if(Stackla_WP_Metabox_Validator::validate_string($t['termId']))
            {
                $term = $this->stack->instance('Term' , $t['termId']);
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

            if(Stackla_WP_Metabox_Validator::validate_string($t['termId']))
            {
                $term->update();
            }
            else
            {
                $term->create();
                print_r($t);
                $term->addTag($this->tag);
                $terms[$i]['termId'] = $term->id;
            }
        }

        return $terms;
    }

    public function push_filters($filters)
    {
        if($this->tag === false)
        {
            throw new Error('Tag object not set');
        }

        $i = -1;

        foreach($filters as $f)
        {
            $i++;

            if($f['edited'] === false) continue;

            $filter;

            if(Stackla_WP_Metabox_Validator::validate_string($f['filterId']) === true)
            {
                $filter = $this->stack->instance('Filter' , $f['filterId']);
            }
            else
            {

                $filter = $this->stack->instance('Filter');
                $filter->addTag($this->tag);
            }

            $filter->name = stripslashes($f['name']);

            foreach($f['network'] as $network)
            {
                $filter->addNetwork($network);
            }

            foreach($f['media'] as $media)
            {
                $filter->addMedia($media);
            }

            if(Stackla_WP_Metabox_Validator::validate_string($f['filterId']))
            {
                $filter->update();
            }
            else
            {
                $filter->create();
                $filters[$i]['filterId'] = $filter->id;
            }
        }

        return $filters;
    }

    public function remove_term($id)
    {
        $term = $this->stack->instance('Term' , $id);
        $result;

        try
        {
            $term->delete();
            $result = true;
        }
        catch(Exception $e)
        {
            $result = false;
        }

        return $result;
    }

}
