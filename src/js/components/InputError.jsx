(function()
{
    'use strict';

    window.stacklaWp.admin.components.InputError = React.createClass(
    {
        propTypes:
        {
            errorMessage:React.PropTypes.oneOfType([React.PropTypes.string , React.PropTypes.bool])
        },
        render:function()
        {
            return (
                <div className={this.props.errorMessage ? '' : 'hide'}>
                    {this.props.errorMessage}
                </div>
            );
        }
    });

}());