(function(window)
{
    'use strict';

    window.stacklaWp.admin.views.stacklaMetabox = function()
    {
        var View = React.createClass(
        {displayName: "View",
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
                    React.createElement("div", {className: "jsx-view"}, 
                        React.createElement(this.state.dependencies.Metabox, null)
                    )
                );
            }
        });

        React.render(React.createElement(View, null) , document.getElementById(stacklaWp.admin.config.wpMetaboxId));
    };
}(window));