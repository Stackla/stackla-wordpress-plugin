(function()
{
    'use strict';

    window.app.admin.stackla.components.StacklaTerm = React.createClass(
    {displayName: "StacklaTerm",
        propTypes:
        {
        
        },
        getInitialState:function()
        {
            return {
                data:[]
            }
        },
        render:function()
        {
            return false;
        }
    });
}());
(function()
{
    'use strict';

    window.app.admin.stackla.components.StacklaTerm = React.createClass(
    {displayName: "StacklaTerm",
        propTypes:
        {
            twitter:React.PropTypes.array,
            facebook:React.PropTypes.array,
            instagram:React.PropTypes.array,
            youtube:React.PropTypes.array
        },
        getInitialState:function()
        {
            return {
                data:[]
            }
        },
        handleNetworkChange:function(e)
        {

        },
        render:function()
        {
            return (
                React.createElement("div", {className: "term"}, 
                React.createElement("label", null, 
                    "Choose a network"
                ), 
                React.createElement("select", {onChange: this.handleNetworkChange}, 
                    React.createElement("option", {value: "twitter"}, "Twitter"), 
                    React.createElement("option", {value: "facebook"}, "Facebook"), 
                    React.createElement("option", {value: "instagram"}, "Instagram"), 
                    React.createElement("option", {value: "youtube"}, "YouTube")
                ), 
                React.createElement("select", {className: "twitter hide", ref: "twitterOptions"}, 
                    
                        this.props.twitter.map(function(option , i)
                        {
                            return React.createElement("option", {key: i, value: option}, option)
                        })
                    
                ), 
                React.createElement("select", {className: "facebook hide", ref: "facebookOptions"}, 
                    
                        this.props.facebook.map(function(option , i)
                        {
                            return React.createElement("option", {key: i, value: option}, option)
                        })
                    
                ), 
                React.createElement("select", {className: "instagram hide", ref: "instagramOptions"}, 
                    
                        this.props.instagram.map(function(option , i)
                        {
                            return React.createElement("option", {key: i, value: option}, option)
                        })
                    
                ), 
                React.createElement("select", {className: "youtube hide", ref: "youtubeOptions"}, 
                    
                        this.props.youtube.map(function(option , i)
                        {
                            return React.createElement("option", {key: i, value: option}, option)
                        })
                    
                )
                )
            );
        }
    });
}());
(function()
{
    'use strict';

    window.app.admin.stackla.components.StacklaWidgetTitle = React.createClass(
    {displayName: "StacklaWidgetTitle",
        propTypes:
        {
            data:React.PropTypes.object
        },
        getInitialState:function()
        {
            return {
                data:[]
            }
        },
        render:function()
        {
            return (
                React.createElement("fieldset", null, 
                    React.createElement("label", null, 
                        "The title for your stackla widget"
                    ), 
                    React.createElement("input", {type: "text", className: "widefat", name: "stackla_wp_title", defaultValue: this.props.data.title})
                )
            );
        }
    });
}());