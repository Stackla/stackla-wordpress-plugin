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
                            Create Widget
                        </h2>
                    </header>
                    <this.state.dependencies.WidgetConfig
                        ref='config'
                        showError={this.state.error}
                        readonly={this.props.readonly}
                        initialData={stacklaWp.admin.metabox.data.widget}/>
                </div>
            );
        }
    });
}());
