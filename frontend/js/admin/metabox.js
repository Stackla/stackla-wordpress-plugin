(function()
{
    'use strict';

    window.stacklaWp.admin.metabox =
    {
        components:{},
        views:{},
        config:
        {
            viewContainer:'#stackla-metabox',
            network:
            {
                twitter:['username' , 'hashtag'],
                facebook:['page' , 'search'],
                instagram:['user' , 'hashtag'],
                youtube:['user' , 'search']
            },
            sorting:['latest' , 'greatest' , 'votes'],
            media:['text-only' , 'images' , 'video']
        },
        existingData:false,
        run:function()
        {
            if(!$(this.config.viewContainer).length) return;
            this.existingData = $(this.config.viewContainer).data('stackla');
            this.views.StacklaWP();
        }
    };
}());