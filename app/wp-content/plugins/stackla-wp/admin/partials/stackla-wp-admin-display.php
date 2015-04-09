<?php

/**
 * Provide a admin area view for the plugin
 *
 * This file is used to markup the admin-facing aspects of the plugin.
 *
 * @link       http://example.com
 * @since      1.0.0
 *
 * @package    Stackla_WP
 * @subpackage Stackla_WP/admin/partials
 */
    $settings = new Stackla_WP_Settings;
    $post_types = $settings->get_post_type_options();
    $user_settings = $settings->get_user_settings();
    $set_post_types = false;
    $set_api_key = false;
    $checked = '';

    if($user_settings->stackla_post_types !== '')
    {
        $set_post_types = explode("," , $user_settings->stackla_post_types);
    }

    if($user_settings->stackla_api_key !== '')
    {
        $set_api_key = $user_settings->stackla_api_key;
    }
?>

<div id='wpbody'>
    <div id='wpbody-content' aria-label='Main content' tabindex='0'>
        <div class='wrap'>
            <h2>Stackla For WordPress</h2>
            <form id='stackla-settings-form' method='POST' action="<?php echo plugin_dir_url(__FILE__) ?>stackla-wp-admin-handler.php">
                <fieldset>
                    <label>
                        Your API Key
                    </label>
                    <input type='text' name='apiKey' value="<?php echo $set_api_key ?>">
                </fieldset>
                <p>
                    Display Stackla Custom Fields on
                </p>
                <?php foreach($post_types as $type): ?>
                    <fieldset>
                        <?php  
                            ($set_post_types && in_array($type , $set_post_types)) ? $checked = 'checked' : $checked = '';
                        ?>
                        <input type='checkbox' name='types[]' <?php echo $checked ?> value="<?php echo $type ?>">
                        <label><?php echo $type ?>s</label>
                    </fieldset>
                <?php endforeach; ?>
                <input type='submit' value='Save Settings' class='button'>
            </form>
            <div id='feedback'></div>
        </div>
    </div>
    <div class='clear'></div>
</div>
