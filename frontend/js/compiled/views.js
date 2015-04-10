(function()
{
    'use strict';

    window.app.admin.stackla.views.StacklaWP = function()
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
                        StacklaWidgetTitle:app.admin.stackla.components.StacklaWidgetTitle,
                        StacklaTerm:app.admin.stackla.components.StacklaTerm
                    }
                }
            },
            render:function()
            {
                return (
                    React.createElement("div", {className: "react-template"}, 
                        React.createElement(this.state.dependencies.StacklaWidgetTitle, {
                            data: app.admin.stackla.existingData}
                        ), 
                        React.createElement("h2", null, "Create Terms"), 
                        React.createElement(this.state.dependencies.StacklaTerm, {
                            twitter: app.admin.stackla.config.network.twitter, 
                            facebook: app.admin.stackla.config.network.facebook, 
                            instagram: app.admin.stackla.config.network.instagram, 
                            youtube: app.admin.stackla.config.network.youtube}
                        )
                    )
                );
            }
        });

        React.render(React.createElement(View, null) , document.getElementById('stackla-metabox'));
    };
}());