(function()
{
    'use strict';

    window.stacklaWp.admin.components.Widget = React.createClass(
    {
        propTypes:
        {

        },
        getInitialState:function()
        {
            return {
                dependencies:
                {
                    WidgetConfig:stacklaWp.admin.components.WidgetConfig,
                    InputError:stacklaWp.admin.components.InputError
                },
                error:false
            }
        },
        render:function()
        {
            var self = this;

            return (
                <div className='stackla-block'>
                    <header>
                        <h2>
                            Look and Feel
                        </h2>
                    </header>
                    <div className={(this.state.error) ? 'stackla-widget-section stackla-widget-error' : 'stackla-widget-section'}>
                        <this.state.dependencies.WidgetConfig
                            ref='config'
                            readonly={this.props.readonly}
                            initialData={stacklaWp.admin.metabox.data.widget}
                        />
                    </div>
                    <div className={(this.state.error) ? 'stackla-error-message' : 'hide'}>
                        <this.state.dependencies.InputError errorMessage={this.state.error} />
                    </div>
                </div>
            );
        }
    });
}());
