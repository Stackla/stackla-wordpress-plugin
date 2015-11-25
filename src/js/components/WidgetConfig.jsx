(function()
{
    'use strict';

    window.stacklaWp.admin.components.WidgetConfig = React.createClass(
    {
        propTypes: {
            initialData: React.PropTypes.oneOfType([React.PropTypes.object , React.PropTypes.bool]),
            showError: false,
            readonly: false
        },
        getInitialState: function() {
            return {
                id: (this.props.initialData !== false) ? this.props.initialData.id : '',
                copyId: (this.props.initialData !== false) ? this.props.initialData.copyId : '',
                type: (this.props.initialData !== false && this.props.initialData.id !== '') ? this.props.initialData.type : 'new',
                style: (this.props.initialData !== false) ? this.props.initialData.style : 'base_waterfall',
                displayStyles: (this.props.initialData !== false && this.props.initialData.type == 'derive') ? false : true,
                displayWidgets: false,
                types: {
                    'new': {
                        name: 'new',
                        label: 'New widget',
                        subtitle: 'Choose your widget type',
                        description: ''
                    },
                    'clone': {
                        name: 'clone',
                        label: 'Clone widget',
                        subtitle: 'Choose the existing widget to clone',
                        description: 'Ypur new widget will start witht he settings and styling of the widget you clone. Changes you make will only apply to this widget.'
                    },
                    'derive': {
                        name: 'derive',
                        label: 'Child widget',
                        subtitle: 'Choose a parent widget for this child',
                        description: 'Apply the styling and configuration of an existing widget to this child widget. Any changes you make to the parent widget will be reflected in this child.'
                    }
                },
                styles: [
                    {
                        name: 'base_waterfall',
                        label: 'Waterfall'
                    },
                    {
                        name: 'base_carousel',
                        label: 'Carousel'
                    },
                    {
                        name: 'base_billboard',
                        label: 'Billboard'
                    },
                    {
                        name: 'base_feed',
                        label: 'Feed'
                    },
                    {
                        name: 'base_slideshow',
                        label: 'Slideshow'
                    }
                ]
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
            var widgetStyle = [];
            var widgetOptions = [];
            var defaultWidgetStyle ;

            if (this.state.type) {
                widgetStyle.push(
                    <div>
                        <fieldset>
                            <label>
                                Step 2: {this.state.types[this.state.type].subtitle}
                            </label>
                        </fieldset>
                    </div>
                );

                if (this.state.type == 'new') {
                    defaultWidgetStyle = this.state.style ? this.state.style : this.state.styles[0].name;
                    widgetStyle.push(
                        <div ref='styles' className='stackla-widgetStyle-wrapper'>
                            {this.state.types[this.state.type].description}
                            <fieldset>
                                {
                                    this.state.styles.map(function(option , i) {
                                        return  <label key={i} className={"stackla-widgetStyle stackla-widgetStyle-" + option.name + (option.name == defaultWidgetStyle ? ' on' : '')}>
                                                    <input
                                                        type='radio'
                                                        ref={option.name}
                                                        name='style'
                                                        onChange={self.handleStyleChange}
                                                        value={option.name}
                                                        disabled={readonly}
                                                        defaultChecked={( option.name == defaultWidgetStyle )}
                                                    />
                                                    {option.label}
                                                </label>
                                    })
                                }
                            </fieldset>
                        </div>
                    );
                } else {
                    widgetStyle.push(
                        <div ref='widgets' className='widget-choices'>
                            <fieldset>
                                <select
                                    disabled={readonly}
                                    onChange={this.handleWidgetCopyChange}
                                    defaultValue={(this.props.initialData) ? this.props.initialData.copyId : ''}>
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
                    );
                }
            }

            var defaultWidgetType = this.state.type ? this.state.type : 'new';
            $.each(this.state.types, function(i) {
                var option = this;
                widgetOptions.push(
                <label className={'stackla-widgetType stackla-widgetType-'+option.name + (option.name == defaultWidgetType ? ' on' : '')} key={i} >
                    <input
                        ref={option.name}
                        type='radio'
                        value={option.name}
                        name='type'
                        onChange={self.handleTypeChange}
                        disabled={readonly}
                        defaultChecked={(option.name == defaultWidgetType)}
                    />
                    {option.label}
                </label>
                );
            })

            return (
                <div>
                    <div ref='types' className="stackla-widget-section">
                        <fieldset>
                            <label>
                                Step 1: Choose your starting point
                            </label>
                            <div className="stackla-widgetType-wrapper">
                                {widgetOptions}
                            </div>
                        </fieldset>
                    </div>
                    <div className={this.props.showError !== false ? 'stackla-widget-section stackla-widget-error' : 'stackla-widget-section'}>
                        {widgetStyle}
                    </div>
                    <div className={(this.props.showError) ? 'stackla-error-message' : 'hide'}>
                        <stacklaWp.admin.components.InputError errorMessage={this.props.showError} />
                    </div>
                </div>
            );
        }
    });
}());
