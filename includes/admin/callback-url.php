<?php
    error_reporting(E_ALL);
    ini_set('error_reporting', E_ALL);

    require_once('../../../../../wp-load.php');
    if (isset($_GET['code'])) {
        require_once('../../includes/class-stackla-wp-settings.php');

        $settings = new Stackla_WP_Settings();
        $currentSettings = $settings->get_user_settings();

        /** @var Stackla\Core\Credentials $credentials */
        $credentials = $settings->get_credentials();
        $access_uri = $settings->get_access_uri();
        $access_token = $settings->get_user_access_token();
        $token_response = false;
        $token_saved = false;
        $callback_url = Stackla_WP_SDK_Wrapper::getCallbackUrl();

        if($credentials !== false && $currentSettings !== false) {
            try {
                $token_response = $credentials->generateToken(
                    $currentSettings['stackla_client_id'],
                    $currentSettings['stackla_client_secret'],
                    $_GET['code'],
                    $callback_url
                );
                if($token_response) {
                    $access_token = $credentials->token;
                    $token_saved = $settings->save_access_token($access_token);
                }
            } catch(Exception $e) {
                $settings->log($e->getMessage());
            }
        }
    } elseif (isset($_POST['revoke-token'])) { // Revoke user access token
        try {
            $settings = new Stackla_WP_Settings();
            $settings->clear_access_tokens();
            echo json_encode(array('status' => true));
            exit();
        } catch(Exception $e) {
            $settings->log($e->getMessage());
        }
    }

    wp_redirect(admin_url('admin.php?page=stackla'));
    exit();

?>

