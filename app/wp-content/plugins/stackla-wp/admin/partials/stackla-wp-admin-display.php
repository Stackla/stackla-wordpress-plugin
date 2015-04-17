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
    $stackla_wp_settings = new Stackla_WP_Settings;
    $settings = array(
        "host" => "https://my.stackla.com/api/",
        "post_type_options" => $stackla_wp_settings->get_post_type_options(),
        "current" => $stackla_wp_settings->get_user_settings(),
        "post_types" => false,
        "stack" => false,
        "client_id" => false,
        "client_secret" => false
    );
    $stackla_stack = (isset($settings['current'])) ? $settings['current']['stackla_stack'] : '';
    $stackla_client_id = (isset($settings['current'])) ? $settings['current']['stackla_client_id'] : '';
    $stackla_client_secret = (isset($settings['current'])) ? $settings['current']['stackla_client_secret'] : '';
    $stackla_callback_uri = (isset($settings['current'])) ? $settings['current']['stackla_callback_uri'] : '';

    if(isset($settings['current']['stackla_post_types']))
    {
        $settings['post_types'] = explode("," , $settings['current']['stackla_post_types']);
    }
?>
<?php  
    $stack = "plugin-development";
    $host  = "https://my.stackla.com/api/";
    $client_id = '09bc6b0935f2eb4110bc97';
    $client_secret = '9470d26ef3c1095add2ab16e0d713badd7912742ee';
    $callback = 'http://localhost:8888/CL110-Stackla-WordpressPlugin/git/app/wp-admin/admin.php?page=stackla';
    $credentials = new Stackla\Core\Credentials($host, null, $stack);
    $access_uri = $credentials->getAccessUri($client_id, $client_secret, $callback);
    echo $access_uri;
?>
<div id='wpbody'>
    <div id='wpbody-content' aria-label='Main content' tabindex='0'>
        <div class='wrap'>
            <h2>Stackla For WordPress</h2>
            <form id='stackla-settings-form' class='settings-form' method='POST' action="<?php echo plugin_dir_url(__FILE__) ?>stackla-wp-admin-handler-settings.php">
                <fieldset>
                    <label>
                        Your stack
                    </label>
                    <input type='text' class='widefat' name='stack' value="<?php echo $stackla_stack; ?>"
                    >
                </fieldset>
                <fieldset>
                    <label>
                        Your client ID
                    </label>
                    <input type='text' class='widefat' name='client_id' value="<?php echo $stackla_client_id; ?>"
                    >
                </fieldset>
                <fieldset>
                    <label>
                        Your client secret
                    </label>
                    <input type='text' class='widefat' name='client_secret' value="<?php echo $stackla_client_secret; ?>"
                    >
                </fieldset>
                <fieldset>
                    <label>
                        Your callback URI
                    </label>
                    <input type='text' class='widefat' name='callback' value="<?php echo $stackla_callback_uri; ?>"
                    >
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
                <input type='submit' value='Save Settings' class='button'>
            </form>
            <div id='feedback'></div>
        </div>
    </div>
    <div class='clear'></div>
</div>
