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

            _.each(this.refs , function(item, index)
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
            var addMoreBtn;

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
                        onRemove={this.onRemoveFilter}
                        showRemove={(this.state.count - this.state.removed > 1) ? true : false}
                        readonly={this.props.readonly}
                    />
                );
            }

            if (!this.props.readonly) {
                addMoreBtn = (
                    <div className='add-wrap'>
                        <a href='#' className='button' onClick={this.add}>Add Filter</a>
                    </div>
                )
            }

            return (
                <div className='stackla-widget-filters'>
                    <header>
                        <h2>Create Filters</h2>
                    </header>
                    {this.state.items}
                    {addMoreBtn}
                </div>
            );
        }
    });
}(window));
