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
<div id='wpbody' class="stackla-admin-setting">
    <div id='wpbody-content' aria-label='Main content' tabindex='0'>
        <div class='wrap'>
            <h2 class="header">Stackla For WordPress</h2>
            <?php
                if($state == 'init'):
            ?>
                <div class='auth-notification prompt'>
                    <h3>Autorization Required</h3>
                    <li>
                        Your WordPress Account is not authorized with Stackla. Enter your app details below to authorize this plugin.
                    </li>
                </div>
            <?php
                elseif($state == 'authenticated'):
            ?>
                <div class='auth-notification prompt'>
                    <h3>Authorization Required</h3>
                    <li>
                        Your WordPress Account is not authorized with Stackla. <a href="<?php echo ($access_uri) ? $access_uri : ''; ?>">Authorize</a>
                    </li>
                </div>
            <?php
                else:
            ?>
                <div class='auth-notification success'>
                    <h3>
                        Authorization Successful
                    </h3>
                    <ul>
                        <li>Plugin instance authorized with Stackla</li>
                        <li>WordPress account authorized with Stackla</li>
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
                        $mandatoryChecked = '';
                        $typeChecked = '';
                        if ($settings['post_types'] && isset($settings['post_types'][$option]) && $settings['post_types'][$option]['mandatory']) {
                            $mandatoryChecked = 'checked';
                        }
                        if ($settings['post_types'] && isset($settings['post_types'][$option]) && $settings['post_types'][$option]['enabled']) {
                            $typeChecked = 'checked';
                        }
                ?>
                    <fieldset>
                        <label class="stackla-post-type">
                            <input type='checkbox' name='types[]' <?php echo $typeChecked ?> value="<?php echo $option ?>">
                            <?php echo ucfirst($option) ?>s
                        </label>
                        <label class="stackla-mandatory-post-type">
                            <input type='checkbox' name='mandatoryTypes[]' <?php echo $mandatoryChecked ?> value="<?php echo $option ?>">
                            mandatory
                        </label>
                    </fieldset>
                <?php
                    endforeach;
                ?>
                <input type='submit' value='Save' class='button'>
                <?php if ($state == 'authorized') : ?>
                <input type='button'
                    id="js-revoke-token"
                    value='Revoke authorization'
                    class='button'
                    data-url="<?php echo $callback_url ?>">
                <input type='button'
                    id="js-regenerate-token"
                    value='Reauthorize'
                    class='button'
                    data-url="<?php echo $access_uri ?>">
                <?php endif; ?>
            </form>
            <div id='feedback'></div>
        </div>
    </div>
    <div class='clear'></div>
</div>
