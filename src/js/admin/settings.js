(function (window) {
    'use strict';
    if (typeof $ === 'undefined') {
        var $ = jQuery;
    }
    window.stacklaWp.admin.settings = {
        config: {
            settingsForm: '#stackla-settings-form',
            settingsFormFeedback: '#feedback',
            onSuccessMessage: 'Your settings have been saved',
            redirectCookieKey: 'stacklaPluginAuthRedirect',
            fields: {
                stack: '#stack',
                client_id: '#client_id',
                client_secret: '#client_secret',
                callback: '#callback'
            }
        },
        run: function () {
            if(!$(this.config.settingsForm).length) return;

            if (
                $.cookie(this.config.redirectCookieKey)
                && $.cookie(this.config.redirectCookieKey) !== 'undefined'
            ) {
                window.location = $.cookie(this.config.redirectCookieKey);
                $.removeCookie(this.config.redirectCookieKey);
                return;
            }

            var self = this;
            var $form = $(this.config.settingsForm);
            var $state = $form.data('state');

            $form.on('submit', function (e) {
                e.preventDefault();

                $('.error-message').removeClass('display');
                $('.widefat').removeClass('error');
                var data = $form.serialize() + "&action=stackla_setting_save";
                $.ajax({
                    url: ajaxurl,
                    method: 'POST',
                    data: data,
                }).done(function (response) {
                    if (response !== '1') {
                        $.each(JSON.parse(response), function (k , v) {
                            var $field = $(self.config.fields[k]);
                            var $error = $field.next('.error-message');

                            if (v !== false) {
                                $field.addClass('error');
                                $error.addClass('display').text(v);
                            }
                        });
                    } else {
                        $(self.config.settingsFormFeedback).removeClass('failure').addClass('success').html(self.config.onSuccessMessage);
                        location.reload();
                    }
                }).fail(function (xhr, status, error) {
                    $(self.config.settingsFormFeedback).addClass('failure').html(error);
                });
            });

            // Regenerate token
            $('#js-regenerate-token').click(function (e) {
                var $this = $(this);
                window.location = $this.attr('data-url');
            });

            // Revoke token
            $('#js-revoke-token').click(function (e) {
                var $this = $(this);
                $.post(ajaxurl, {action: 'stackla_revoke_token'}, function (r) {
                    window.location.reload();
                });
            });
        }
    };
}(window));
