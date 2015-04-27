(function()
{
    'use strict';

    window.stacklaWp.admin.components.Filter = React.createClass(
    {displayName: "Filter",
        propTypes:
        {
            key:React.PropTypes.number,
            id:React.PropTypes.number,
            data:React.PropTypes.oneOfType([React.PropTypes.object , React.PropTypes.bool]),
            onRemove:React.PropTypes.func,
            showRemove:React.PropTypes.bool
        },
        /**
        *   Sets the initial state of the component;
        *   @return {this.state} the component's state object;
        */
        getInitialState:function()
        {
            return {
                id:this.props.id,
                name:(this.props.data) ? this.props.data.name : '',
                network:(this.props.data) ? this.props.data.network : stacklaWp.admin.config.networks,
                filterId:(typeof this.props.data.filterId !== 'undefined') ? this.props.data.filterId : '',
                media:(this.props.data) ? this.props.data.media : stacklaWp.admin.config.media,
                sorting:(this.props.data) ? this.props.data.sorting : 'latest',
                errors:false,
                edited:false,
                removed:false
            }
        },
        /**
        *   Handles the "removal" of a filter component;
        *   @param {e} event object;
        *   @return void;
        */
        handleRemoveFilter:function(e)
        {
            e.preventDefault();
            this.setState({removed:true , edited:true} , this.props.onRemove);
        },
        /**
        *   Handles the change event for the filter name input field;
        *   @param {e} event object;
        *   @return void;
        */
        handleNameChange:function(e)
        {
            this.setState({name:e.target.value , edited:true});
        },
        /**
        *   Handles the change events for the network checkboxes;
        *   @param {e} event object;
        *   @return void;
        */
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
                        network:copy,
                        edited:true
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
                        network:copy,
                        edited:true
                    });
                }
            }
        },
        /**
        *   Handles the change events for the media checkboxes;
        *   @param {e} event object;
        *   @return void;
        */
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
                        media:copy,
                        edited:true
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
                        media:copy,
                        edited:true
                    });
                }
            }
        },
        /**
        *   Handles the change event for the sorting select field;
        *   @param {e} event object;
        *   @return void;
        */
        handleSortingChange:function(e)
        {
            this.setState({sorting:e.target.value , edited:true});
        },
        /**
        *   Checks to see if an array value has been set;
        *   @param {key} the array key to look for;
        *   @param {value} the value to look for mapped to the key;
        *   @return void;
        */
        checkArrayValue:function(key , value)
        {
            if(!this.state[key].length) return false;

            if(this.state[key].indexOf(value) > -1)
            {
                return true;
            }
            return false;
        },
        /**
        *   Renders a filter component;
        *   @return React component;
        */
        render:function()
        {
            if(this.state.removed === true)
            {
                return (
                    React.createElement("div", null)
                );
            }

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
                                    value: "text", 
                                    defaultChecked: this.checkArrayValue('media' , 'text'), 
                                    onChange: this.handleMediaCheck}), 
                                React.createElement("label", {className: "checkbox"}, 
                                    "Text-only"
                                )
                            ), 
                            React.createElement("fieldset", null, 
                                React.createElement("input", {
                                    type: "checkbox", 
                                    value: "image", 
                                    defaultChecked: this.checkArrayValue('media' , 'image'), 
                                    onChange: this.handleMediaCheck}), 
                                React.createElement("label", {className: "checkbox"}, 
                                    "Images"
                                )
                            ), 
                            React.createElement("fieldset", null, 
                                React.createElement("input", {
                                    type: "checkbox", 
                                    value: "video", 
                                    defaultChecked: this.checkArrayValue('media' , 'video'), 
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
                         ), 
                         React.createElement("div", {className: (this.props.showRemove) ? '' : 'hide'}, 
                            React.createElement("a", {
                                className: "button remove-filter", 
                                onClick: this.handleRemoveFilter
                            }, 
                                "Remove ", React.createElement("b", null, this.state.name)
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
                            ), 
                            React.createElement("li", {className: (this.state.errors.sdk) ? '' : 'hide'}, 
                                (this.state.errors.sdk) ? this.state.errors.sdk : ''
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
                wpPublishSelector:"#publish",
                wpFormSelector:'#post',
                wpFormTitleSelector:'#post #title',
                data:{},
                dependencies:
                {
                    RequestError:stacklaWp.admin.components.RequestError,
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
        /**
        *   Compiles the data from the view to be posted to the db;
        *   @param {e} event object;
        *   @return void;
        */
        compileData:function(e)
        {
            e.preventDefault();

            var termsRefs = this.refs.terms.refs;
            var filtersRefs = this.refs.filters.refs;
            var terms = [];
            var filters = [];
            var data = {};

            $.each(termsRefs , function(key , value)
            {
                var state = $.extend({} , value.state); 
                terms.push(state);
            });

            $.each(filtersRefs , function(key , value)
            {
                var state = $.extend({} , value.state);
                if(!state.network.length) state.network = stacklaWp.admin.config.networks;
                if(!state.media.length) state.media = stacklaWp.admin.config.media;
                filters.push(state);
            });

            data =
            {
                'postId':stacklaWp.admin.metabox.postId,
                'title':this.refs.title.state.value,
                'terms':terms,
                'filters':filters
            };

            this.validate(data);
        },
        /**
        *   Validates the data from the view;
        *   @param {data} the compiled data from the view;
        *   @return void;
        */
        validate:function(data)
        {
            var self = this;
            var $node = $(React.findDOMNode(this.refs.metabox));

            if($node.hasClass('validating')) return;
            $node.addClass('validating');       

            $.ajax(
            {
                url:stacklaWp.admin.metabox.validator,
                type:'POST',
                dataType:'json',
                data:data
            }).done(function(response)
            {
                $node.removeClass('validating');

                console.log("VALIDATE response \n");
                console.log(response);

                if(typeof response == 'object')
                {
                    if(response.result == '1')
                    {
                        self.save(data);
                    }
                    else
                    {
                        self.prepareErrors(response.errors);
                    }
                }
            }).fail(function(xhr , status , error)
            {
                $node.removeClass('validating');
                self.handleRequestError(error);
            });
        },
        /**
        *   Attempts to save the entered data;
        *   The handler saves data to WordPress, then to Stackla and finally to WordPress once again
        *   @param {data} object containing the data to save;
        *   @return void;
        */
        save:function(data)
        {
            var self = this;
            var $node = $(React.findDOMNode(this.refs.metabox));
            var $title = $(self.state.wpFormTitleSelector);
            var $publish = $(self.state.wpPublishSelector);
            var $form = $(self.state.wpFormSelector);

            if($node.hasClass('saving')) return;

            $node.addClass('saving');

            $.ajax(
            {
                url:stacklaWp.admin.metabox.handler,
                type:'POST',
                dataType:'json',
                data:data
            }).done(function(response)
            {
                console.log("SAVE response \n");
                console.log(response);

                $node.removeClass('saving');
                
                if(typeof response == 'object')
                {
                    if(response.result == '1')
                    {
                        if($title.val() == '')
                        {
                            $title.val(data.title)
                        }

                        $form.submit();
                    }
                    else
                    {
                        self.prepareErrors(response.errors);
                    }
                }
            }).fail(function(xhr , status , error)
            {
                $node.removeClass('saving');
                self.handleRequestError(error);
            });
        },
        /**
        *   Checks to see if errors are defined and if so, funnels them;
        *   @param {errors} an object containing errors;
        *   @return void;
        */
        prepareErrors:function(errors)
        {
            var termsErrors = (typeof errors.terms !== 'undefined') ? errors.terms : false;
            var filtersErrors = (typeof errors.filters !== 'undefined') ? errors.filters : false;
            var titleErrors = (typeof errors.title !== 'undefined') ? errors.title : false;

            if(termsErrors)
            {
                this.funnelErrors(termsErrors , this.refs.terms.refs);
            }

            if(filtersErrors)
            {
                this.funnelErrors(filtersErrors , this.refs.filters.refs);
            }

            if(titleErrors)
            {
                this.refs.title.setState({error:errors.title});
            }
        },
        /**
        *   Funnels errors to their correct dom nodes;
        *   @param {errors} an errors object or array;
        *   @param {refs} the dom nodes to funnel the errors to;
        *   @return void;
        */
        funnelErrors:function(errors , refs)
        {
            if(!errors || typeof errors == 'undefined') return;

            if(typeof errors == 'object')
            {
                $.each(errors , function(index , item)
                {
                    refs[index].setState(
                    {
                        errors:errors[index]
                    })
                });
            }
            else if(typeof errors == 'array')
            {
                var length = errors.length;
                var i;

                for(i = 0 ; i < length ; i ++)
                {
                    refs[i].setState(
                    {
                        errors:errors[i]
                    });
                }
            }
        },
        /**
        *   Handles request failure errors;
        *   @param {error} the xhr error object;
        *   @return void;
        */
        handleRequestError:function(error)
        {
            console.log('request failed!');
            this.refs.requestErrors.setState(
            {
                errorMessage:error.toString()
            });
        },
        /**
        *   Sets a cookie referencing the current window location, the user will be redirected here after authorisation;
        *   @param {e} event object;
        *   @return void;
        */
        setRedirectCookie:function(e)
        {
            e.preventDefault();
            var $target = $(e.target);
            $.cookie(stacklaWp.admin.settings.config.redirectCookieKey , window.location.href);
            window.location = $target.attr('href');
            return;
        },
        /**
        *   Renders the Metabox component;
        *   @return React component;
        */
        render:function()
        {
            if(window.stacklaWp.admin.metabox.token === '' || window.stacklaWp.admin.metabox.token === false)
            {
                return (
                    React.createElement("div", {className: "auth-notification failure"}, 
                        React.createElement("p", null, 
                            "You're not authorised to use this plugin instance."
                        ), 
                        React.createElement("a", {href: stacklaWp.admin.metabox.accessUri, onClick: this.setRedirectCookie}, 
                            'Authorise with Stackla'
                        )
                    )
                )
            }

            return (
                React.createElement("div", {className: "jsx-metabox", ref: "metabox"}, 
                    React.createElement(this.state.dependencies.RequestError, {ref: "requestErrors", errors: this.state.errors.request}), 
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
                    React.createElement("a", {href: "#", className: "wp-core-ui button button-primary", ref: "saveMetabox", onClick: this.compileData}, "Save"), 
                    React.createElement("span", {className: "spinner"}, 'Stacking...')
                )
            );
        }
    });
}());

(function()
{
    'use strict';

    window.stacklaWp.admin.components.RequestError = React.createClass(
    {displayName: "RequestError",
        propTypes:
        {
        
        },
        getInitialState:function()
        {
            return {
                errorMessage:false
            }
        },
        render:function()
        {
            var $class = (this.state.errorMessage) ? 'stackla-error-message stackla-request-error' : 'hide';

            return (
                React.createElement("div", {className: $class}, 
                    React.createElement("ul", null, 
                        React.createElement("li", null, 
                            this.state.errorMessage
                        )
                    )
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
            editWidgetTermsData:React.PropTypes.func,
            errors:React.PropTypes.oneOfType([React.PropTypes.object , React.PropTypes.bool]),
            twitter:React.PropTypes.array,
            facebook:React.PropTypes.array,
            instagram:React.PropTypes.array,
            youtube:React.PropTypes.array,
            id:React.PropTypes.number,
            data:React.PropTypes.oneOfType([React.PropTypes.object , React.PropTypes.bool])
        },
        /**
        *   Sets the initial state of the component;
        *   @return {this.state} the component's state object;
        */
        getInitialState:function()
        {
            return {
                id:this.props.id,
                name:(this.props.data) ? this.props.data.name : '',
                network:(this.props.data) ? this.props.data.network : '',
                termId:(typeof this.props.data.termId !== 'undefined') ? this.props.data.termId : '',
                term:(this.props.data) ? this.props.data.term : '',
                termValue:(this.props.data) ? this.props.data.termValue : '',
                termDelimited:(this.props.data) ? this.props.data.network + '-' + this.props.data.term : '',
                errors:false,
                edited:false,
                removed:false
            }
        },
        /**
        *   Removes the term from the view and sets the removed flag on this.state;
        *   @param {e} event object;
        *   @return void;
        */
        handleRemoveTerm(e)
        {
            e.preventDefault();
            this.setState({removed:true , edited:true});
        },
        /**
        *   Handles the onChange event for the term name input field;
        *   @param {e} event object;
        *   @return void;
        */
        handleNameChange:function(e)
        {
            this.setState({name:e.target.value , edited:true});
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
                termValue:'',
                edited:true
            });
        },
        /**
        *   Handles the user changed the network's term option;
        *   @param {e} event object;
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
                termValue:'',
                edited:true
            });
        },
        /**
        *   Handles what happens when a term value is changed by the user;
        *   @param {e} event object;
        *   @return void;
        */
        handleTermValueChange:function(e)
        {
            this.setState({termValue:e.target.value , edited:true});
        },
        /**
        *   Matches the current network being rendered against what is in the state;
        *   @param {network} the current network in the render loop;
        *   @return boolean;
        */
        displayNetworkTermOptions:function(network)
        {
            if(this.state.network === '') return false;
            if(this.state.network == network) return true;
            return false;
        },
        checkTermSelected:function(termOptionsName , options)
        {
            if(this.state.term === '') return '';
            if(options.indexOf(this.state.term) > -1) return termOptionsName + '-' + this.state.term;
            return '';
        },
        checkTermValueOption:function(ref)
        {
            if(this.state.termDelimited === '') return false;
            if(this.state.termDelimited == ref) return true;
            return false;
        },
        getDefaultTermValue:function(delimited)
        {
            if(this.state.termDelimited === '') return '';
            if(this.state.termDelimited == delimited) return this.state.termValue;
            return '';
        },
        render:function()
        {
            var self = this;

            if(this.state.removed === true)
            {
                return (
                    React.createElement("div", null)
                );
            }

            return (
                React.createElement("div", {className: "stackla-block"}, 
                    React.createElement("div", {className: (this.state.errors === false) ? 'stackla-widget-section' : 'stackla-widget-section stackla-widget-error'}, 
                        React.createElement("fieldset", {className: "term-name"}, 
                            React.createElement("label", null, 
                                "Term name"
                            ), 
                            React.createElement("input", {type: "text", className: "widefat", ref: "termName", defaultValue: this.state.name, onChange: this.handleNameChange})
                        ), 
                        React.createElement("fieldset", null, 
                            React.createElement("label", null, 
                                "Choose a network"
                            ), 
                            React.createElement("div", {className: (this.state.network !== '') ? 'term-network-set' : 'hide'}, 
                                this.state.network
                            ), 
                            React.createElement("select", {
                                ref: "termNetwork", 
                                onChange: this.handleNetworkChange, 
                                className: (this.state.network !== '') ? 'hide' : '', 
                                defaultValue: this.state.network
                            }, 
                                React.createElement("option", {value: ""}), 
                                
                                    stacklaWp.admin.config.networks.map(function(network , i)
                                    {
                                        return React.createElement("option", {value: network, key: i}, network)
                                    })
                                
                            )
                        ), 
                        React.createElement("fieldset", {ref: "termRules"}, 
                            React.createElement("label", {className: (this.state.network === '') ? 'hide' : '', ref: "termRulesLabel"}, 
                                "Choose a type"
                            ), 
                            
                                stacklaWp.admin.config.networks.map(function(network , i)
                                {
                                    return  React.createElement("select", {
                                                className: (self.displayNetworkTermOptions(network)) ? '' : 'hide', 
                                                defaultValue: self.checkTermSelected(network , self.props[network]), 
                                                ref: network + i, 
                                                onClick: self.checkTermSet, 
                                                onChange: self.handleTermChange, 
                                                key: network + i
                                            }, 
                                                React.createElement("option", {value: ""}), 
                                                
                                                    self.props[network].map(function(option , j)
                                                    {
                                                        return  React.createElement("option", {
                                                                    key: option + j, 
                                                                    value: network + '-' + option
                                                                }, 
                                                                    option
                                                                )
                                                    })
                                                
                                            )
                                })
                            
                        ), 
                        React.createElement("fieldset", {ref: "termValue", className: "term-values"}, 
                            React.createElement("fieldset", {
                                ref: "twitter-user", 
                                className: (this.checkTermValueOption('twitter-user')) ? 'hide display' : 'hide'
                            }, 
                                React.createElement("label", null, 
                                    "Twitter Username"
                                ), 
                                React.createElement("span", {className: "decorator"}, 
                                    "@"
                                ), 
                                React.createElement("input", {
                                    type: "text", 
                                    defaultValue: this.getDefaultTermValue('twitter-user'), 
                                    ref: "twitter-user-value", 
                                    maxLength: "15", 
                                    onChange: this.handleTermValueChange})
                            ), 
                            React.createElement("fieldset", {
                                ref: "twitter-hashtag", 
                                className: (this.checkTermValueOption('twitter-hashtag')) ? 'hide display' : 'hide'
                            }, 
                                React.createElement("label", null, 
                                    "Twitter Hashtag"
                                ), 
                                React.createElement("span", {className: "decorator"}, 
                                    "#"
                                ), 
                                React.createElement("input", {
                                    type: "text", 
                                    maxLength: "129", 
                                    defaultValue: this.getDefaultTermValue('twitter-hashtag'), 
                                    ref: "twitter-hashtag-value", 
                                    onChange: this.handleTermValueChange}
                                )
                            ), 
                            React.createElement("fieldset", {
                                ref: "facebook-page", 
                                className: (this.checkTermValueOption('facebook-page')) ? 'hide display' : 'hide'
                            }, 
                                React.createElement("label", null, 
                                    "Facebook Page URL or Facebook Page Name"
                                ), 
                                React.createElement("input", {
                                    type: "text", 
                                    defaultValue: this.getDefaultTermValue('facebook-page'), 
                                    ref: "facebook-page-value", 
                                    onChange: this.handleTermValueChange}
                                )
                            ), 
                            React.createElement("fieldset", {
                                ref: "facebook-search", 
                                className: (this.checkTermValueOption('facebook-search')) ? 'hide display' : 'hide'
                            }, 
                                React.createElement("label", null, 
                                    "Facebook Search (Search for all these words)"
                                ), 
                                React.createElement("input", {
                                    type: "text", 
                                    defaultValue: this.getDefaultTermValue('facebook-search'), 
                                    ref: "facebook-search-value", 
                                    onChange: this.handleTermValueChange})
                            ), 
                            React.createElement("fieldset", {
                                ref: "instagram-user", 
                                className: (this.checkTermValueOption('instagram-user')) ? 'hide display' : 'hide'
                            }, 
                                React.createElement("label", null, 
                                    "Instagram User"
                                ), 
                                React.createElement("span", {className: "decorator"}, 
                                    "@"
                                ), 
                                React.createElement("input", {
                                    type: "text", 
                                    defaultValue: this.getDefaultTermValue('instagram-user'), 
                                    ref: "instagram-user-value", 
                                    onChange: this.handleTermValueChange}
                                )
                            ), 
                            React.createElement("fieldset", {
                                ref: "instagram-hashtag", 
                                className: (this.checkTermValueOption('instagram-hashtag')) ? 'hide display' : 'hide'
                            }, 
                                React.createElement("label", null, 
                                    "Instagram Hashtag"
                                ), 
                                React.createElement("span", {className: "decorator"}, 
                                    "#"
                                ), 
                                React.createElement("input", {
                                    type: "text", 
                                    defaultValue: this.getDefaultTermValue('instagram-hashtag'), 
                                    ref: "instagram-hashtag-value", 
                                    onChange: this.handleTermValueChange})
                            ), 
                            React.createElement("fieldset", {
                                ref: "youtube-user", 
                                className: (this.checkTermValueOption('youtube-user')) ? 'hide display' : 'hide'
                            }, 
                                React.createElement("label", null, 
                                    "YouTube Username"
                                ), 
                                React.createElement("input", {
                                    type: "text", 
                                    defaultValue: this.getDefaultTermValue('youtube-user'), 
                                    ref: "youtube-user-value", 
                                    onChange: this.handleTermValueChange}
                                )
                            ), 
                            React.createElement("fieldset", {
                                ref: "youtube-search", 
                                className: (this.checkTermValueOption('youtube-search')) ? 'hide display' : 'hide'
                            }, 
                                React.createElement("label", null, 
                                    "YouTube Search"
                                ), 
                                React.createElement("input", {
                                    type: "text", 
                                    defaultValue: this.getDefaultTermValue('youtube-search'), 
                                    ref: "youtube-search-value", 
                                    onChange: this.handleTermValueChange}
                                )
                            )
                        ), 
                        React.createElement("div", null, 
                            React.createElement("a", {
                                className: "button remove-term", 
                                onClick: this.handleRemoveTerm
                            }, 
                                "Remove ", React.createElement("b", null, this.state.name)
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
                            ), 
                            React.createElement("li", {className: (this.state.errors.sdk) ? '' : 'hide'}, 
                                (this.state.errors.sdk) ? this.state.errors.sdk : ''
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
                count:(this.props.initialData.length) ? this.props.initialData.length : 1,
                data:(this.props.initialData.length) ? this.props.initialData : [],
                items:[],
                removed:0
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
        onRemoveFilter:function()
        {
            var removed = 0;

            $.each(this.refs , function(index , item)
            {
                if(item.state && item.state.removed === true)
                {
                    removed ++;
                }
            });

            this.setState(
            {
                items:[],
                removed:removed
            });
        },
        /**
        *   Renders the component;
        *   @note do NOT add refs to anything other than the items;
        *   @return {html};
        */
        render:function()
        {            
            var i;
            
            for(i = 0 ; i < this.state.count ; i ++)
            {
                var fieldsetData = false;

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
                        data: fieldsetData, 
                        onRemove: this.onRemoveFilter, 
                        showRemove: (this.state.count - this.state.removed > 1) ? true : false}
                    )
                );
            }

            return (
                React.createElement("div", {className: "stackla-widget-filters"}, 
                    React.createElement("header", null, 
                        React.createElement("h2", null, "Create Filters"), 
                        React.createElement("a", {href: "#", className: "button", onClick: this.add}, "Add Filter")
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
        *   Loops through the count, pushes Term components to the items array;
        *   Renders these components;
        *   @return void;
        */
        render:function()
        {
            var i;

            for(i = 0 ; i < this.state.count ; i++)
            {
                var fieldsetData = false;

                if(this.state.data.length)
                {
                    if(typeof this.state.data[i] !== 'undefined')
                    {
                        fieldsetData = this.state.data[i];
                    }
                }

                this.state.items.push(
                    React.createElement(this.state.dependencies.Term, {
                        editWidgetTermsData: this.editTermsData, 
                        twitter: stacklaWp.admin.config.network.twitter, 
                        facebook: stacklaWp.admin.config.network.facebook, 
                        instagram: stacklaWp.admin.config.network.instagram, 
                        youtube: stacklaWp.admin.config.network.youtube, 
                        key: i, 
                        id: i, 
                        ref: i, 
                        data: fieldsetData}
                    )
                );
            }

            return (
                React.createElement("div", {className: "stackla-widget-terms"}, 
                    React.createElement("header", null, 
                        React.createElement("h2", null, "Create Terms"), 
                        React.createElement("a", {href: "#", className: "button", onClick: this.addTerm}, "Add Term")
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