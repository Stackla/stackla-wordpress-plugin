(function()
{
    'use strict';

    window.stacklaWp.admin.components.Metabox = React.createClass(
    {
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
        componentDidMount:function()
        {
            this.addPublishHook();
        },
        addPublishHook:function()
        {
            var self = this;
            var $metabox = $(stacklaWp.admin.config.wpMetabox);
            var $body = $('html, body');

            $(this.state.wpPublishSelector).one('click' , function(e)
            {
                e.preventDefault();

                $body.animate({scrollTop:$metabox.offset().top}, '500', 'swing', function() 
                { 
                   self.compileData();
                });
            });
        },
        compileData:function()
        {
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

                if(typeof response == 'object')
                {
                    console.log(response);

                    if(response.result == '1')
                    {
                        self.save(data);
                    }
                    else
                    {
                        self.handleFormErrors(response.errors);
                        self.addPublishHook();
                    }
                }
            }).fail(function(xhr , status , error)
            {
                $node.removeClass('validating');
                self.addPublishHook();
                self.handleRequestError(error);
            });
        },
        save:function(data)
        {
            var self = this;
            var $node = $(React.findDOMNode(this.refs.metabox));
            var $title = $(self.state.wpFormTitleSelector);
            var $publish = $(self.state.wpPublishSelector);

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
                $node.removeClass('saving');
                console.log(response);
                if(typeof response == 'object')
                {
                    if(response.result == '1')
                    {
                        if($title.val() == '')
                        {
                            $title.val(data.title)
                        }

                        $publish.trigger('click');
                    }
                    else
                    {
                        self.addPublishHook();
                        self.handleSdkErrors(response.errors);
                    }
                }
            }).fail(function(xhr , status , error)
            {
                $node.removeClass('saving');
                self.addPublishHook();
                self.handleRequestError(error);
            });
        },
        handleFormErrors:function(errors)
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
        handleSdkErrors:function(errors)
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
        handleRequestError:function(error)
        {
            console.log('request failed!');
            this.refs.requestErrors.setState(
            {
                errorMessage:error.toString()
            });
        },
        render:function()
        {
            return (
                <div className='jsx-metabox' ref='metabox'>
                    <this.state.dependencies.RequestError ref='requestErrors' errors={this.state.errors.request} />
                    <this.state.dependencies.WidgetTitle 
                        initialTitle={stacklaWp.admin.metabox.data.title}
                        ref='title'
                    />
                    <section className='terms'>
                        <this.state.dependencies.WidgetTerms ref='terms' initialData={stacklaWp.admin.metabox.data.terms} />
                    </section>
                    <section className='filters'>
                        <this.state.dependencies.WidgetFilters ref='filters' initialData={stacklaWp.admin.metabox.data.filters} />
                    </section>
                    <span className='spinner'>{'Stacking...'}</span>
                </div>
            );
        }
    });
}());

//<a href='#' className='wp-core-ui button button-primary' ref='saveMetabox' onClick={this.compileData}>Save</a>