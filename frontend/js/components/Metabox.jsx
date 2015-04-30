(function()
{
    'use strict';

    var WP_SAVE_CONTROLLER;

    window.stacklaWp.admin.components.Metabox = React.createClass(
    {
        propTypes:
        {
        
        },
        getInitialState:function()
        {
            return {
                wpPublishSelector:"#publish",
                wpDraftSelector:'#save-post',
                wpFormSelector:'#post',
                wpFormTitleSelector:'#post #title',
                overlay:'#jsx-metabox .overlay',
                data:{},
                dependencies:
                {
                    RequestError:stacklaWp.admin.components.RequestError,
                    WidgetTitle:stacklaWp.admin.components.WidgetTitle,
                    WidgetTerms:stacklaWp.admin.components.WidgetTerms,
                    WidgetFilters:stacklaWp.admin.components.WidgetFilters,
                    Widget:stacklaWp.admin.components.Widget
                },
                errors:
                {
                    title:false,
                    terms:[],
                    filters:[]
                },
            }
        },
        /**
        *   React method that runs when the component is mounted to the DOM;
        *   @return void;
        */
        componentDidMount:function()
        {
            this.addSaveHook();
        },
        /**
        *   Applies the event catchers to the wp draft and publish buttons;
        *   @return void;
        */
        addSaveHook:function()
        {
            var self = this;
            var $metabox = $(stacklaWp.admin.config.wpMetabox);
            var $body = $('html, body');

            $('#save-post , #publish').one('click' , function(e)
            {
                e.preventDefault();

                WP_SAVE_CONTROLLER = $(e.target);

                $body.animate({scrollTop:$metabox.offset().top}, '500', 'swing', function() 
                { 
                    self.compileData();
                });
            });
        },
        /**
        *   Activates the ajax loader;
        *   @return void;
        */
        activateLoader:function()
        {
            $(React.findDOMNode(this.refs.overlay)).addClass('display');
        },
        /**
        *   Deactivates the ajax loader;
        *   @return void;
        */
        deactivateLoader:function()
        {
            $(React.findDOMNode(this.refs.overlay)).removeClass('display');
        },
        /**
        *   Compiles the data from the view to be posted to the db;
        *   @param {e} event object;
        *   @return void;
        */
        compileData:function()
        {
            //e.preventDefault();

            var termsRefs = this.refs.terms.refs;
            var filtersRefs = this.refs.filters.refs;
            var widgetConfig = $.extend({} , this.refs.widget.refs.config.state);
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
                'filters':filters,
                'widget':
                {
                    id:widgetConfig.id,
                    copyId:widgetConfig.copyId,
                    type:widgetConfig.type,
                    style:widgetConfig.style
                }
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
                        self.addSaveHook();
                    }
                }
            }).fail(function(xhr , status , error)
            {
                $node.removeClass('validating');
                self.addSaveHook();
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

            if($node.hasClass('saving')) return;

            self.activateLoader();
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

                self.deactivateLoader();
                $node.removeClass('saving');
                
                if(typeof response == 'object')
                {
                    if(response.result == '1')
                    {
                        if($title.val() == '')
                        {
                            $title.val(data.title)
                        }

                        WP_SAVE_CONTROLLER.trigger('click');
                    }
                    else
                    {
                        self.addSaveHook();
                        self.prepareErrors(response.errors);
                    }
                }
            }).fail(function(xhr , status , error)
            {
                $node.removeClass('saving');
                self.addSaveHook();
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
            var widgetErrors = (typeof errors.widget !== 'undefined') ? errors.widget : false;

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

            if(widgetErrors)
            {
                this.refs.widget.setState({error:errors.widget});
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
                    <div className='auth-notification prompt'>
                        <h3>
                            Authorisation Required
                        </h3>
                        <ul>
                            <li>
                                {"You're WordPress account is not authorised to use this plugin instance. "}
                                <a href={stacklaWp.admin.metabox.accessUri} onClick={this.setRedirectCookie}>
                                    {'Authorise with Stackla'}
                                </a>
                            </li>
                        </ul>
                    </div>
                )
            }

            return (
                <div className='jsx-metabox' ref='metabox'>
                    <div className='overlay' ref='overlay'>
                        <div className='loader' >
                            <div className='logo'>
                            <div className='message'> 
                                Stacking your widget, please wait ...
                            </div>
                            </div>
                            
                        </div>
                        
                    </div>
                    <this.state.dependencies.RequestError ref='requestErrors' errors={this.state.errors.request} />
                    <section className='title'>
                        <this.state.dependencies.WidgetTitle 
                            initialTitle={stacklaWp.admin.metabox.data.title}
                            ref='title'
                        />
                    </section>
                    <section className='terms'>
                        <this.state.dependencies.WidgetTerms ref='terms' initialData={stacklaWp.admin.metabox.data.terms} />
                    </section>
                    <section className='filters'>
                        <this.state.dependencies.WidgetFilters ref='filters' initialData={stacklaWp.admin.metabox.data.filters} />
                    </section>
                    <section className='config'>
                        <this.state.dependencies.Widget ref='widget' />
                    </section>

                </div>
            );
        }
    });
}());
