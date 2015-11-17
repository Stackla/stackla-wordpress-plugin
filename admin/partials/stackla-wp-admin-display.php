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
<div id='wpbody' class="stacklaAdmin">
    <div id='wpbody-content' aria-label='Main content' tabindex='0'>
        <div class='wrap'>
            <h1 class="stacklaAdmin-header">Stackla For WordPress</h1>

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
                        Your WordPress Account is not authorized with Stackla.
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
                <section>
                    <h2>Step 1: Configure Stackla</h2>

                    <p>Before you can configure WordPress, you need to first configure Stackla.</p>
                    <p>Copy the 'Callback URL' below and paste it in the relavan field in the WordPress plugin configuration screen in Stackla.</p>

                    <div class="input-group">
                        <label for="callback">Callback URL</label>
                        <input type='text' class='widefat' name='callback' id='callback' readonly="readonly" value="<?php echo $callback_url; ?>">
                        <p class="description">Please copy + paste this URL into the 'Callback URL' field in the WordPress plugin configuration screen in Stackla.</p>
                        <div class='error-message'></div>
                    </div>
                </section>

                <section>
                    <h2>Step 2: Configure WordPress</h2>

                    <div class="input-group">
                        <label for="stack">Stack shortname</label>
                        <input type='text' class='widefat' name='stack' id='stack' value="<?php echo ($settings['current']) ? $settings['current']['stackla_stack'] : ''; ?>">
                        <p class="description">You can retrieve your Stack shortname from the WordPress configuration settings page.</p>
                        <div class='error-message'></div>
                    </div>

                    <div class="input-group">
                        <label for="client_id">Client ID</label>
                        <input type='text' class='widefat' name='client_id' id='client_id' value="<?php echo ($settings['current']) ? $settings['current']['stackla_client_id'] : ''; ?>">
                        <div class='error-message'></div>
                    </div>

                    <div class="input-group">
                        <label for="client_secret">Client secret</label>
                        <input type='text' class='widefat' name='client_secret' id='client_secret' value="<?php echo ($settings['current']) ? $settings['current']['stackla_client_secret'] : ''; ?>">
                        <div class='error-message'></div>
                    </div>
                </section>

                <section>
                    <h2>Step 3: Activate on post type</h2>

                    <p>Choose the WordPress post types you would like to add the Stackla Widget creation meta box to.</p>

                    <div class="input-group">
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
                        <label class="input-checkbox">
                            <input type='checkbox' name='types[]' <?php echo $typeChecked ?> value="<?php echo $option ?>">
                            <?php echo ucfirst($option) ?>s
                        </label>
                    <?php endforeach; ?>
                    </div>
                </section>

                <section>
                    <h2>Step 4: Authorize</h2>

                    <p>You need to authorize WordPress to access your Stackla account. Click 'Authorize' below, you'll be prompted to log in to Stackla to provide authorization.

                    <div>
                        <?php if ($state == 'authorized') : ?>
                        <input type='button'
                            id="js-revoke-token"
                            value='Revoke authorization'
                            class='button button-danger button-large'
                            data-url="<?php echo $callback_url ?>">
                        <input type='button'
                            id="js-regenerate-token"
                            value='Reauthorize'
                            class='button button-primary button-large'
                            data-url="<?php echo $access_uri ?>">
                        <?php else: ?>
                        <input type='button'
                            id="js-regenerate-token"
                            value='Authorize'
                            class='button button-primary button-large'
                            data-url="<?php echo $access_uri ?>">
                        <?php endif; ?>
                    </div>
                </section>

                <section>
                    <input type='submit' value='Save' class='button'>
                </section>
            </form>
            <div id='feedback'></div>
        </div>
    </div>
    <div class='clear'></div>
</div>
