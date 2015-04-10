(function()
{
    'use strict';

    window.app.admin.stackla.components.StacklaTerm = React.createClass(
    {
        propTypes:
        {
            twitter:React.PropTypes.array,
            facebook:React.PropTypes.array,
            instagram:React.PropTypes.array,
            youtube:React.PropTypes.array
        },
        getInitialState:function()
        {
            return {
                data:[]
            }
        },
        handleNetworkChange:function(e)
        {

        },
        render:function()
        {
            return (
                <div className='term'>
                <label>
                    Choose a network
                </label>
                <select onChange={this.handleNetworkChange}>
                    <option value='twitter'>Twitter</option>
                    <option value='facebook'>Facebook</option>
                    <option value='instagram'>Instagram</option>
                    <option value='youtube'>YouTube</option>
                </select>
                <select className='twitter hide' ref='twitterOptions'>
                    {
                        this.props.twitter.map(function(option , i)
                        {
                            return <option key={i} value={option}>{option}</option>
                        })
                    }
                </select>
                <select className='facebook hide' ref='facebookOptions'>
                    {
                        this.props.facebook.map(function(option , i)
                        {
                            return <option key={i} value={option}>{option}</option>
                        })
                    }
                </select>
                <select className='instagram hide' ref='instagramOptions'>
                    {
                        this.props.instagram.map(function(option , i)
                        {
                            return <option key={i} value={option}>{option}</option>
                        })
                    }
                </select>
                <select className='youtube hide' ref='youtubeOptions'>
                    {
                        this.props.youtube.map(function(option , i)
                        {
                            return <option key={i} value={option}>{option}</option>
                        })
                    }
                </select>
                </div>
            );
        }
    });
}());