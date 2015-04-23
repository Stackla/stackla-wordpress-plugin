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
                    request:false,
                    title:false,
                    terms:[],
                    filters:[]
                }
            }
        },
        componentDidMount:function()
        {
            var self = this;
            var $metabox = $(stacklaWp.admin.config.wpMetabox);
            var $body = $('html, body');

            $(this.state.wpPublishSelector).on('click' , function(e)
            {
                e.preventDefault();
                $body.animate({scrollTop:$metabox.offset().top}, '500', 'swing', function() 
                { 
                   self.compileData();
                });
                
            });
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
        //compileData:function(e)
        compileData:function()
        {
            //e.preventDefault();
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
            console.log(data);
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
                    self.handleErrors(response.errors);
                    if(response.result == '1')
                    {
                        self.save(data);
                    }
                }
            }).fail(function(xhr , status , error)
            {
                $node.removeClass('validating');

                //todo; create RequestError component to render these errors
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
            var self = this;
            var $node = $(React.findDOMNode(this.refs.metabox));

            if($node.hasClass('saving')) return;

            $node.addClass('saving');

            $.ajax(
            {
                url:stacklaWp.admin.metabox.handler,
                type:'POST',
                //dataType:'json',
                data:data
            }).done(function(response)
            {
                $node.removeClass('saving');

                if(response == 'success')
                {
                    if($(self.state.wpFormTitleSelector).val() == '')
                    {
                        $(self.state.wpFormTitleSelector).val(data.title)
                    }

                    $(self.state.wpFormSelector).submit();
                }
            }).fail(function(xhr , status , error)
            {
                $node.removeClass('saving');
                //todo; create RequestError component to render these errors
                console.log('post fail!');
                console.log(error);
            });
        },
        render:function()
        {
            return (
                <div className='jsx-metabox' ref='metabox'>
                    <this.state.dependencies.WidgetTitle 
                        initialTitle={stacklaWp.admin.metabox.data.title}
                        ref='title'
                    />
                    <section className='terms'>
                        <this.state.dependencies.WidgetTerms ref='terms' initialData={stacklaWp.admin.metabox.data.terms}/>
                    </section>
                    <section className='filters'>
                        <this.state.dependencies.WidgetFilters ref='filters' initialData={stacklaWp.admin.metabox.data.filters}/>
                    </section>
                    <span className='spinner'>{'Stacking...'}</span>
                </div>
            );
        }
    });
}());

//<a href='#' className='wp-core-ui button button-primary' ref='saveMetabox' onClick={this.compileData}>Save</a>