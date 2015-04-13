(function(window)
{
    'use strict';

    window.stacklaWp.admin.metabox.views.StacklaWP = function()
    {
        var View = React.createClass(
        {
            propTypes:
            {
            
            },
            getInitialState:function()
            {
                return {
                    dependencies:
                    {
                        StacklaWidgetTitle:stacklaWp.admin.metabox.components.StacklaWidgetTitle,
                        StacklaTerm:stacklaWp.admin.metabox.components.StacklaTerm,
                        StacklaFilter:stacklaWp.admin.metabox.components.StacklaFilter
                    }
                }
            },
            /**
            *   Calls the StacklaTerm component's addTerm method;
            *   @param {e} a JavaScript event object;
            *   @return void;
            */
            handleAddTerm:function(e)
            {
                e.preventDefault();
                this.refs.term.addTerm();
            },
            /**
            *   Calls the StacklaTerm component's removeTerm method;
            *   @param {e} a JavaScript event object;
            *   @return void;
            */
            handleRemoveTerm:function(e)
            {
                e.preventDefault();
                this.refs.term.removeTerm();
            },
            handleAddFilter:function(e)
            {
                e.preventDefault();
            },
            handleRemoveFilter:function(e)
            {
                e.preventDefault();
            },
            render:function()
            {
                return (
                    <div className='react-template'>
                        <this.state.dependencies.StacklaWidgetTitle 
                            data={stacklaWp.admin.metabox.existingData}  
                        />
                        <section className='terms'>
                            <header>
                                <h2>Create Terms</h2>
                                <a href='#' className='button' onClick={this.handleAddTerm}>Add Term</a>
                                <a href='#' className='button' onClick={this.handleRemoveTerm}>Remove Term</a>
                            </header>
                            <this.state.dependencies.StacklaTerm ref='term' />
                        </section>
                        <section className='filters'>
                            <header>
                                <h2>Create Filters</h2>
                                <a href='#' className='button' onClick={this.handleAddFilter}>Add Filter</a>
                                <a href='#' className='button' onClick={this.handleRemoveFilter}>Remove Filter</a>
                            </header>
                            <this.state.dependencies.StacklaFilter ref='filter' />
                        </section>
                    </div>
                );
            }
        });

        React.render(<View /> , document.getElementById('stackla-metabox'));
    };
}(window));