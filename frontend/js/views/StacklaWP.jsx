(function()
{
    'use strict';

    window.app.admin.stackla.views.StacklaWP = function()
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
                        StacklaWidgetTitle:app.admin.stackla.components.StacklaWidgetTitle,
                        StacklaTerm:app.admin.stackla.components.StacklaTerm
                    }
                }
            },
            render:function()
            {
                return (
                    <div className='react-template'>
                        <this.state.dependencies.StacklaWidgetTitle 
                            data={app.admin.stackla.existingData}  
                        />
                        <h2>Create Terms</h2>
                        <this.state.dependencies.StacklaTerm 
                            twitter={app.admin.stackla.config.network.twitter}
                            facebook={app.admin.stackla.config.network.facebook}
                            instagram={app.admin.stackla.config.network.instagram}
                            youtube={app.admin.stackla.config.network.youtube}
                        />
                    </div>
                );
            }
        });

        React.render(<View /> , document.getElementById('stackla-metabox'));
    };
}());