(function()
{
    'use strict';

    window.stacklaWp.admin.components.RequestError = React.createClass(
    {
        propTypes:
        {
        
        },
        getInitialState:function()
        {
            return {
                errorMessage:false
            }
        },
        render:function()
        {
            var $class = (this.state.errorMessage) ? 'stackla-error-message stackla-request-error' : 'hide';

            return (
                <div className={$class}>
                    <ul>
                        <li>
                            {this.state.errorMessage}
                        </li>
                    </ul>
                </div>
            );
        }
    });
}());