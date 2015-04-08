(function()
{
    'use strict';

    window.stacklaWp.admin.components.WidgetConfig = React.createClass(
    {
        propTypes: {
            initialData: React.PropTypes.oneOfType([React.PropTypes.object , React.PropTypes.bool]),
            readonly: false
        },
        getInitialState: function() {
            return {
                id: (this.props.initialData !== false) ? this.props.initialData.id : '',
                copyId: (this.props.initialData !== false) ? this.props.initialData.copyId : '',
                type: (this.props.initialData !== false && this.props.initialData.id !== '') ? this.props.initialData.type : 'new',
                style: (this.props.initialData !== false) ? this.props.initialData.style : 'fluid',
                displayStyles: (this.props.initialData !== false && this.props.initialData.type == 'derive') ? false : true,
                displayWidgets: false,
                options: {
                    types: [
                        {
                            name: 'new',
                            label: 'Create a new Stackla Widget',
                            description: 'Create a completely new Widget instance from scratch.'
                        },
                        {
                            name: 'clone',
                            label: 'Copy an existing Stackla Widget',
                            description: 'Create a new widget, but use the settings from an existing widget. Changes made to this new widget will not affect the widget you are copying from, nor will changes to the widget you are copying from affect this new one.'
                        },
                        {
                            name: 'derive',
                            label: 'Reuse an existing Stackla Widget',
                            description: 'Use an existing widget as a base for the new one, but change the content that is displayed through it. Changes made to display settings of the existing widget will affect the display of this new one.'
                        }
                    ],
                    styles: [
                        {
                            name: 'fluid',
                            label: 'Fluid Vertical'
                        },
                        {
                            name: 'horizontal-fluid',
                            label: 'Fluid Horizontal'
                        }
                    ]
                },
                messages: {
                    'clone': 'Choose the widget you wish to copy',
                    'derive': 'Choose the widget you wish to reuse'
                }
            }
        },
        handleTypeChange: function(e) {
            var self = this;

            if (this.props.readonly) {
                return;
            }
            this.setState({
                type: e.target.value,
                copyId: ''
            });
        },
        handleWidgetCopyChange: function(e) {
            var self = this;

            if (this.props.readonly) {
                return;
            }
            this.setState({
                copyId: e.target.value
            })
        },
        handleStyleChange: function(e) {
            if (this.props.readonly) {
                return;
            }
            this.setState({style:e.target.value});
        },
        getDefaultChecked: function(option , key) {
            return (this.state[key] == option) ? true : false;
        },
        getDefaultSelected: function() {
            return (this.props.initialData) ? this.props.initialData.copyId : '';
        },
        setWidgetsDisplayState: function(type) {
            return (type == 'new' || this.state.id !== '') ? false : true;
        },
        setStyleDisplayState: function(type) {
            if (this.props.initialData !== false && this.props.initialData.type == 'derive') {
                return false;
            }
            return (type == 'derive') ? false : true;
        },
        render: function() {
            var self = this;

            var readonly = this.props.readonly;
            var widgetOptions = '';
            var widgetStyle = (
                <div ref='styles' className={'widget-styles'}>
                    <fieldset>
                        <label>
                            Choose your Stackla Widget Style
                        </label>
                        {
                            this.state.options.styles.map(function(option , i) {
                                return  <div key={i}>
                                            <input
                                                type='radio'
                                                ref={option.name}
                                                name='style'
                                                onChange={self.handleStyleChange}
                                                value={option.name}
                                                disabled={readonly}
                                                defaultChecked={self.getDefaultChecked(option.name , 'style')}
                                            />
                                            {option.label}
                                        </div>
                            })
                        }
                    </fieldset>
                </div>
            );
            var widgetList = (
                <div ref='widgets' className={'widget-choices'}>
                    <fieldset>
                        <label>
                            {(this.state.type !== 'new') ? this.state.messages[this.state.type] : ''}
                        </label>
                        <select
                            disabled={readonly}
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
            )
            var widgetOptions = [];
            this.state.options.types.map(function(option , i) {
                widgetOptions.push(
                <div className='widget-types' key={i} >
                    <input
                        ref={option.name}
                        type='radio'
                        value={option.name}
                        name='type'
                        onChange={self.handleTypeChange}
                        disabled={readonly}
                        defaultChecked={self.getDefaultChecked(option.name , 'type')}
                    />
                    {option.label}
                    <p>
                        {option.description}
                    </p>
                    <div className="widget-type-style">
                    {option.name == self.state.type && self.state.type !== 'new' ? widgetList : ''}
                    {option.name == self.state.type && self.state.type == 'new' ? widgetStyle : ''}
                    </div>
                </div>);
            })

            return (
                <div>
                    <div ref='types'>
                        <fieldset>
                            <label>
                                Choose your Stackla Widget Action
                            </label>
                            {widgetOptions}
                        </fieldset>
                    </div>
                </div>
            );
        }
    });
}());
