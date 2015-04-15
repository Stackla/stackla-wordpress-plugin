(function(window)
{
    'use strict';

    window.stacklaWp.admin.components.WidgetFilters = React.createClass(
    {
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
                    <this.state.dependencies.Filter 
                        key={i}
                        id={i}
                        ref={i}
                    />
                );
            }

            return (
                <div className='stackla-widget-filters'>
                    <header>
                        <h2>Create Filters</h2>
                        <a href='#' className='button' onClick={this.add}>Add Filter</a>
                        <a href='#' className='button' onClick={this.remove}>Remove Filter</a>
                    </header>
                    {this.state.items}
                </div>
            );
        }
    });
}(window));