(function(window)
{
    'use strict';

    window.stacklaWp.admin.config =
    {
        wpMetabox:'#stackla-metabox',
        wpMetaboxId:'stackla-metabox',
        network:
        {
            twitter:['username' , 'hashtag'],
            facebook:['page' , 'search'],
            instagram:['user' , 'hashtag'],
            youtube:['user' , 'search']
        },
        sorting:['latest' , 'greatest' , 'votes'],
        media:['text-only' , 'images' , 'video']
    };
}(window));