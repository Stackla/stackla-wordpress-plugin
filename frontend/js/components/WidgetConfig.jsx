(function()
{
    'use strict';

    window.stacklaWp.admin.components.WidgetConfig = React.createClass(
    {
        propTypes:
        {
            initialData:React.PropTypes.object
        },
        getInitialState:function()
        {
            return {
                id:
                (typeof this.props.initialData !== 'undefined') 
                ? this.props.initialData.widgetId 
                : false,
                copyId:false,
                type:
                (typeof this.props.initialData !== 'undefined') 
                ? this.props.initialData.type 
                : 'new',
                style:
                (typeof this.props.initialData !== 'undefined') 
                ? this.props.initialData.style 
                : 'fluid',
                displayStyles:
                (typeof this.props.initialData !== 'undefined' && this.props.initialData.type == 'derive')
                ? false 
                : true,
                displayWidgets:false,
                options:
                {
                    types:
                    [
                        'new',
                        'clone',
                        'derive'
                    ],
                    styles:
                    [
                        'fluid',
                        'horizontal-fluid'
                    ]
                },
                labels:
                {
                    types:
                    [
                        'Create a new Stackla Widget',
                        'Copy an existing Stackla Widget',
                        'Reuse an existing Stackla Widget'
                    ],
                    styles:
                    [
                        'Fluid Vertical',
                        'Fluid Horizontal'
                    ]
                }
            }
        },
        handleTypeChange:function(e)
        {
            var self = this;

            this.setState(
            {
                type:e.target.value,
                displayStyles:self.setStyleDisplayState(e.target.value),
                displayWidgets:self.setWidgetsDisplayState(e.target.value)
            });
        },
        handleWidgetCopyChange:function(e)
        {
            var self = this;

            this.setState(
            {
                widgetCopyId:e.target.value
            })
        },
        getDefaultChecked:function(option , key)
        {
            return (this.state[key] == option) ? true : false;
        },
        setWidgetsDisplayState:function(type)
        {
            return (type == 'new') ? false : true;
        },
        setStyleDisplayState:function(type)
        {
            return (type == 'derive') ? false : true;
        },

        render:function()
        {
            var self = this;

            return (
                <div>
                    <div ref='types'>
                    {
                        this.state.options.types.map(function(option , i)
                        {
                            return  <fieldset key={i}>
                                        <input 
                                            ref={option}
                                            type='radio' 
                                            value={option} 
                                            name='type'
                                            onChange={self.handleTypeChange}
                                            defaultChecked={self.getDefaultChecked(option , 'type')}
                                        />
                                        {self.state.labels.types[i]}
                                    </fieldset>
                        })
                    }
                    </div>
                    <div ref='widgets' className={(self.state.displayWidgets) ? '' : 'hide'}>
                        <select onChange={this.handleWidgetCopyChange}> 
                            <option value=''></option>
                            {
                                Object.keys(stacklaWp.admin.metabox.widgets).map(function(key)
                                {
                                    return  <option value={key} key={key}>
                                                {stacklaWp.admin.metabox.widgets[key]}
                                            </option>
                                })
                            }
                        </select>
                    </div>
                    <div ref='styles' className={(self.state.displayStyles) ? '' : 'hide'}>
                    {
                        this.state.options.styles.map(function(option , i)
                        {
                            return  <fieldset key={i}>
                                        <input 
                                            type='radio'
                                            ref={option}
                                            name='style'
                                            onChange={self.handleStyleChange}
                                            defaultChecked={self.getDefaultChecked(option , 'style')}
                                        />
                                        {self.state.labels.styles[i]}
                                    </fieldset>
                        })
                    }
                    </div>
                </div>
            );
        }
    });
}());