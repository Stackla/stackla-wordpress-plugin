(function(window)
{
    'use strict';

    window.stacklaWp.admin.settings =
    {
        config:
        {
            settingsForm:'#stackla-settings-form',
            settingsFormFeedback:'#feedback',
            onSuccessMessage:'Your settings have been saved',
            redirectCookieKey:'stacklaPluginAuthRedirect'
        },
        run:function()
        {
            if(!$(this.config.settingsForm).length) return;

            if($.cookie(this.config.redirectCookieKey) && $.cookie(this.config.redirectCookieKey) !== 'undefined')
            {
                window.location = $.cookie(this.config.redirectCookieKey);
                $.removeCookie(this.config.redirectCookieKey);
                return;
            }

            var self = this;
            var $form = $(this.config.settingsForm);
            var $state = $form.data('state');
            var $accessUri = $form.data('accessuri');
            
            $form.on('submit' , function(e)
            {
                e.preventDefault();
                
                if($state == 'authenticated' && $accessUri !== '')
                {
                    window.location = $accessUri;
                }
                else
                {
                    $.ajax(
                    {
                        url:$form.attr('action'),
                        method:'POST',
                        data:$form.serialize(),
                    }).done(function(response)
                    {
                        if(response !== '1')
                        {
                            $(self.config.settingsFormFeedback).addClass('failure').html(response);
                        }
                        else
                        {
                            $(self.config.settingsFormFeedback).removeClass('failure').addClass('success').html(self.config.onSuccessMessage);
                            window.reload();
                        }
                    }).fail(function(xhr , status , error)
                    {
                        $(self.config.settingsFormFeedback).addClass('failure').html(error);
                    });
                }
            });
        }
    };
}(window));