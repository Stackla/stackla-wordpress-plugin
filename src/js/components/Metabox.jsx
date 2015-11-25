(function()
{
    'use strict';

    var WP_SAVE_CONTROLLER;

    function arr_diff (a1, a2) {

        var a = [], diff = [];

        for (var i = 0; i < a1.length; i++) {
            a[a1[i]] = true;
        }

        for (var i = 0; i < a2.length; i++) {
            if (a[a2[i]]) {
                delete a[a2[i]];
            } else {
                a[a2[i]] = true;
            }
        }

        for (var k in a) {
            diff.push(k);
        }

        return diff;
    };

    window.stacklaWp.admin.components.Metabox = React.createClass(
    {
        propTypes:
        {

        },
        getInitialState:function()
        {
            var data = stacklaWp.admin && stacklaWp.admin.metabox && stacklaWp.admin.metabox.data ? stacklaWp.admin.metabox.data : {},
                mediaType= data.media_type && typeof data.media_type == 'object' ? data.media_type : ['text', 'image', 'video', 'html'];

            return {
                wpPublishSelector:"#publish",
                wpDraftSelector:'#save-post',
                wpFormSelector:'#post',
                wpFormTitleSelector:'#post #title',
                overlay:'#jsx-metabox .overlay',
                data: data,
                mediaType: mediaType,
                dependencies: {
                    RequestError:stacklaWp.admin.components.RequestError,
                    WidgetTitle:stacklaWp.admin.components.WidgetTitle,
                    WidgetTerms:stacklaWp.admin.components.WidgetTerms,
                    Widget:stacklaWp.admin.components.Widget
                },
                errors:
                {
                    title:false,
                    terms:[],
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

            if(window.stacklaWp.admin.metabox.token === '' || window.stacklaWp.admin.metabox.token === false) {
            } else {
                $('#save-post , #publish').one('click' , function(e) {
                    e.preventDefault();

                    WP_SAVE_CONTROLLER = $(e.target);

                    $body.animate({scrollTop:$metabox.offset().top}, '500', 'swing', function()
                    {
                        self.compileData();
                    });
                });
            }
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
            var widgetConfig = $.extend({} , this.refs.widget.refs.config.state);
            var terms = [];
            var data = {};

            $.each(termsRefs , function(key , value) {
                var state = $.extend({} , value.state);
                terms.push(state);
            });

            data = {
                'postId': stacklaWp.admin.metabox.postId,
                'terms': terms,
                'widget': {
                    id: widgetConfig.id,
                    copyId: widgetConfig.copyId,
                    type: widgetConfig.type,
                    style: widgetConfig.style
                },
                'media_type': this.state.mediaType
            };

            // console.log('Previous Data', this.state.data);
            // console.log('Current Data', data);

            // return;

            this.validate(data);
        },
        /**
        *   Validates the data from the view;
        *   @param {data} the compiled data from the view;
        *   @return void;
        */
        validate: function(data) {
            var self = this;
            var $node = $(React.findDOMNode(this.refs.metabox));

            if($node.hasClass('validating')) return;
            $node.addClass('validating');

            $.ajax({
                url: stacklaWp.admin.metabox.validator,
                type:'POST',
                dataType:'json',
                data:data
            }).done(function(response) {
                $node.removeClass('validating');

                if (typeof response == 'object') {
                    if (response.result == '1') {
                        self.save(data);
                    } else {
                        self.prepareErrors(response.errors);
                        self.addSaveHook();
                    }
                }
            }).fail(function(xhr , status , error) {
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
        save: function(data) {
            var self = this;
            var $node = $(React.findDOMNode(this.refs.metabox));
            var $title = $(self.state.wpFormTitleSelector);

            if($node.hasClass('saving')) return;

            if(window.stacklaWp.admin.metabox.token === '' || window.stacklaWp.admin.metabox.token === false) {
            } else {
                self.activateLoader();
                $node.addClass('saving');

                $.ajax({
                    url:stacklaWp.admin.metabox.handler,
                    type:'POST',
                    dataType:'json',
                    data:data
                }).done(function(response) {
                    self.deactivateLoader();
                    $node.removeClass('saving');

                    if (typeof response == 'object') {
                        if (response.result == '1') {
                            if ($title.val() == '') {
                                $title.val(data.title)
                            }

                            var keyId, valId;
                            if (response.data) {
                                for (var key in response.data) {
                                    if ($('input[value='+key+']').length) {
                                        keyId = $('input[value='+key+']').attr('id');
                                        valId = keyId.replace(/\-key$/,'-value');
                                        $('#'+valId).val(response.data[key]);
                                    } else {
                                        console.log('notexist', key);
                                    }
                                }
                            }
                            WP_SAVE_CONTROLLER.trigger('click');
                        } else {
                            self.addSaveHook();
                            self.prepareErrors(response.errors);
                        }
                    }
                }).fail(function(xhr , status , error) {
                    $node.removeClass('saving');
                    self.addSaveHook();
                    self.handleRequestError(error);
                });
            }
        },
        /**
        *   Checks to see if errors are defined and if so, funnels them;
        *   @param {errors} an object containing errors;
        *   @return void;
        */
        prepareErrors: function(errors) {
            var termsErrors = (typeof errors.terms !== 'undefined') ? errors.terms : false;
            var mediaTypeErrors = (typeof errors.media_type!== 'undefined') ? errors.media_type: false;
            var titleErrors = (typeof errors.title !== 'undefined') ? errors.title : false;
            var widgetErrors = (typeof errors.widget !== 'undefined') ? errors.widget : false;

            if (termsErrors) {
                this.funnelErrors(termsErrors , this.refs.terms.refs);
            }

            if (titleErrors) {
                this.refs.title.setState({error:errors.title});
            }

            if (mediaTypeErrors) {
                this.setState({mediaTypeError:errors.title});
            }

            if (widgetErrors) {
                this.refs.widget.setState({error:errors.widget});
            }
        },
        /**
        *   Funnels errors to their correct dom nodes;
        *   @param {errors} an errors object or array;
        *   @param {refs} the dom nodes to funnel the errors to;
        *   @return void;
        */
        funnelErrors: function(errors , refs) {
            if(!errors || typeof errors == 'undefined') return;

            if(typeof errors == 'object') {
                $.each(errors , function(index , item) {
                    refs[index].setState({
                        errors:errors[index]
                    })
                });
            } else if(typeof errors == 'array') {
                var length = errors.length;
                var i;

                for(i = 0 ; i < length ; i ++) {
                    refs[i].setState({
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
        handleFilterChange: function(e) {
            var target = $(e.currentTarget);
            var diff = [];

            diff = arr_diff([target.val()], this.state.mediaType.length ? this.state.mediaType: []);
            this.setState({'mediaType' : diff});
        },
        /**
        *   Renders the Metabox component;
        *   @return React component;
        */
        render:function() {
            var that = this;
            var authentication, authenticated = true, widget;

            if(window.stacklaWp.admin.metabox.token === '' || window.stacklaWp.admin.metabox.token === false) {
                authenticated = false;
                authentication = (
                    <div className='auth-notification prompt'>
                        <h3>
                            Authorization Required
                        </h3>
                        <ul>
                            <li>
                                {"Your WordPress account is not authorized to use this plugin instance. "}
                                <a href={stacklaWp.admin.metabox.accessUri} onClick={this.setRedirectCookie}>
                                    {'Authorize with Stackla'}
                                </a>
                            </li>
                        </ul>
                    </div>
                )
            }
            var readonly = authenticated ? false : true;

            var defaultFilterOptions = [{value: 'text', name: 'Text'}, {value: 'image', name: 'Image'}, {value: 'video', name: 'Video'}, {value: 'html', name: 'HTML'}].map(function(option, i) {

                var checked = false;

                if (that.state.mediaType.indexOf(option.value) > -1) {
                    checked = true;
                }

                return (
                    <fieldset>
                        <label className='checkbox'>
                            <input
                                type='checkbox'
                                value={option.value}
                                checked={checked}
                                disabled={readonly}
                                onChange={that.handleFilterChange}/>
                            {option.name}
                        </label>
                    </fieldset>
                );
            });

            var defaultFilter = (
                <div ref="filter" className='stackla-filter'>
                    <header>
                        <h2>Media types</h2>
                    </header>
                    <div className='stackla-block'>
                        <div className='stackla-widget-section'>
                            {defaultFilterOptions}
                        </div>
                    </div>
                </div>
            );

            if (authenticated || this.state.data.terms) {
                widget = (
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
                        <section className='terms'>
                            <this.state.dependencies.WidgetTerms ref='terms' initialData={this.state.data.terms} readonly={authenticated ? false : true} />
                        </section>
                        <section>
                            {defaultFilter}
                        </section>
                        <section className='config'>
                            <this.state.dependencies.Widget ref='widget' readonly={authenticated ? false : true} />
                        </section>
                    </div>
                )
            }

            return (
                <div>
                    {authentication}
                    {widget}
                </div>
            );
        }
    });
}());
