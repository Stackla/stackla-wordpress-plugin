<?php

require_once('class-stackla-wp-metabox.php');
require_once('class-stackla-wp-sdk-wrapper.php');

class Stackla_WP_Remover
{
    /**
    *   Removes widget meta data from the wp postmeta table
    *   Also removes the corresponding tag, terms, filters and widget from Stackla;
    *   @param int  $post_id    the post being deleted;
    *   @return void;
    */
    public function remove_metabox_widget($post_id)
    {
        $metabox = new Stackla_WP_Metabox($post_id);
        $sdk = new Stackla_WP_SDK_Wrapper;
        $data = $metabox->get_data();

        foreach($data as $k => $v)
        {
            switch($k)
            {
                case 'terms':

                    if($v === '' || !$v) continue;

                    $terms = json_decode($v);

                    foreach($terms as $term)
                    {
                        $sdk->remove_term($term->termId);
                    }

                break;
                case 'filters':

                    if($v === '' || !$v) continue;

                    $filters = json_decode($v);

                    foreach($filters as $filter)
                    {
                        $sdk->remove_filter($filter->filterId);
                    }

                break;
                case 'tag_id':

                    if($v === '' || !$v) continue;

                    $sdk->remove_tag($v);

                break;
                case 'widget':

                    if($v === '' || !$v) continue;

                    $widget = json_decode($v);

                    $sdk->remove_widget($widget->id);

                break;
            }
        }

        if (wp_is_post_revision($post_id)) {
            /*
             * Ignore revision post created by WordPress autosave.
             * $metabox->clear() calls delete_post_meta() which deletes the post
             * meta data of the original post if the it detects the current post
             * to be deleted is a revision.
             * Revision post is created when [Preview Post] is clicked, which
             * does not have any post meta data.
             */
            return;
        }

        $metabox->clear();
    }
}
