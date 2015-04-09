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
    $post_types = Stackla_WP_Settings::get_post_type_options();
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
                    <input type='text' name='apiKey'>
                </fieldset>
                <p>
                    Display Stackla Custom Fields on
                </p>
                <?php foreach($post_types as $type): ?>
                    <fieldset>
                        <input type='checkbox' name='types[]' value="<?php echo $type ?>">
                        <label><?php echo $type ?>s</label>
                    </fieldset>
                <?php endforeach; ?>
                <input type='submit' value='Save Settings' class='button'>
            </form>
        </div>
    </div>
    <div class='clear'></div>
</div>
