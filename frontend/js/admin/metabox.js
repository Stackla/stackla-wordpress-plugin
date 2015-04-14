(function()
{
    'use strict';

    window.stacklaWp.admin.metabox =
    {
        data:false,
        handler:false,
        run:function(callback)
        {
            /**
            *   Runs code required for rendering the metabox;
            *   @param {callback} a callback function to render the view;
            *   @return void;
            */

            if(!$(stacklaWp.admin.config.wpMetabox).length) return;

            var $wpMetabox = $(stacklaWp.admin.config.wpMetabox);
            this.data = $wpMetabox.data('stackla');
            this.handler = $wpMetabox.data('handler');

            if(typeof callback == 'function')
            {
                callback();
            }
        }
    };
}());