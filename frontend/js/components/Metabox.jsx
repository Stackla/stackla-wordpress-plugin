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

            $.ajax(
            {
                url:stacklaWp.admin.metabox.validator,
                type:'POST',
                dataType:'json',
                data:data
            }).done(function(response)
            {
                if(typeof response == 'object')
                {
                    self.handleErrors(response.errors);

                    if(response.result == '1')
                    {
                        //self.save(data);
                    }
                }
            }).fail(function(xhr , status , error)
            {
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
            $.ajax(
            {
                url:stacklaWp.admin.metabox.handler,
                type:'POST',
                //dataType:'json',
                data:data
            }).done(function(response)
            {
                console.log(response);
            }).fail(function(xhr , status , error)
            {
                //todo; create RequestError component to render these errors
                console.log('post fail!');
                console.log(error);
            });
        },
        render:function()
        {
            return (
                <div className='jsx-metabox'>
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
                    <a href='#' ref='saveMetabox' onClick={this.compileData}>Save</a>
                </div>
            );
        }
    });
}());