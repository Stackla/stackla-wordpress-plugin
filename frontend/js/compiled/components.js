(function()
{
    'use strict';

    window.stacklaWp.admin.components.Filter = React.createClass(
    {displayName: "Filter",
        propTypes:
        {
            key:React.PropTypes.number
        },
        getInitialState:function()
        {
            return {
                id:this.props.id,
                name:'',
                network:'',
                media:[],
                sorting:''
            }
        },
        handleNameChange:function(e)
        {
            this.setState({name:e.target.value});
        },
        handleNetworkChange:function(e)
        {
            this.setState({network:e.target.value});
        },
        handleMediaCheck:function(e)
        {
            var copy = this.state.media.slice();
            var index = copy.indexOf(e.target.value);

            if(e.target.checked === true)
            {
                if(index <= -1)
                {
                    copy.push(e.target.value);

                    this.setState(
                    {
                        media:copy
                    });
                }
            }
            else
            {
                if(index > -1)
                {
                    copy.splice(index , 1);

                    this.setState(
                    {
                        media:copy
                    });
                }
            }
        },
        handleSortingChange:function(e)
        {
            this.setState({sorting:e.target.value});
        },
        render:function()
        {
            return (
                React.createElement("div", {className: "stackla-widget-filter", key: this.props.key}, 
                    React.createElement("fieldset", {className: "term-name"}, 
                        React.createElement("label", null, 
                            "Filter name"
                        ), 
                        React.createElement("input", {type: "text", className: "widefat", onChange: this.handleNameChange})
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
                            React.createElement("input", {type: "checkbox", value: "text-only", onChange: this.handleMediaCheck}), 
                            React.createElement("label", {className: "checkbox"}, 
                                "Text-only"
                            )
                        ), 
                        React.createElement("fieldset", null, 
                            React.createElement("input", {type: "checkbox", value: "images", onChange: this.handleMediaCheck}), 
                            React.createElement("label", {className: "checkbox"}, 
                                "Images"
                            )
                        ), 
                        React.createElement("fieldset", null, 
                            React.createElement("input", {type: "checkbox", value: "video", onChange: this.handleMediaCheck}), 
                            React.createElement("label", {className: "checkbox"}, 
                                "Video"
                            )
                        )
                     ), 
                     React.createElement("fieldset", null, 
                        React.createElement("label", null, 
                            "Sorting"
                        ), 
                        React.createElement("select", {onChange: this.handleSortingChange}, 
                            React.createElement("option", null), 
                            React.createElement("option", {value: "latest"}, 
                                "Latest"
                            ), 
                            React.createElement("option", {value: "greatest"}, 
                                "Greatest"
                            ), 
                            React.createElement("option", {value: "votes"}, 
                                "Votes"
                            )
                        )
                     )
                 )
            );
        }
    });
}());
(function()
{
    'use strict';

    window.stacklaWp.admin.components.Metabox = React.createClass(
    {displayName: "Metabox",
        propTypes:
        {
        
        },
        getInitialState:function()
        {
            return {
                data:{},
                dependencies:
                {
                    WidgetTitle:stacklaWp.admin.components.WidgetTitle,
                    WidgetTerms:stacklaWp.admin.components.WidgetTerms,
                    WidgetFilters:stacklaWp.admin.components.WidgetFilters
                }
            }
        },
        handleAddFilter:function(e)
        {
            e.preventDefault();
            this.refs.filter.addFilter();
        },
        /**
        *   Calls the WidgetFilters removeFilter method;
        *   @param {e} a JavaScript event object;
        *   @return void;
        */
        handleRemoveFilter:function(e)
        {
            e.preventDefault();
            this.refs.filter.removeFilter();
        },
        save:function(e)
        {
            e.preventDefault();

            var termsRefs = this.refs.terms.refs;
            var filtersRefs = this.refs.filters.refs;
            var terms = [];
            var filters = [];
            var data = {};

            /*
                @note copy the state of the children using $.extend just to be safe!
            */

            $.each(termsRefs , function(key , value)
            {
                var state = $.extend({} , value.state); 
                terms.push(state);
            });

            $.each(filtersRefs , function(key , value)
            {
                var state = $.extend({} , value.state);
                filters.push(state);
            });

            data =
            {
                'title':this.refs.title.state.value,
                'terms':terms,
                'filters':filters
            };

            console.log(data);

            $.ajax(
            {
                url:stacklaWp.admin.metabox.handler,
                type:'POST',
                dataType:'json',
                data:data
            }).done(function(response)
            {
                console.log('done!');
                console.log(response);
            }).fail(function(xhr , status , error)
            {
                console.log('fail!');
                console.log(error);
            });
    
        },
        render:function()
        {
            return (
                React.createElement("div", {className: "jsx-metabox"}, 
                    React.createElement(this.state.dependencies.WidgetTitle, {
                        initialTitle: stacklaWp.admin.metabox.data.title, 
                        ref: "title"}
                    ), 
                    React.createElement("section", {className: "terms"}, 
                        React.createElement(this.state.dependencies.WidgetTerms, {ref: "terms"})
                    ), 
                    React.createElement("section", {className: "filters"}, 
                        React.createElement(this.state.dependencies.WidgetFilters, {ref: "filters"})
                    ), 
                    React.createElement("a", {href: "#", onClick: this.save}, "Save")
                )
            );
        }
    });
}());
/*
    Beware all ye who enter; there's a bunch of hardcoded stuff in here
*/
(function(window)
{
    'use strict';

    window.stacklaWp.admin.components.Term = React.createClass(
    {displayName: "Term",
        propTypes:
        {
            twitter:React.PropTypes.array,
            facebook:React.PropTypes.array,
            instagram:React.PropTypes.array,
            youtube:React.PropTypes.array,
            id:React.PropTypes.number
        },
        getInitialState:function()
        {
            return {
                id:this.props.id,
                name:'',
                network:'',
                term:'',
                termValue:''
            }
        },
        handleNameChange:function(e)
        {
            this.setState({name:e.target.value});
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

            this.setState(
            {
                network:value,
                term:false,
                termValue:false
            });
        },
        /**
        *   Handles the user changed the network's term option;
        *   @param {e} a JavaScript event object;
        *   @return void;
        */
        handleTermChange:function(e)
        {
            var value = e.target.value;
            var split = value.split('-');

            $(React.findDOMNode(this.refs.termValue)).find('fieldset').removeClass('display');

            $(React.findDOMNode(this.refs[value])).addClass('display')

            this.setState(
            {
                term:split[1],
                termValue:false
            });
        },
        handleTermValueChange:function(e)
        {
            this.setState({termValue:e.target.value});
        },
        render:function()
        {
            return (
                React.createElement("div", {className: "stackla-widget-term", key: this.props.key}, 
                    React.createElement("fieldset", {className: "term-name"}, 
                        React.createElement("label", null, 
                            "Term name"
                        ), 
                        React.createElement("input", {type: "text", className: "widefat", onChange: this.handleNameChange})
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
                        React.createElement("select", {className: "hide", ref: "twitter", onChange: this.handleTermChange}, 
                            React.createElement("option", null), 
                            
                                this.props.twitter.map(function(option , i)
                                {
                                    return React.createElement("option", {key: i, value: 'twitter-' + option}, option)
                                })
                            
                        ), 
                        React.createElement("select", {className: "hide", ref: "facebook", onChange: this.handleTermChange}, 
                            React.createElement("option", null), 
                            
                                this.props.facebook.map(function(option , i)
                                {
                                    return React.createElement("option", {key: i, value: 'facebook-' + option}, option)
                                })
                            
                        ), 
                        React.createElement("select", {className: "hide", ref: "instagram", onChange: this.handleTermChange}, 
                            React.createElement("option", null), 
                            
                                this.props.instagram.map(function(option , i)
                                {
                                    return React.createElement("option", {key: i, value: 'instagram-' + option}, option)
                                })
                            
                        ), 
                        React.createElement("select", {className: "hide", ref: "youtube", onChange: this.handleTermChange}, 
                            React.createElement("option", null), 
                            
                                this.props.youtube.map(function(option , i)
                                {
                                    return React.createElement("option", {key: i, value: 'youtube-' + option}, option)
                                })
                            
                        )
                    ), 
                    React.createElement("fieldset", {ref: "termValue", className: "term-values"}, 
                        React.createElement("fieldset", {ref: "twitter-username", className: "hide"}, 
                            React.createElement("label", null, 
                                "Twitter Username"
                            ), 
                            React.createElement("span", {className: "decorator"}, 
                                "@"
                            ), 
                            React.createElement("input", {type: "text", maxLength: "15", ref: "twitterUsernameInput", onChange: this.handleTermValueChange})
                        ), 
                        React.createElement("fieldset", {ref: "twitter-hashtag", className: "hide"}, 
                            React.createElement("label", null, 
                                "Twitter Hashtag"
                            ), 
                            React.createElement("span", {className: "decorator"}, 
                                "#"
                            ), 
                            React.createElement("input", {type: "text", maxLength: "129", ref: "twitterHashtagInput", onChange: this.handleTermValueChange})
                        ), 
                        React.createElement("fieldset", {ref: "facebook-page", className: "hide"}, 
                            React.createElement("label", null, 
                                "Facebook Page URL or Facebook Page Name"
                            ), 
                            React.createElement("input", {type: "text", ref: "facebookPageInput", onChange: this.handleTermValueChange})
                        ), 
                        React.createElement("fieldset", {ref: "facebook-search", className: "hide"}, 
                            React.createElement("label", null, 
                                "Facebook Search (Search for all these words)"
                            ), 
                            React.createElement("input", {type: "text", ref: "facebookSearchInput", onChange: this.handleTermValueChange})
                        ), 
                        React.createElement("fieldset", {ref: "instagram-user", className: "hide"}, 
                            React.createElement("label", null, 
                                "Instagram User"
                            ), 
                            React.createElement("span", {className: "decorator"}, 
                                "@"
                            ), 
                            React.createElement("input", {type: "text", ref: "instagramUserInput", onChange: this.handleTermValueChange})
                        ), 
                        React.createElement("fieldset", {ref: "instagram-hashtag", className: "hide"}, 
                            React.createElement("label", null, 
                                "Instagram Hashtag"
                            ), 
                            React.createElement("span", {className: "decorator"}, 
                                "#"
                            ), 
                            React.createElement("input", {type: "text", ref: "instagramHashtagInput", onChange: this.handleTermValueChange})
                        ), 
                        React.createElement("fieldset", {ref: "youtube-user", className: "hide"}, 
                            React.createElement("label", null, 
                                "YouTube Username"
                            ), 
                            React.createElement("input", {type: "text", ref: "youtubeUserInput", onChange: this.handleTermValueChange})
                        ), 
                        React.createElement("fieldset", {ref: "youtube-search", className: "hide"}, 
                            React.createElement("label", null, 
                                "YouTube Search"
                            ), 
                            React.createElement("input", {type: "text", ref: "youtubeSearchInput", onChange: this.handleTermValueChange})
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

    window.stacklaWp.admin.components.WidgetFilters = React.createClass(
    {displayName: "WidgetFilters",
        propTypes:
        {
            
        },
        getInitialState:function()
        {
            return {
                dependencies:
                {
                    Filter:stacklaWp.admin.components.Filter
                },
                count:1,
                items:[]
            }
        },
        add:function(e)
        {
            e.preventDefault();

            this.setState(
            {
                items:[],
                count:this.state.count + 1
            });
        },
        remove:function(e)
        {
            e.preventDefault();

            if(this.state.count <= 1) return;
            this.setState(
            {
                items:[],
                count:this.state.count - 1
            });
        },
        render:function()
        {
            var i;

            for(i = 0 ; i < this.state.count ; i ++)
            {
                this.state.items.push(
                    React.createElement(this.state.dependencies.Filter, {
                        key: i, 
                        id: i, 
                        ref: i}
                    )
                );
            }

            return (
                React.createElement("div", {className: "stackla-widget-filters"}, 
                    React.createElement("header", null, 
                        React.createElement("h2", null, "Create Filters"), 
                        React.createElement("a", {href: "#", className: "button", onClick: this.add}, "Add Filter"), 
                        React.createElement("a", {href: "#", className: "button", onClick: this.remove}, "Remove Filter")
                    ), 
                    this.state.items
                )
            );
        }
    });
}(window));
(function(window)
{
    'use strict';

    window.stacklaWp.admin.components.WidgetTerms = React.createClass(
    {displayName: "WidgetTerms",
        propTypes:
        {
        },
        getInitialState:function()
        {
            return {
                dependencies:
                {
                    Term:stacklaWp.admin.components.Term
                },
                count:1,
                items:[],
                data:[]
            }
        },
        /**
        *   Adds one to the count of Term components to render;
        *   @return void;
        */
        addTerm:function(e)
        {
            e.preventDefault();

            this.setState(
            {
                items:[],
                count:this.state.count + 1
            });
        },
        /**
        *   Subracts one to the count of Term components to render;
        *   @return void;
        */
        removeTerm:function(e)
        {
            e.preventDefault();

            if(this.state.count <= 1) return;
            this.setState(
            {
                items:[],
                count:this.state.count - 1
            });
        },
        /**
        *   Loops through the count, pushes Term components to the items array;
        *   Renders these components;
        *   @return void;
        */
        render:function()
        {
            var i;

            for(i = 0 ; i < this.state.count ; i++)
            {
                this.state.items.push(
                    React.createElement(this.state.dependencies.Term, {
                        twitter: stacklaWp.admin.config.network.twitter, 
                        facebook: stacklaWp.admin.config.network.facebook, 
                        instagram: stacklaWp.admin.config.network.instagram, 
                        youtube: stacklaWp.admin.config.network.youtube, 
                        key: i, 
                        id: i, 
                        ref: i}
                    )
                );
            }

            return (
                React.createElement("div", {className: "stackla-widget-terms"}, 
                    React.createElement("header", null, 
                        React.createElement("h2", null, "Create Terms"), 
                        React.createElement("a", {href: "#", className: "button", onClick: this.addTerm}, "Add Term"), 
                        React.createElement("a", {href: "#", className: "button", onClick: this.removeTerm}, "Remove Term")
                    ), 
                    this.state.items
                )
            );
        }
    });
}(window));
(function(window)
{
    'use strict';

    window.stacklaWp.admin.components.WidgetTitle = React.createClass(
    {displayName: "WidgetTitle",
        propTypes:
        {
            initialTitle:React.PropTypes.string
        },
        getInitialState:function()
        {
            return {
                value:this.props.initialTitle
            }
        },
        handleChange:function(e)
        {
            this.setState({value:e.target.value});
        },
        render:function()
        {
            return (
                React.createElement("fieldset", null, 
                    React.createElement("label", null, 
                        "The title for your stackla widget"
                    ), 
                    React.createElement("input", {
                        type: "text", 
                        className: "widefat", 
                        defaultValue: this.state.value, 
                        onChange: this.handleChange}
                    )
                )
            );
        }
    });
}(window));