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
        "current" => $stackla_wp_settings->get_user_settings(),
        "post_type_options" => $stackla_wp_settings->get_post_type_options(),
        "post_types" => false
    );

    $auth_host = "https://api.qa.stackla.com/api/";
    $stackla_stack = '';
    $stackla_client_id = '';
    $stackla_client_secret = '';
    $stackla_callback_uri = '';
    $current = false;
    $access_token = false;
    $token_response = false;
    $token_saved = false;

    if(is_array($settings['current']))
    {
        $current = $settings['current'];

        $stackla_stack = $current['stackla_stack'];
        $stackla_client_id = $current['stackla_client_id'];
        $stackla_client_secret = $current['stackla_client_secret'];
        $stackla_callback_uri = $current['stackla_callback_uri'];
        $stackla_token = $current['stackla_token'];

        if(isset($current['stackla_post_types']))
        {
            $settings['post_types'] = explode("," , $current['stackla_post_types']);
        }

        if(!is_null($stackla_token) && strlen($stackla_token) > 0)
        {
            $access_token = $stackla_token;
        }
    }

    $credentials = new Stackla\Core\Credentials($auth_host, null, $stackla_stack);
    $access_uri = $credentials->getAccessUri($stackla_client_id, $stackla_client_secret, $stackla_callback_uri);

    if(isset($_GET['code']))
    {
        try
        {
            $token_response = $credentials->generateToken(
                $stackla_client_id,
                $stackla_client_secret,
                $_GET['code'],
                $stackla_callback_uri
            );
            if($token_response)
            {
                $access_token = $credentials->token;
                $token_saved = $stackla_wp_settings->save_access_token($access_token);
            }
        }
        catch(Exception $e)
        {
            echo $e->getMessage();
        }        
    }
?>
<div id='wpbody'>
    <div id='wpbody-content' aria-label='Main content' tabindex='0'>
        <div class='wrap'>
            <h2>Stackla For WordPress</h2>
            <?php  
                if($access_token):
            ?>
                <div class='auth-notification success'>
                    This plugin instance has been authorized
                </div>
            <?php  
                else:
            ?>
                <div class='auth-notification failure'>
                     You have not authorized this plugin instance with Stackla, or your token has expired.
                </div>
            <?php  
                endif;
            ?>
            <form 
                id='stackla-settings-form' 
                class='settings-form' 
                method='POST' 
                action="<?php echo plugin_dir_url(__FILE__) ?>stackla-wp-admin-handler-settings.php"
                data-accessuri="<?php echo $access_uri; ?>"
            >
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
                <?php  
                    if($access_token):
                ?>
                        <input type='submit' value='Save' class='button'>
                <?php   
                    else: 
                ?>
                        <input type='submit' value='Authorize' class='button'>
                <?php 
                    endif; 
                ?>
            </form>
            <div id='feedback'></div>
        </div>
    </div>
    <div class='clear'></div>
</div>
