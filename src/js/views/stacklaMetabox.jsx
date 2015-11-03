(function(window)
{
    'use strict';

    window.stacklaWp.admin.views.stacklaMetabox = function()
    {
        var View = React.createClass(
        {
            propTypes:
            {
            
            },
            getInitialState:function()
            {
                return {
                    dependencies:
                    {
                        Metabox:stacklaWp.admin.components.Metabox,
                    }
                }
            },
            render:function()
            {
                return (
                    <div className='jsx-view'>
                        <this.state.dependencies.Metabox />
                    </div>
                );
            }
        });

        React.render(<View /> , document.getElementById(stacklaWp.admin.config.wpMetaboxId));
    };
}(window));