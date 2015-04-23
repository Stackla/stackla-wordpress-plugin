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
        run:function(callback)
        {
            /**
            *   Runs code required for rendering the metabox;
            *   @param {callback} a callback function to render the view;
            *   @return void;
            */
            if(!$(stacklaWp.admin.config.wpMetabox).length) return;

            var $wpMetabox = $(stacklaWp.admin.config.wpMetabox);
            
            this.postId = $wpMetabox.data('postid');
            this.data = $wpMetabox.data('stackla');

            this.data.filters = this.tryJsonParse(this.data.filters);
            this.data.terms = this.tryJsonParse(this.data.terms);
            this.validator = $wpMetabox.data('validator');
            this.handler = $wpMetabox.data('handler');
            this.token = $wpMetabox.data('token');

            if(typeof callback == 'function')
            {
                callback();
            }
        },
        getData:function(promises)
        {
            $.ajax(
            {
                url:$wpMetabox.data('json') + '?postId=' + $wpMetabox.data('postid'),
                type:"GET",
                dataType:'json'
            }).done(function(response)
            {
                promises.onDone(response);
            }).fail(function(xhr , status , error)
            {
                promises.onFail(xhr , status , error);
            });
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