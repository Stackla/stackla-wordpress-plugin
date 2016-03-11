<?php

/**
 * Wrapper for the Stackla PHP SDK;
 *
 *
 * @package    Stackla_WP
 * @subpackage Stackla_WP/includes
 * @author     Stackla <tech@stackla.com>
 */

use Stackla\Api\Filter;
use Stackla\Api\Stack;
use Stackla\Api\Tag;
use Stackla\Exception\ApiException;
use Symfony\Component\Yaml\Yaml;

require_once('class-stackla-wp-metabox.php');

class Stackla_WP_SDK_Wrapper extends Stackla_WP_Metabox
{
    const TERM_NOT_FOUND_ERROR = 1080404;
    const TAG_EXISTS_ERROR = 1070409;

    /**
     * @var    $user_settings      array   array of existing user settings;
     * @var    $existing_tag_id    string  existing postmeta stackla tag id;
     * @var    $existing_filter_id string  existing postmeta stackla filter id;
     * @var    $credentials        object  stackla credentials object;
     * @var    $token              string  the user's access token;
     * @var    $stack_name         string  the user's stack name;
     * @var    $stack              Stack   the instantiated stack instance;
     * @var    $tag                object  a stackla tag object;
     * @var    $auth_host          string  the authorisation route;
     * @var    $stack_host         string  the stackla api route
     */

    private $user_settings = false;
    private $existing_tag_id = false;
    private $existing_filter_id = false;
    private $credentials = false;
    private $token = false;
    private $stack_name = false;
    /** @var Stack the instantiated stack instance */
    private $stack = false;
    private $filter_objects = array();

    public $tag = false;
    public $errors = array();

    public static $media = array('text', 'image', 'video');
    public static $host = "https://api.stackla.com/api/";

    /**
     *   -- CONSTRUCTOR --
     *   Sets the user's settings & token, then tries to perform setup;
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

        $configFile = dirname(__DIR__) . '/config.yml';
        if (is_readable($configFile)) {
            $config = Yaml::parse(file_get_contents($configFile));
            if (isset($config['stackla']) && isset($config['stackla']['host'])) {
                self::$host = $config['stackla']['host'];
            }
        }

        try {
            $this->setup();
        } catch (Exception $e) {
            $this->errors['request'] = $e->getMessage();
            throw $e;
        }
    }

    public static function getHost()
    {
        $configFile = dirname(__DIR__) . '/config.yml';
        if (is_readable($configFile)) {
            $config = Yaml::parse(file_get_contents($configFile));
            if (isset($config['stackla']) && isset($config['stackla']['host'])) {
                self::$host = $config['stackla']['host'];
            }
        }

        return self::$host;
    }

    public static function getCallbackUrl()
    {
        return get_site_url();
    }

    public function get_errors()
    {
        return json_encode(array('errors' => $this->errors, 'result' => '0'));
    }

    /**
     * Tries to set up the SDK wrapper;
     */
    protected function setup()
    {
        if ($this->user_settings === false) {
            throw new Exception('Credentials cannot be set, user has no settings');
        }

        $this->stack_name = $this->user_settings['stackla_stack'];
        $this->existing_tag_id = parent::$data['tag_id'];
        $this->existing_filter_id = parent::$data['filter_id'];

        if (is_null($this->token) || strlen($this->token) <= 0) {
            throw new Exception('User is not authorized with Stackla');
        }

        $this->credentials = new Stackla\Core\Credentials(self::$host, $this->token, $this->stack_name);
        $this->stack = new Stackla\Api\Stack($this->credentials, self::$host, $this->stack_name);
    }

    public function isTokenValid()
    {
        try {
            $filter = $this->stack->instance('filter');
            $filter->get(1);
            return (bool)$filter;
        } catch (Exception $e) {
            return false;
        }
    }

    /**
     *   Validates a terms array item;
     * @param array $term a terms array item;
     * @return bool false if the term is invalid true if it is valid;
     */
    public function validate_term($term)
    {
        if (Stackla_WP_Metabox_Validator::validate_string($term['network']) === false) {
            return false;
        }

        if (Stackla_WP_Metabox_Validator::validate_string($term['term']) === false) {
            return false;
        }

        if (Stackla_WP_Metabox_Validator::validate_string($term['termValue']) === false) {
            return false;
        }

        return true;
    }

    /**
     *   Validates a filters array item;
     * @param array $filter a filters array item;
     * @return bool false if invalid, true if valid;
     */
    public function validate_filter($filter)
    {
        if (Stackla_WP_Metabox_Validator::validate_string($filter['name']) === false) {
            return false;
        }

        if (Stackla_WP_Metabox_Validator::validate_string($filter['sorting']) === false) {
            return false;
        }

        return true;
    }

    /**
     *   Flushes the array of any items with the key 'removed' set to true;
     * @param $array   array   contains a 'removed' key with a boolean value set;
     * @return array   contains the flushed array;
     */
    public function flush($array)
    {
        if (empty($array)) {
            return array();
        }

        $length = count($array);

        for ($i = 0; $i < $length; $i++) {
            if (!isset($array[$i]['removed'])) {
                continue;
            }

            if ($array[$i]['removed'] === true || $array[$i]['removed'] === 'true') {
                unset($array[$i]);
            }
        }

        return array_values($array);
    }

    /**
     * Pushes a tag to Stackla;
     * @param $name string  the name of the tag;
     * @return bool|Tag Stackla Tag object if successful, false on fail;
     */
    public function push_tag($name)
    {
        $tag = null;

        if ($this->existing_tag_id) {
            $tag = $this->stack->instance('Tag', $this->existing_tag_id);
        } else {
            $tag = $this->stack->instance('Tag');
            $tag->type = Tag::TYPE_CONTENT;
            $tag->publicly_visible = 0;
        }

        $name = stripslashes($name);

        if ($tag->tag === $name) {
            return $tag;
        }

        $tag->tag = $name;
        $tag->slug = $name;

        try {
            if (Stackla_WP_Metabox_Validator::validate_string($this->existing_tag_id)) {
                $tag->update();
            } else {
                $tag->create();
            }

            $this->tag = $tag;

            return $tag;
        } catch (ApiException $e) {
            if ($e->containsErrorByErrorCode(self::TAG_EXISTS_ERROR)) {
                /*
                 * It failed because it tries to create a tag with same name.
                 * Usually this happens when a stack is used in 2 or more
                 * WordPress blog and both posts have the same post ID.
                 * It is easy for the user to recover by creating a new post
                 * with a different ID (or delete the existing tag but deleting
                 * the tag might affect other applications that rely on the tag)
                 */
                $this->errors['title'] = 'Term cannot be created due to name conflict. Please create a new post and try again.';
            } else {
                $this->errors['title'] = $e->getMessage();
            }
            return false;
        } catch (Exception $e) {
            $this->errors['title'] = $e->getMessage();
            return false;
        }
    }

    /**
     * Pushes a default filter to Stackla if not exist;
     * @param $tag
     * @param $name    string  the name of the tag
     * @param $media
     * @return bool|Filter Stackla Filter object if successful, false on fail
     */
    public function prepareDefaultFilter($tag, $name, $media)
    {
        $filter = null;

        if ($this->existing_filter_id !== '') {
            $filter = $this->stack->instance('filter', $this->existing_filter_id);
        } else {
            $filter = $this->stack->instance('filter');
            $filter->addTag($tag);
        }

        $defaultName = $name . " - Latest";
        if ($filter->name === $defaultName) {
            return $filter;
        }

        $filter->name = $defaultName;

        $diff = array();
        if (gettype($media) == 'array') {
            $diff = array_intersect($media, self::$media);
        }
        $filter->media = $diff;

        try {
            if (Stackla_WP_Metabox_Validator::validate_string($this->existing_filter_id)) {
                $filter->update();
            } else {
                $filter->create();
            }

            return $filter;
        } catch (Exception $e) {
            $this->errors['default-filter'] = $e->getMessage();
            return false;
        }
    }

    /**
     *   Pushes terms to stackla;
     * @see    Stackla_WP_Metabox_Validator - removed terms are NOT validated at the metabox level
     * @param      $terms   array   an array of terms;
     * @param      $tag
     * @param null $prefix
     * @return array   the modified terms array for WP database insertion;
     * @throws Error
     * @throws Exception
     */
    public function push_terms($terms, $tag, $prefix = null)
    {
        if ($this->tag === false) {
            throw new Error('Tag object not set');
        }

        $i = -1;

        foreach ($terms as $t) {
            $i++;
            /** @var Stackla\Api\Term $term */
            $term = null;
            $error = false;
            $isNew = false;

            if (self::isFalse($t['edited'])) {
                try {
                    // test if the term still exists, if not, an exception will
                    // be thrown
                    $this->stack->instance('Term', $t['termId']);
                    continue;
                } catch (Exception $e) {
                    // if term not exists, recreate it
                    $term = $this->stack->instance('Term');
                    $isNew = true;
                }
            } else {
                if ($this->validate_term($t) === false) {
                    $this->errors['terms'][$t['id']] = 'Invalid Term data';
                };

                if (Stackla_WP_Metabox_Validator::validate_string($t['termId']) === true) {
                    try {
                        $term = $this->stack->instance('Term', $t['termId']);
                        if (self::isTrue($t['removed'])) {
                            $term->delete();
                            continue;
                        }
                    } catch (ApiException $e) {
                        if ($e->containsErrorByErrorCode(self::TERM_NOT_FOUND_ERROR)) {
                            if (self::isTrue($t['removed'])) {
                                // the user actually wanted to delete it, and someone
                                // else has already deleted it
                                continue;
                            } else {
                                // if the term is not found, then it is probably
                                // deleted because a wordpress user has no way to
                                // recover from such errors, and the user do
                                // actually want to have this term (otherwise the
                                // user would have delete it), we should capture it
                                // and create a new term instead.
                                $term = $this->stack->instance('Term');
                                $isNew = true;
                            }
                        } else {
                            // some other not defined exception, rethrow
                            throw $e;
                        }
                    }
                } else {
                    $term = $this->stack->instance('Term');
                    $isNew = true;
                }
            }

            $name = sprintf("%s - %s - %s", $t['network'], $t['term'], $t['termValue']);
            if ($prefix) {
                $name = $prefix . $name;
            }

            $term->name = $name;
            $term->display_name = $name;
            $term->network = $t['network'];
            $term->type = $t['term'];
            $term->term = $t['termValue'];

            try {
                if (!$isNew) {
                    $term->update();
                } else {
                    $term->addTag($tag);
                    $term->create();
                    $terms[$i]['termId'] = $term->id;
                }
            } catch (Exception $e) {
                $error = array('sdk' => $e->getMessage());
            }

            $this->errors['terms'][$t['id']] = $error;
        }

        return $this->flush($terms);
    }

    public function push_filters($filters, $tag, $prefix = null)
    {
        if ($this->tag === false) {
            throw new Error('Tag object not set');
        }

        $i = -1;

        foreach ($filters as $f) {
            $i++;
            $filter = null;
            $error = false;

            if ($f['edited'] === false || $f['edited'] === 'false') {
                continue;
            }

            if ($this->validate_filter($f) === false) {
                continue;
            }

            if (Stackla_WP_Metabox_Validator::validate_string($f['filterId']) === true) {
                $filter = $this->stack->instance('Filter', $f['filterId']);

                if ($f['removed'] === 'true' || $f['removed'] === true) {
                    $filter->delete();
                    continue;
                }
            } else {
                $filter = $this->stack->instance('Filter');
                $filter->addTag($tag);
            }

            $filter->name = $prefix . stripslashes($f['name']);
            $filter->networks = $f['network'];
            $filter->media = $f['media'];

            try {
                if (Stackla_WP_Metabox_Validator::validate_string($f['filterId'])) {
                    $filter->update();
                } else {
                    $filter->create();
                    $filters[$i]['filterId'] = $filter->id;
                }

                $this->filter_objects[] = $filter;
            } catch (Exception $e) {
                $error = array('sdk' => $e->getMessage());
            }

            $this->errors['filters'][$f['id']] = $error;
        }

        return $this->flush($filters);
    }

    /**
     *   Handles creating, updating, cloning and deriving of a new widget instance;
     * @param  string $name      Widget name;
     * @param  Filter $filter    an array of filter;
     * @param  array  $options   an array of options to configure the widget;
     * @param  array  $oldWidget an array of old widget;
     * @return array   $options    the options with the potential widget id set;
     */
    public function push_widget($name, $filter, $options, $oldWidget)
    {
        $widget = null;
        $filter_id = $filter->id;

        $diff = true;
        if (gettype($oldWidget) == 'array') {
            $diff = array_diff($options, $oldWidget);
        }

        if ($diff) {
            if (Stackla_WP_Metabox_Validator::validate_string($options['id']) === true) {
                try {
                    $old_widget = $this->stack->instance('Widget', (int)$options['id'], false);
                    $old_widget->delete();
                } catch (Exception $e) {

                }
                $options['id'] = null;
            }
        }

        if ($diff && Stackla_WP_Metabox_Validator::validate_string($options['copyId']) === true) {
            $parent = $this->stack->instance('Widget', (int)$options['copyId'], false);

            try {
                if ($options['type'] == 'clone') {
                    $widget = $parent->duplicate();
                    $options['id'] = $widget->id;
                } elseif ($options['type'] == 'derive') {
                    $widget = $parent->derive($filter_id, $name);
                    $options['id'] = $widget->id;
                    $options['embed'] = $widget->embed_code;
                    return $options;
                }
            } catch (Exception $e) {
                $error = 'Unable to clone the widget, please make sure the widget is a valid widget';
                $this->errors['widget'] = $error;
                return false;
            }
        } elseif (Stackla_WP_Metabox_Validator::validate_string($options['id']) === false) {
            $widget = $this->stack->instance('Widget');
        } else {
            $widget = $this->stack->instance('Widget', $options['id']);
        }

        $widget->name = stripslashes($name);
        $widget->type_style = (isset($options['style'])) ? $options['style'] : \Stackla\Api\Widget::STYLE_BASE_WATERFALL;
        $widget->filter_id = $filter_id;

        try {
            if (
            !$widget->id
                // Stackla_WP_Metabox_Validator::validate_string($options['id']) === false
                // && Stackla_WP_Metabox_Validator::validate_string($options['copyId']) === false
            ) {
                $widget->create();
                $options['id'] = $widget->id;
            } else {
                $widget->update();
            }

            $options['embed'] = $widget->embed_code;
        } catch (Exception $e) {
            // $this->errors['widget'] = "Sorry, something happened while saving the widget config";
            $this->errors['widget'] = $e->getMessage();
            return false;
        }

        return $options;
    }

    /**
     *   Gets the existing widgets from the user's stack;
     * @return array   $widgets    an array of widget objects;
     */
    public function get_widgets()
    {
        $widgets = $this->stack->instance('Widget');
        $widgets->get(25, 1, array('derived' => 'false'));
        $parsed = array();

        foreach ($widgets as $widget) {
            $parsed["-" . $widget->id] = $widget->name;
        }

        natcasesort($parsed);

        return $parsed;
    }

    /**
     *   Validates the SDK wrapper requests;
     * @return boolean false if invalid, true if valid;
     */
    public function validate()
    {
        if ($this->errors['request'] !== false) {
            return false;
        }

        if ($this->errors['title'] !== false) {
            return false;
        }

        foreach ($this->errors['terms'] as $k => $v) {
            if ($v !== false) {
                return false;
            }
        }

        foreach ($this->errors['filters'] as $k => $v) {
            if ($v !== false) {
                return false;
            }
        }

        return true;
    }

    /**
     *   Removes a Stackla Tag;
     * @param int $id the stackla tag id;
     * @return void;
     */
    public function remove_tag($id)
    {
        $tag = $this->stack->instance('Tag', $id, false);

        try {
            $tag->delete();
        } catch (Exception $e) {

        }
    }

    /**
     *   Removes a Stackla Term;
     * @param int $id the stackla term id;
     * @return void;
     */
    public function remove_term($id)
    {
        $term = $this->stack->instance('Term', $id, false);

        try {
            $term->delete();
        } catch (Exception $e) {

        }
    }

    /**
     *   Removes a Stackla Filter;
     * @param int $id the stackla filter id;
     * @return void;
     */
    public function remove_filter($id)
    {
        $filter = $this->stack->instance('Filter', $id, false);

        try {
            $filter->delete();
        } catch (Exception $e) {

        }
    }

    /**
     *   Removes a Stackla Widget;
     * @param int $id the stackla widget id;
     * @return void;
     */
    public function remove_widget($id)
    {
        $widget = $this->stack->instance('Widget', $id, false);

        try {
            $widget->delete();
        } catch (Exception $e) {

        }
    }

    public static function isTrue($bool)
    {
        return $bool === true || $bool === 'true';
    }

    public static function isFalse($bool)
    {
        return $bool === false || $bool === 'false';
    }
}
