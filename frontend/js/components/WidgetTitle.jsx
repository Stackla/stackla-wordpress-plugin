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
                value:this.props.initialTitle
            }
        },
        handleChange:function(e)
        {
            this.setState({value:e.target.value});
        },
        render:function()
        {
            return (
                <fieldset>
                    <label>
                        The title for your stackla widget
                    </label>
                    <input 
                        type='text' 
                        className='widefat' 
                        defaultValue={this.state.value}
                        onChange={this.handleChange}
                    />
                </fieldset>
            );
        }
    });
}(window));