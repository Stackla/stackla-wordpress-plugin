(function(window)
{
    'use strict';

    window.app.admin =
    {
        config:
        {
            settingsForm:'#stackla-settings-form'
        },
        runSettingsForm:function()
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
                    data:$form.serialize()
                }).done(function(response)
                {
                    console.log(response);
                }).fail(function(xhr , status , error)
                {
                    console.log(error);
                });
            });
        }
    };
}(window));