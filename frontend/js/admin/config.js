(function(window)
{
    'use strict';
    window.stacklaWp.admin.config =
    {
        wpMetabox:'#stackla-metabox',
        wpMetaboxId:'stackla-metabox',
        networks:['twitter' , 'facebook' , 'instagram' , 'youtube'],
        network:
        {
            twitter:['user' , 'hashtag'],
            facebook:['page'],
            instagram:['user' , 'hashtag'],
            youtube:['user' , 'search']
        },
        sorting:['latest' , 'greatest' , 'votes'],
        media:['text-only' , 'images' , 'video']
    };
}(window));