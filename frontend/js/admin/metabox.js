(function()
{
    'use strict';

    window.stacklaWp.admin.metabox =
    {
        postId:false,
        data:false,
        validator:false,
        handler:false,
        token:false,
        accessUri:false,
        widgets:false,
        /**
        *   Runs code required for rendering the metabox;
        *   @param {callback} a callback function to render the view;
        *   @return void;
        */
        run:function(callback)
        {

            if(!$(stacklaWp.admin.config.wpMetabox).length) return;

            var $wpMetabox = $(stacklaWp.admin.config.wpMetabox);
            
            this.postId = $wpMetabox.data('postid');
            this.data = $wpMetabox.data('stackla');
            this.data.filters = this.tryJsonParse(this.data.filters);
            this.data.terms = this.tryJsonParse(this.data.terms);
            this.data.widget = this.tryJsonParse(this.data.widget);
            this.validator = $wpMetabox.data('validator');
            this.handler = $wpMetabox.data('handler');
            this.token = $wpMetabox.data('token');
            this.accessUri = $wpMetabox.data('accessuri');
            this.widgets = $wpMetabox.data('widgets');

            if(typeof callback == 'function')
            {
                callback();
            }
        },
        tryJsonParse:function(string)
        {
            var result;

            try
            {
                result = JSON.parse(string);
            }
            catch(e)
            {
                result = false;
            }

            return result;
        }
    };
}());