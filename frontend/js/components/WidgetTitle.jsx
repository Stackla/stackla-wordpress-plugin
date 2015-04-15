(function(window)
{
    'use strict';

    window.stacklaWp.admin.components.WidgetTitle = React.createClass(
    {
        propTypes:
        {
            initialTitle:React.PropTypes.string
        },
        getInitialState:function()
        {
            return {
                dependencies:
                {
                    InputError:stacklaWp.admin.components.InputError
                },
                value:this.props.initialTitle,
                error:false
            }
        },
        handleChange:function(e)
        {
            this.setState({value:e.target.value});
        },
        render:function()
        {
            return (
                <div className='stackla-block'>
                    <header>
                        <h2>
                            The title for your stackla widget
                        </h2>
                    </header>
                    <div className={(this.state.error) ? 'stackla-widget-section stackla-widget-error' : 'stackla-widget-section'}>
                        <fieldset className='widget-title'>
                            <input 
                                type='text' 
                                className='widefat' 
                                defaultValue={this.state.value}
                                onChange={this.handleChange}
                            />
                        </fieldset>
                    </div>
                    <div className={(this.state.error) ? 'stackla-error-message' : 'hide'}>
                        <this.state.dependencies.InputError errorMessage={this.state.error} />
                    </div>
                </div>
            );
        }
    });
}(window));