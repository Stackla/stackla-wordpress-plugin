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
                filters.push(state);
            });

            data =
            {
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
                url:stacklaWp.admin.metabox.handler,
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
        post:function(e)
        {
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
                        <this.state.dependencies.WidgetTerms ref='terms'/>
                    </section>
                    <section className='filters'>
                        <this.state.dependencies.WidgetFilters ref='filters'/>
                    </section>
                    <a href='#' onClick={this.compileData}>Save</a>
                </div>
            );
        }
    });
}());