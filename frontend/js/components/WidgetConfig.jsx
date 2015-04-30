(function()
{
    'use strict';

    window.stacklaWp.admin.components.WidgetConfig = React.createClass(
    {
        propTypes:
        {
            initialData:React.PropTypes.oneOfType([React.PropTypes.object , React.PropTypes.bool])
        },
        getInitialState:function()
        {
            return {
                id:(this.props.initialData !== false) ? this.props.initialData.id : '',
                copyId:(this.props.initialData !== false) ? this.props.initialData.copyId : '',
                type:(this.props.initialData !== false) ? this.props.initialData.type : 'new',
                style:(this.props.initialData !== false) ? this.props.initialData.style : 'fluid',
                displayStyles:
                (this.props.initialData !== false && this.props.initialData.type == 'derive')
                ? false 
                : true,
                displayWidgets:
                (this.props.initialData !== false && this.props.initialData.type !== 'new')
                ? true
                : false,
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
                        'Create/Update a new/existing Stackla Widget',
                        'Copy an existing Stackla Widget',
                        'Reuse an existing Stackla Widget'
                    ],
                    styles:
                    [
                        'Fluid Vertical',
                        'Fluid Horizontal'
                    ]
                },
                descriptions:
                [
                    'Amet nisi duis magna integer in, parturient rhoncus mid a turpis adipiscing, sit pellentesque, pulvinar',
                    'Velit, et auctor. Lundium enim pulvinar nec parturient rhoncus a! Rhoncus platea dapibus vel duis parturient quis cras dis amet placerat risus adipiscing',
                    'Liquam elit, magna eu, magnis magna ultricies, mauris velit! Scelerisque turpis, a, risus! Dis, lorem ut a'
                ],
                messages:
                {
                    'clone': 'Choose the widget you wish to copy',
                    'derive': 'Choose the widget you wish to reuse'
                }
            }
        },
        handleTypeChange:function(e)
        {
            var self = this;

            this.setState(
            {
                type:e.target.value,
                copyId:'',
                displayStyles:self.setStyleDisplayState(e.target.value),
                displayWidgets:self.setWidgetsDisplayState(e.target.value)
            });
        },
        handleWidgetCopyChange:function(e)
        {
            var self = this;

            this.setState(
            {
                copyId:e.target.value
            })
        },
        handleStyleChange:function(e)
        {
            this.setState({style:e.target.value});
        },
        getDefaultChecked:function(option , key)
        {
            return (this.state[key] == option) ? true : false;
        },
        getDefaultSelected:function()
        { 
            return (this.props.initialData) ? this.props.initialData.copyId : '';
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
                        <fieldset>
                        <label>
                            Choose your Stackla Widget Type
                        </label>
                            {
                                this.state.options.types.map(function(option , i)
                                {
                                    return  <div className='widget-types' key={i}>
                                                <input 
                                                    ref={option}
                                                    type='radio' 
                                                    value={option} 
                                                    name='type'
                                                    onChange={self.handleTypeChange}
                                                    defaultChecked={self.getDefaultChecked(option , 'type')}
                                                />
                                                {self.state.labels.types[i]}
                                                <p>
                                                    {self.state.descriptions[i]}
                                                </p>
                                            </div>
                                })
                            }
                        </fieldset>
                    </div>
                    <div ref='widgets' className={(self.state.displayWidgets) ? 'widget-choices' : 'hide'}>
                        <fieldset>
                            <label>
                                {(this.state.type !== 'new') ? this.state.messages[this.state.type] : ''}
                            </label>
                            <select 
                                onChange={this.handleWidgetCopyChange} 
                                defaultValue={(this.props.initialData) ? this.props.initialData.copyId : ''}> 
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
                        </fieldset>
                    </div>
                    <div ref='styles' className={(self.state.displayStyles) ? 'widget-styles' : 'hide'}>
                        <fieldset>
                            <label>
                                Choose your Stackla Widget Style
                            </label>
                            {
                                this.state.options.styles.map(function(option , i)
                                {
                                    return  <div key={i}>
                                                <input 
                                                    type='radio'
                                                    ref={option}
                                                    name='style'
                                                    onChange={self.handleStyleChange}
                                                    value={option}
                                                    defaultChecked={self.getDefaultChecked(option , 'style')}
                                                />
                                                {self.state.labels.styles[i]}
                                            </div>
                                })
                            }
                        </fieldset>
                    </div>
                </div>
            );
        }
    });
}());