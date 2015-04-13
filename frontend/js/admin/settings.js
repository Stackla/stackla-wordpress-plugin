(function(window)
{
    'use strict';

    window.stacklaWp.admin.settings =
    {
        config:
        {
            settingsForm:'#stackla-settings-form',
            settingsFormFeedback:'#feedback',
            onSuccessMessage:'Your settings have been saved'
        },
        run:function()
        {
            if(!$(this.config.settingsForm).length) return;

            var self = this;
            var $form = $(this.config.settingsForm);
            
            $form.on('submit' , function(e)
            {
                e.preventDefault();
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
                    }
                }).fail(function(xhr , status , error)
                {
                    $(self.config.settingsFormFeedback).addClass('failure').html(error);
                });
            });
        }
    };
}(window));