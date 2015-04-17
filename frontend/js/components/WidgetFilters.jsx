(function(window)
{
    'use strict';

    window.stacklaWp.admin.components.WidgetFilters = React.createClass(
    {
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
                    <this.state.dependencies.Filter 
                        key={i}
                        id={i}
                        ref={i}
                        data={fieldsetData}
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