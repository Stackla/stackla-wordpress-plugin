(function()
{
    'use strict';

    window.stacklaWp.admin.components.Filter = React.createClass(
    {displayName: "Filter",
        propTypes:
        {
            key:React.PropTypes.number,
            id:React.PropTypes.number,
            data:React.PropTypes.oneOfType([React.PropTypes.object , React.PropTypes.bool])
        },
        getInitialState:function()
        {
            return {
                id:this.props.id,
                name:(this.props.data) ? this.props.data.name : '',
                network:(this.props.data) ? this.props.data.network : stacklaWp.admin.config.networks,
                media:(this.props.data) ? this.props.data.media : stacklaWp.admin.config.media,
                sorting:(this.props.data) ? this.props.data.sorting : 'latest',
                errors:false
            }
        },
        handleNameChange:function(e)
        {
            this.setState({name:e.target.value});
        },
        handleNetworkCheck:function(e)
        {
            var copy = this.state.network.slice();
            var index = copy.indexOf(e.target.value);

            if(e.target.checked === true)
            {
                if(index <= -1)
                {
                    copy.push(e.target.value);

                    this.setState(
                    {
                        network:copy
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
                        network:copy
                    });
                }
            }
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
        checkArrayValue:function(key , value)
        {
            if(!this.state[key].length) return false;

            if(this.state[key].indexOf(value) > -1)
            {
                return true;
            }
            return false;
        },
        compileData:function()
        {
            var data = $.extend({} , this.state); 

            if(!data.network || !data.network.length)
            {
                data.network = stacklaWp.admin.config.networks;
            }
            if(!data.media || !data.network.length)
            {
                data.media = stacklaWp.admin.config.media;
            }

            return data;
        },
        render:function()
        {
            console.log(this.state.media);
            console.log(this.state.network);
            return (
                React.createElement("div", {className: "stackla-block"}, 
                    React.createElement("div", {className: (this.state.errors === false) ? 'stackla-widget-section' : 'stackla-widget-section stackla-widget-error'}, 
                        React.createElement("fieldset", {className: "term-name"}, 
                            React.createElement("label", null, 
                                "Filter name"
                            ), 
                            React.createElement("input", {
                                type: "text", 
                                className: "widefat", 
                                value: this.state.name, 
                                onChange: this.handleNameChange}
                            )
                        ), 
                        React.createElement("fieldset", null, 
                            React.createElement("label", null, 
                                "Network"
                            ), 
                            React.createElement("fieldset", null, 
                                React.createElement("input", {
                                    type: "checkbox", 
                                    value: "twitter", 
                                    defaultChecked: this.checkArrayValue('network' , 'twitter'), 
                                    onChange: this.handleNetworkCheck}
                                ), 
                                React.createElement("label", {className: "checkbox"}, 
                                    "Twitter"
                                )
                            ), 
                            React.createElement("fieldset", null, 
                                React.createElement("input", {
                                    type: "checkbox", 
                                    value: "facebook", 
                                    defaultChecked: this.checkArrayValue('network' , 'facebook'), 
                                    onChange: this.handleNetworkCheck}
                                ), 
                                React.createElement("label", {className: "checkbox"}, 
                                    "Facebook"
                                )
                            ), 
                            React.createElement("fieldset", null, 
                                React.createElement("input", {
                                    type: "checkbox", 
                                    value: "instagram", 
                                    defaultChecked: this.checkArrayValue('network' , 'instagram'), 
                                    onChange: this.handleNetworkCheck}
                                ), 
                                React.createElement("label", {className: "checkbox"}, 
                                    "Instagram"
                                )
                            ), 
                            React.createElement("fieldset", null, 
                                React.createElement("input", {
                                    type: "checkbox", 
                                    value: "youtube", 
                                    defaultChecked: this.checkArrayValue('network' , 'youtube'), 
                                    onChange: this.handleNetworkCheck}
                                ), 
                                React.createElement("label", {className: "checkbox"}, 
                                    "YouTube"
                                )
                            )
                        ), 
                         React.createElement("fieldset", null, 
                            React.createElement("label", null, 
                                "Media"
                            ), 
                            React.createElement("fieldset", null, 
                                React.createElement("input", {
                                    type: "checkbox", 
                                    value: "text-only", 
                                    onChange: this.handleMediaCheck}), 
                                React.createElement("label", {className: "checkbox"}, 
                                    "Text-only"
                                )
                            ), 
                            React.createElement("fieldset", null, 
                                React.createElement("input", {
                                    type: "checkbox", 
                                    value: "images", 
                                    onChange: this.handleMediaCheck}), 
                                React.createElement("label", {className: "checkbox"}, 
                                    "Images"
                                )
                            ), 
                            React.createElement("fieldset", null, 
                                React.createElement("input", {
                                    type: "checkbox", 
                                    value: "video", 
                                    onChange: this.handleMediaCheck}
                                ), 
                                React.createElement("label", {className: "checkbox"}, 
                                    "Video"
                                )
                            )
                         ), 
                         React.createElement("fieldset", null, 
                            React.createElement("label", null, 
                                "Sorting"
                            ), 
                            React.createElement("select", {value: this.state.sorting, onChange: this.handleSortingChange}, 
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
                     ), 
                     React.createElement("div", {className: (this.state.errors === false) ? 'hide' : 'stackla-error-message'}, 
                        React.createElement("ul", null, 
                            React.createElement("li", {className: (this.state.errors.name) ? '' : 'hide'}, 
                                (this.state.errors.name) ? this.state.errors.name : ''
                            ), 
                            React.createElement("li", {className: (this.state.errors.media) ? '' : 'hide'}, 
                                (this.state.errors.media) ? this.state.errors.media : ''
                            ), 
                            React.createElement("li", {className: (this.state.errors.network) ? '' : 'hide'}, 
                                (this.state.errors.network) ? this.state.errors.network : ''
                            ), 
                            React.createElement("li", {className: (this.state.errors.sorting) ? '' : 'hide'}, 
                                (this.state.errors.sorting) ? this.state.errors.sorting : ''
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

    window.stacklaWp.admin.components.InputError = React.createClass(
    {displayName: "InputError",
        propTypes:
        {
            errorMessage:React.PropTypes.oneOfType([React.PropTypes.string , React.PropTypes.bool])
        },
        render:function()
        {
            return (
                React.createElement("div", {className: this.props.errorMessage ? '' : 'hide'}, 
                    this.props.errorMessage
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
                },
                errors:
                {
                    title:false,
                    terms:[],
                    filters:[]
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
        compileData:function(e)
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
                'postId':stacklaWp.admin.metabox.postId,
                'title':this.refs.title.state.value,
                'terms':terms,
                'filters':filters
            };
            console.log('raw data:');
            console.log(data);
            this.validate(data);
        },
        validate:function(data)
        {
            var self = this;

            $.ajax(
            {
                url:stacklaWp.admin.metabox.validator,
                type:'POST',
                dataType:'json',
                data:data
            }).done(function(response)
            {
                console.log('raw response:');
                console.log(response);
                if(typeof response == 'object')
                {
                    self.handleErrors(response.errors);

                    if(response.result == '1')
                    {
                        self.save(data);
                    }
                }
            }).fail(function(xhr , status , error)
            {
                console.log('fail!');
                console.log(error);
            });
        },
        handleErrors:function(errors)
        {
            var termsErrors = errors.terms;
            var filtersErrors = errors.filters;
            var termsErrorsLength = termsErrors.length;
            var filtersErrorsLength = filtersErrors.length;
            var termsRefs = this.refs.terms.refs;
            var filtersRefs = this.refs.filters.refs;
            var f , t;

            for(f = 0 ; f < filtersErrorsLength ; f ++)
            {
                filtersRefs[f].setState(
                {
                    errors:filtersErrors[f]
                });
            }

            for(t = 0 ; t < termsErrorsLength ; t ++)
            {
                termsRefs[t].setState(
                {
                    errors:termsErrors[t]
                });
            }

            this.refs.title.setState({error:errors.title});

        },
        save:function(data)
        {
            $.ajax(
            {
                url:stacklaWp.admin.metabox.handler,
                type:'POST',
                //dataType:'json',
                data:data
            }).done(function(response)
            {
                console.log('raw post response:');
                console.log(response);
            }).fail(function(xhr , status , error)
            {
                console.log('post fail!');
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
                        React.createElement(this.state.dependencies.WidgetTerms, {ref: "terms", initialData: stacklaWp.admin.metabox.data.terms})
                    ), 
                    React.createElement("section", {className: "filters"}, 
                        React.createElement(this.state.dependencies.WidgetFilters, {ref: "filters", initialData: stacklaWp.admin.metabox.data.filters})
                    ), 
                    React.createElement("a", {href: "#", onClick: this.compileData}, "Save")
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
            errors:React.PropTypes.oneOfType([React.PropTypes.object , React.PropTypes.bool]),
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
                termValue:'',
                errors:false
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
                term:'',
                termValue:''
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
                termValue:''
            });
        },
        handleTermValueChange:function(e)
        {
            this.setState({termValue:e.target.value});
        },
        render:function()
        {
            return (
                React.createElement("div", {className: "stackla-block"}, 
                    React.createElement("div", {className: (this.state.errors === false) ? 'stackla-widget-section' : 'stackla-widget-section stackla-widget-error'}, 
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
                    ), 
                    React.createElement("div", {className: (this.state.errors === false) ? 'hide' : 'stackla-error-message'}, 
                        React.createElement("ul", null, 
                            React.createElement("li", {className: (this.state.errors.name) ? '' : 'hide'}, 
                                (this.state.errors.name) ? this.state.errors.name : ''
                            ), 
                            React.createElement("li", {className: (this.state.errors.network) ? '' : 'hide'}, 
                                (this.state.errors.network) ? this.state.errors.network : ''
                            ), 
                            React.createElement("li", {className: (this.state.errors.term) ? '' : 'hide'}, 
                                (this.state.errors.term) ? this.state.errors.term : ''
                            ), 
                            React.createElement("li", {className: (this.state.errors.termValue) ? '' : 'hide'}, 
                                (this.state.errors.termValue) ? this.state.errors.termValue : ''
                            )
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
            initialData:React.PropTypes.oneOfType([React.PropTypes.array , React.PropTypes.bool])
        },
        getInitialState:function()
        {
            return {
                dependencies:
                {
                    Filter:stacklaWp.admin.components.Filter
                },
                count:(this.props.initialData) ? this.props.initialData.length : 1,
                data:(this.props.initialData) ? this.props.initialData : [],
                items:[]
            }
        },
        /**
        *   Adds a filter fieldset, forces re-render;
        *   @param {e} event object;
        *   @return void;
        */
        add:function(e)
        {
            e.preventDefault();

            this.setState(
            {
                items:[],
                count:this.state.count + 1
            });
        },
        /**
        *   Removes a filter fieldset, forces re-render;
        *   @param {e} event object;
        *   @return void;
        */
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
        /**
        *   Renders the component;
        *   @return {html};
        */
        render:function()
        {            
            var i;
            var fieldsetData = false;

            for(i = 0 ; i < this.state.count ; i ++)
            {
                if(this.state.data.length)
                {
                    if(typeof this.state.data[i] !== 'undefined')
                    {
                        fieldsetData = this.state.data[i];
                    }
                }
                this.state.items.push(
                    React.createElement(this.state.dependencies.Filter, {
                        key: i, 
                        id: i, 
                        ref: i, 
                        data: fieldsetData}
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
            initialData:React.PropTypes.oneOfType([React.PropTypes.array , React.PropTypes.bool])
        },
        getInitialState:function()
        {
            return {
                dependencies:
                {
                    Term:stacklaWp.admin.components.Term
                },
                count:(this.props.initialData) ? this.props.initialData.length : 1,
                data:(this.props.initialData) ? this.props.initialData : [],
                items:[],
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
                dependencies:
                {
                    InputError:stacklaWp.admin.components.InputError
                },
                value:this.props.initialTitle,
                error:false
            }
        },
        handleChange:function(e)
        {
            this.setState({value:e.target.value});
        },
        render:function()
        {
            return (
                React.createElement("div", {className: "stackla-block"}, 
                    React.createElement("header", null, 
                        React.createElement("h2", null, 
                            "The title for your stackla widget"
                        )
                    ), 
                    React.createElement("div", {className: (this.state.error) ? 'stackla-widget-section stackla-widget-error' : 'stackla-widget-section'}, 
                        React.createElement("fieldset", {className: "widget-title"}, 
                            React.createElement("input", {
                                type: "text", 
                                className: "widefat", 
                                defaultValue: this.state.value, 
                                onChange: this.handleChange}
                            )
                        )
                    ), 
                    React.createElement("div", {className: (this.state.error) ? 'stackla-error-message' : 'hide'}, 
                        React.createElement(this.state.dependencies.InputError, {errorMessage: this.state.error})
                    )
                )
            );
        }
    });
}(window));