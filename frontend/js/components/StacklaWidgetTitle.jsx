(function()
{
    'use strict';

    window.app.admin.stackla.components.StacklaWidgetTitle = React.createClass(
    {
        propTypes:
        {
            data:React.PropTypes.object
        },
        getInitialState:function()
        {
            return {
                data:[]
            }
        },
        render:function()
        {
            return (
                <fieldset>
                    <label>
                        The title for your stackla widget
                    </label>
                    <input type='text' className='widefat' name='stackla_wp_title' defaultValue={this.props.data.title}/>
                </fieldset>
            );
        }
    });
}());