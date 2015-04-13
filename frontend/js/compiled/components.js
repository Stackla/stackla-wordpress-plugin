(function(window)
{
    'use strict';

    window.stacklaWp.admin.metabox.components.StacklaWidgetTitle = React.createClass(
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
}(window));

/*
    This shouldn't be here, it's a gulp problem, fix it
*/

(function(window)
{
    'use strict';

    window.stacklaWp.admin.metabox.components.StacklaFilter = React.createClass(
    {displayName: "StacklaFilter",
        propTypes:
        {
            
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
                React.createElement("div", {className: "stackla-filter"}, 
                    React.createElement("fieldset", {className: "term-name"}, 
                        React.createElement("label", null, 
                            "Filter name"
                        ), 
                        React.createElement("input", {type: "text", className: "widefat"})
                    ), 
                    React.createElement("fieldset", null, 
                        React.createElement("label", null, 
                            "Network"
                        ), 
                        React.createElement("select", {onChange: this.handleNetworkChange}, 
                            React.createElement("option", null), 
                            React.createElement("option", {value: "twitter"}, "Twitter"), 
                            React.createElement("option", {value: "facebook"}, "Facebook"), 
                            React.createElement("option", {value: "instagram"}, "Instagram"), 
                            React.createElement("option", {value: "youtube"}, "YouTube")
                        )
                    ), 
                     React.createElement("fieldset", null, 
                        React.createElement("label", null, 
                            "Media"
                        ), 
                        React.createElement("fieldset", null, 
                            React.createElement("input", {type: "checkbox"}), React.createElement("label", {className: "checkbox"}, "Text-only")
                        ), 
                        React.createElement("fieldset", null, 
                            React.createElement("input", {type: "checkbox"}), React.createElement("label", {className: "checkbox"}, "Images")
                        ), 
                        React.createElement("fieldset", null, 
                            React.createElement("input", {type: "checkbox"}), React.createElement("label", {className: "checkbox"}, "Video")
                        )
                     ), 
                     React.createElement("fieldset", null, 
                        React.createElement("label", null, 
                            "Sorting"
                        ), 
                        React.createElement("select", null, 
                            React.createElement("option", null), 
                            React.createElement("option", {value: "latest"}, "Latest"), 
                            React.createElement("option", {value: "greatest"}, "Greatest"), 
                            React.createElement("option", {value: "votes"}, "Votes")
                        )
                     )
                 )
            );
        }
    });
}(window));
/*
    Beware all ye who enter; there's a bunch of hardcoded stuff in here
*/
(function(window)
{
    'use strict';

    window.stacklaWp.admin.metabox.components.StacklaNetworkSelect = React.createClass(
    {displayName: "StacklaNetworkSelect",
        propTypes:
        {
            twitter:React.PropTypes.array,
            facebook:React.PropTypes.array,
            instagram:React.PropTypes.array,
            youtube:React.PropTypes.array,
            key:React.PropTypes.number
        },
        getInitialState:function()
        {
            return {
                data:[]
            }
        },
        /**
        *   Handles the user changed the network option;
        *   @param {e} a JavaScript event object;
        *   @return void;
        */
        handleNetworkChange:function(e)
        {
            var value = e.target.value;

            $(React.findDOMNode(this.refs.termRules)).find('select').removeClass('display');
            $(React.findDOMNode(this.refs.termValue)).find('fieldset').removeClass('display');

            if(value == '')
            {
                $(React.findDOMNode(this.refs.termRulesLabel)).removeClass('display');
                $(React.findDOMNode(this.refs.termValue)).find('fieldset').removeClass('display');
            }
            else
            {
                $(React.findDOMNode(this.refs.termRulesLabel)).addClass('display');
                $(React.findDOMNode(this.refs[value])).addClass('display');
            }
        },
        /**
        *   Handles the user changed the network's rule option;
        *   @param {e} a JavaScript event object;
        *   @return void;
        */
        handleRuleChange:function(e)
        {
            var value = e.target.value;

            $(React.findDOMNode(this.refs.termValue)).find('fieldset').removeClass('display');

            $(React.findDOMNode(this.refs[value])).addClass('display')
        },
        render:function()
        {
            return (
                React.createElement("div", {className: "network-select", key: this.props.key}, 
                    React.createElement("fieldset", {className: "term-name"}, 
                        React.createElement("label", null, 
                            "Term name"
                        ), 
                        React.createElement("input", {type: "text", className: "widefat"})
                    ), 
                    React.createElement("fieldset", null, 
                        React.createElement("label", null, 
                            "Choose a network"
                        ), 
                        React.createElement("select", {onChange: this.handleNetworkChange}, 
                            React.createElement("option", null), 
                            React.createElement("option", {value: "twitter"}, "Twitter"), 
                            React.createElement("option", {value: "facebook"}, "Facebook"), 
                            React.createElement("option", {value: "instagram"}, "Instagram"), 
                            React.createElement("option", {value: "youtube"}, "YouTube")
                        )
                    ), 
                    React.createElement("fieldset", {ref: "termRules"}, 
                        React.createElement("label", {className: "hide", ref: "termRulesLabel"}, 
                            "Choose a term"
                        ), 
                        React.createElement("select", {className: "hide", ref: "twitter", onChange: this.handleRuleChange}, 
                            React.createElement("option", null), 
                            
                                this.props.twitter.map(function(option , i)
                                {
                                    return React.createElement("option", {key: i, value: 'twitter-' + option}, option)
                                })
                            
                        ), 
                        React.createElement("select", {className: "hide", ref: "facebook", onChange: this.handleRuleChange}, 
                            React.createElement("option", null), 
                            
                                this.props.facebook.map(function(option , i)
                                {
                                    return React.createElement("option", {key: i, value: 'facebook-' + option}, option)
                                })
                            
                        ), 
                        React.createElement("select", {className: "hide", ref: "instagram", onChange: this.handleRuleChange}, 
                            React.createElement("option", null), 
                            
                                this.props.instagram.map(function(option , i)
                                {
                                    return React.createElement("option", {key: i, value: 'instagram-' + option}, option)
                                })
                            
                        ), 
                        React.createElement("select", {className: "hide", ref: "youtube", onChange: this.handleRuleChange}, 
                            React.createElement("option", null), 
                            
                                this.props.youtube.map(function(option , i)
                                {
                                    return React.createElement("option", {key: i, value: 'youtube-' + option}, option)
                                })
                            
                        )
                    ), 
                    React.createElement("fieldset", {ref: "termValue", className: "rule-values"}, 
                        React.createElement("fieldset", {ref: "twitter-username", className: "hide"}, 
                            React.createElement("label", null, 
                                "Twitter Username"
                            ), 
                            React.createElement("span", {className: "decorator"}, 
                                "@"
                            ), 
                            React.createElement("input", {type: "text", maxLength: "15", ref: "twitterUsernameInput"})
                        ), 
                        React.createElement("fieldset", {ref: "twitter-hashtag", className: "hide"}, 
                            React.createElement("label", null, 
                                "Twitter Hashtag"
                            ), 
                            React.createElement("span", {className: "decorator"}, 
                                "#"
                            ), 
                            React.createElement("input", {type: "text", maxLength: "129", ref: "twitterHashtagInput"})
                        ), 
                        React.createElement("fieldset", {ref: "facebook-page", className: "hide"}, 
                            React.createElement("label", null, 
                                "Facebook Page URL or Facebook Page Name"
                            ), 
                            React.createElement("input", {type: "text", ref: "facebookPageInput"})
                        ), 
                        React.createElement("fieldset", {ref: "facebook-search", className: "hide"}, 
                            React.createElement("label", null, 
                                "Facebook Search (Search for all these words)"
                            ), 
                            React.createElement("input", {type: "text", ref: "facebookSearchInput"})
                        ), 
                        React.createElement("fieldset", {ref: "instagram-user", className: "hide"}, 
                            React.createElement("label", null, 
                                "Instagram User"
                            ), 
                            React.createElement("span", {className: "decorator"}, 
                                "@"
                            ), 
                            React.createElement("input", {type: "text", ref: "instagramUserInput"})
                        ), 
                        React.createElement("fieldset", {ref: "instagram-hashtag", className: "hide"}, 
                            React.createElement("label", null, 
                                "Instagram Hashtag"
                            ), 
                            React.createElement("span", {className: "decorator"}, 
                                "#"
                            ), 
                            React.createElement("input", {type: "text", ref: "instagramHashtagInput"})
                        ), 
                        React.createElement("fieldset", {ref: "youtube-user", className: "hide"}, 
                            React.createElement("label", null, 
                                "YouTube Username"
                            ), 
                            React.createElement("input", {type: "text", ref: "youtubeUserInput"})
                        ), 
                        React.createElement("fieldset", {ref: "youtube-search", className: "hide"}, 
                            React.createElement("label", null, 
                                "YouTube Search"
                            ), 
                            React.createElement("input", {type: "text", ref: "youtubeSearchInput"})
                        )
                    )
                )
            );
        }
    });
}(window));
(function(window)
{
    'use strict';

    window.stacklaWp.admin.metabox.components.StacklaTerm = React.createClass(
    {displayName: "StacklaTerm",
        propTypes:
        {
        },
        getInitialState:function()
        {
            return {
                dependencies:
                {
                    StacklaNetworkSelect:stacklaWp.admin.metabox.components.StacklaNetworkSelect
                },
                count:1,
                terms:[]
            }
        },
        /**
        *   Adds one to the count of StacklaNetworkSelect components to render;
        *   @return void;
        */
        addTerm:function()
        {
            this.setState(
            {
                terms:[],
                count:this.state.count + 1
            });
        },
        /**
        *   Subracts one to the count of StacklaNetworkSelect components to render;
        *   @return void;
        */
        removeTerm:function()
        {
            if(this.state.count <= 1) return;
            this.setState(
            {
                terms:[],
                count:this.state.count - 1
            });
        },
        /**
        *   Loops through the count, pushes StacklaNetworkSelect components to the terms array;
        *   Renders these components;
        *   @return void;
        */
        render:function()
        {
            var i;

            for(i = 0 ; i < this.state.count ; i++)
            {
                this.state.terms.push(
                    React.createElement(this.state.dependencies.StacklaNetworkSelect, {
                        twitter: stacklaWp.admin.metabox.config.network.twitter, 
                        facebook: stacklaWp.admin.metabox.config.network.facebook, 
                        instagram: stacklaWp.admin.metabox.config.network.instagram, 
                        youtube: stacklaWp.admin.metabox.config.network.youtube, 
                        key: i}
                    )
                );
            }

            return (
                React.createElement("div", {className: "term"}, 
                    this.state.terms
                )
            );
        }
    });
}(window));