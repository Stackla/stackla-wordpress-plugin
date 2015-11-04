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
?>
<div id='wpbody'>
    <div id='wpbody-content' aria-label='Main content' tabindex='0'>
        <div class='wrap'>
            <h2>Stackla For WordPress</h2>
            <?php
                if($state == 'init'):
            ?>
                <div class='auth-notification prompt'>
                    <h3>Autorisation Required</h3>
                    <li>
                        This plugin instance has not been authorised with Stackla. Enter your app details below to authorise this plugin.
                    </li>
                    <!--
                    <li>
                        Your WordPress Account is not authorised with Stackla.
                    </li>
                    -->
                </div>
            <?php
                elseif($state == 'authenticated'):
            ?>
                <div class='auth-notification prompt'>
                    <h3>Authorisation Required</h3>
                    <li>
                        Your WordPress Account is not authorised with Stackla. <a href="<?php echo ($access_uri) ? $access_uri : ''; ?>">Authorise</a>
                    </li>
                </div>
            <?php
                else:
            ?>
                <div class='auth-notification success'>
                    <h3>
                        Authorisation Successful
                    </h3>
                    <ul>
                        <li>Plugin instance authorised with Stackla</li>
                        <li>WordPress account authorised with Stackla</li>
                    </ul>
                </div>
            <?php
                endif;
            ?>
            <form
                id='stackla-settings-form'
                class='settings-form'
                method='POST'
                action="<?php echo plugin_dir_url(__FILE__) ?>stackla-wp-admin-handler-settings.php"
                data-accessuri=""
                data-state="<?php echo $state?>"
            >
                <fieldset>
                    <label>
                        Your stack
                    </label>
                    <input type='text' class='widefat' name='stack' id='stack' value="<?php echo ($settings['current']) ? $settings['current']['stackla_stack'] : ''; ?>">
                    <div class='error-message'></div>
                </fieldset>
                <fieldset>
                    <label>
                        Your client ID
                    </label>
                    <input type='text' class='widefat' name='client_id' id='client_id' value="<?php echo ($settings['current']) ? $settings['current']['stackla_client_id'] : ''; ?>">
                    <div class='error-message'></div>
                </fieldset>
                <fieldset>
                    <label>
                        Your client secret
                    </label>
                    <input type='text' class='widefat' name='client_secret' id='client_secret' value="<?php echo ($settings['current']) ? $settings['current']['stackla_client_secret'] : ''; ?>">
                    <div class='error-message'></div>
                </fieldset>
                <fieldset>
                    <label>
                        Your callback URI
                    </label>
                    <input type='text' class='widefat' name='callback' id='callback' readonly="readonly" value="<?php echo $callback_url; ?>">
                    <div class='error-message'></div>
                </fieldset>
                <p>
                    Display Stackla Custom Fields on
                </p>
                <?php
                    foreach($settings['post_type_options'] as $option):
                ?>
                    <fieldset>
                        <?php
                            ($settings['post_types'] && in_array($option , $settings['post_types'])) ? $checked = 'checked' : $checked = '';
                        ?>
                        <input type='checkbox' name='types[]' <?php echo $checked ?> value="<?php echo $option ?>">
                        <label>
                            <?php echo $option ?>s
                        </label>
                    </fieldset>
                <?php
                    endforeach;
                ?>
                <input type='submit' value='Save' class='button'>
                <?php if ($state == 'authorized') : ?>
                <input type='button'
                    id="js-revoke-token"
                    value='Revoke token'
                    class='button'
                    data-url="<?php echo $callback_url ?>">
                <input type='button'
                    id="js-regenerate-token"
                    value='Regenerate token'
                    class='button'
                    data-url="<?php echo $access_uri ?>">
                <?php endif; ?>
            </form>
            <div id='feedback'></div>
        </div>
    </div>
    <div class='clear'></div>
</div>
