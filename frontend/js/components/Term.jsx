/*
    Beware all ye who enter; there's a bunch of hardcoded stuff in here
*/
(function(window)
{
    'use strict';

    window.stacklaWp.admin.components.Term = React.createClass(
    {
        propTypes:
        {
            errors:React.PropTypes.oneOfType([React.PropTypes.object , React.PropTypes.bool]),
            twitter:React.PropTypes.array,
            facebook:React.PropTypes.array,
            instagram:React.PropTypes.array,
            youtube:React.PropTypes.array,
            id:React.PropTypes.number
        },
        getInitialState:function()
        {
            return {
                id:this.props.id,
                name:'',
                network:'',
                term:'',
                termValue:'',
                errors:false
            }
        },
        handleNameChange:function(e)
        {
            this.setState({name:e.target.value});
        },
        /**
        *   Handles the user changed the network option;
        *   @param {e} a JavaScript event object;
        *   @return void;
        */
        handleNetworkChange:function(e)
        {
            var value = e.target.value;

            $(React.findDOMNode(this.refs.termRules)).find('select').removeClass('display');
            $(React.findDOMNode(this.refs.termValue)).find('fieldset').removeClass('display');

            if(value == '')
            {
                $(React.findDOMNode(this.refs.termRulesLabel)).removeClass('display');
                $(React.findDOMNode(this.refs.termValue)).find('fieldset').removeClass('display');
            }
            else
            {
                $(React.findDOMNode(this.refs.termRulesLabel)).addClass('display');
                $(React.findDOMNode(this.refs[value])).addClass('display');
            }

            this.setState(
            {
                network:value,
                term:'',
                termValue:''
            });
        },
        /**
        *   Handles the user changed the network's term option;
        *   @param {e} a JavaScript event object;
        *   @return void;
        */
        handleTermChange:function(e)
        {
            var value = e.target.value;
            var split = value.split('-');

            $(React.findDOMNode(this.refs.termValue)).find('fieldset').removeClass('display');

            $(React.findDOMNode(this.refs[value])).addClass('display')

            this.setState(
            {
                term:split[1],
                termValue:''
            });
        },
        handleTermValueChange:function(e)
        {
            this.setState({termValue:e.target.value});
        },
        render:function()
        {
            return (
                <div className='stackla-block'>
                    <div className={(this.state.errors === false) ? 'stackla-widget-section' : 'stackla-widget-section stackla-widget-error'}>
                        <fieldset className='term-name'>
                            <label>
                                Term name
                            </label>
                            <input type='text' className='widefat' onChange={this.handleNameChange}/>
                        </fieldset>
                        <fieldset>
                            <label>
                                Choose a network
                            </label>
                            <select onChange={this.handleNetworkChange}>
                                <option></option>
                                <option value='twitter'>Twitter</option>
                                <option value='facebook'>Facebook</option>
                                <option value='instagram'>Instagram</option>
                                <option value='youtube'>YouTube</option>
                            </select>
                        </fieldset>
                        <fieldset ref='termRules'>
                            <label className='hide' ref='termRulesLabel'>
                                Choose a term
                            </label>
                            <select className='hide' ref='twitter' onChange={this.handleTermChange}>
                                <option></option>
                                {
                                    this.props.twitter.map(function(option , i)
                                    {
                                        return <option key={i} value={'twitter-' + option}>{option}</option>
                                    })
                                }
                            </select>
                            <select className='hide' ref='facebook' onChange={this.handleTermChange}>
                                <option></option>
                                {
                                    this.props.facebook.map(function(option , i)
                                    {
                                        return <option key={i} value={'facebook-' + option}>{option}</option>
                                    })
                                }
                            </select>
                            <select className='hide' ref='instagram' onChange={this.handleTermChange}>
                                <option></option>
                                {
                                    this.props.instagram.map(function(option , i)
                                    {
                                        return <option key={i} value={'instagram-' + option}>{option}</option>
                                    })
                                }
                            </select>
                            <select className='hide' ref='youtube' onChange={this.handleTermChange}>
                                <option></option>
                                {
                                    this.props.youtube.map(function(option , i)
                                    {
                                        return <option key={i} value={'youtube-' + option}>{option}</option>
                                    })
                                }
                            </select>
                        </fieldset>
                        <fieldset ref='termValue' className='term-values'>
                            <fieldset ref='twitter-username' className='hide'>
                                <label>
                                    Twitter Username
                                </label>
                                <span className='decorator'>
                                    @
                                </span>
                                <input type='text' maxLength='15' ref='twitterUsernameInput' onChange={this.handleTermValueChange}/>
                            </fieldset>
                            <fieldset ref='twitter-hashtag' className='hide'>
                                <label>
                                    Twitter Hashtag
                                </label>
                                <span className='decorator'>
                                    #
                                </span>
                                <input type='text' maxLength='129' ref='twitterHashtagInput' onChange={this.handleTermValueChange}/>
                            </fieldset>
                            <fieldset ref='facebook-page' className='hide'>
                                <label>
                                    Facebook Page URL or Facebook Page Name
                                </label>
                                <input type='text' ref='facebookPageInput' onChange={this.handleTermValueChange}/>
                            </fieldset>
                            <fieldset ref='facebook-search' className='hide'>
                                <label>
                                    Facebook Search (Search for all these words)
                                </label>
                                <input type='text' ref='facebookSearchInput' onChange={this.handleTermValueChange}/>
                            </fieldset>
                            <fieldset ref='instagram-user' className='hide'>
                                <label>
                                    Instagram User
                                </label>
                                <span className='decorator'>
                                    @
                                </span>
                                <input type='text' ref='instagramUserInput' onChange={this.handleTermValueChange}/>
                            </fieldset>
                            <fieldset ref='instagram-hashtag' className='hide'>
                                <label>
                                    Instagram Hashtag
                                </label>
                                <span className='decorator'>
                                    #
                                </span>
                                <input type='text' ref='instagramHashtagInput' onChange={this.handleTermValueChange}/>
                            </fieldset>
                            <fieldset ref='youtube-user' className='hide'>
                                <label>
                                    YouTube Username
                                </label>
                                <input type='text' ref='youtubeUserInput' onChange={this.handleTermValueChange}/>
                            </fieldset>
                            <fieldset ref='youtube-search' className='hide'>
                                <label>
                                    YouTube Search
                                </label>
                                <input type='text' ref='youtubeSearchInput' onChange={this.handleTermValueChange}/>
                            </fieldset>
                        </fieldset>
                    </div>
                    <div className={(this.state.errors === false) ? 'hide' : 'stackla-error-message'}>
                        <ul>
                            <li className={(this.state.errors.name) ? '' : 'hide'}>
                                {(this.state.errors.name) ? this.state.errors.name : ''}
                            </li>
                            <li className={(this.state.errors.network) ? '' : 'hide'}>
                                {(this.state.errors.network) ? this.state.errors.network : ''}
                            </li>
                            <li className={(this.state.errors.term) ? '' : 'hide'}>
                                {(this.state.errors.term) ? this.state.errors.term : ''}
                            </li>
                            <li className={(this.state.errors.termValue) ? '' : 'hide'}>
                                {(this.state.errors.termValue) ? this.state.errors.termValue : ''}
                            </li>
                        </ul>
                     </div>
                </div>
            );
        }
    });
}(window));