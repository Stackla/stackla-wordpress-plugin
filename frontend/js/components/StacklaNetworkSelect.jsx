/*
    Beware all ye who enter; there's a bunch of hardcoded stuff in here
*/
(function(window)
{
    'use strict';

    window.stacklaWp.admin.metabox.components.StacklaNetworkSelect = React.createClass(
    {
        propTypes:
        {
            twitter:React.PropTypes.array,
            facebook:React.PropTypes.array,
            instagram:React.PropTypes.array,
            youtube:React.PropTypes.array,
            key:React.PropTypes.number
        },
        getInitialState:function()
        {
            return {
                data:[]
            }
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
        },
        /**
        *   Handles the user changed the network's rule option;
        *   @param {e} a JavaScript event object;
        *   @return void;
        */
        handleRuleChange:function(e)
        {
            var value = e.target.value;

            $(React.findDOMNode(this.refs.termValue)).find('fieldset').removeClass('display');

            $(React.findDOMNode(this.refs[value])).addClass('display')
        },
        render:function()
        {
            return (
                <div className='network-select' key={this.props.key}>
                    <fieldset className='term-name'>
                        <label>
                            Term name
                        </label>
                        <input type='text' className='widefat'/>
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
                        <select className='hide' ref='twitter' onChange={this.handleRuleChange}>
                            <option></option>
                            {
                                this.props.twitter.map(function(option , i)
                                {
                                    return <option key={i} value={'twitter-' + option}>{option}</option>
                                })
                            }
                        </select>
                        <select className='hide' ref='facebook' onChange={this.handleRuleChange}>
                            <option></option>
                            {
                                this.props.facebook.map(function(option , i)
                                {
                                    return <option key={i} value={'facebook-' + option}>{option}</option>
                                })
                            }
                        </select>
                        <select className='hide' ref='instagram' onChange={this.handleRuleChange}>
                            <option></option>
                            {
                                this.props.instagram.map(function(option , i)
                                {
                                    return <option key={i} value={'instagram-' + option}>{option}</option>
                                })
                            }
                        </select>
                        <select className='hide' ref='youtube' onChange={this.handleRuleChange}>
                            <option></option>
                            {
                                this.props.youtube.map(function(option , i)
                                {
                                    return <option key={i} value={'youtube-' + option}>{option}</option>
                                })
                            }
                        </select>
                    </fieldset>
                    <fieldset ref='termValue' className='rule-values'>
                        <fieldset ref='twitter-username' className='hide'>
                            <label>
                                Twitter Username
                            </label>
                            <span className='decorator'>
                                @
                            </span>
                            <input type='text' maxLength='15' ref='twitterUsernameInput'/>
                        </fieldset>
                        <fieldset ref='twitter-hashtag' className='hide'>
                            <label>
                                Twitter Hashtag
                            </label>
                            <span className='decorator'>
                                #
                            </span>
                            <input type='text' maxLength='129' ref='twitterHashtagInput'/>
                        </fieldset>
                        <fieldset ref='facebook-page' className='hide'>
                            <label>
                                Facebook Page URL or Facebook Page Name
                            </label>
                            <input type='text' ref='facebookPageInput'/>
                        </fieldset>
                        <fieldset ref='facebook-search' className='hide'>
                            <label>
                                Facebook Search (Search for all these words)
                            </label>
                            <input type='text' ref='facebookSearchInput'/>
                        </fieldset>
                        <fieldset ref='instagram-user' className='hide'>
                            <label>
                                Instagram User
                            </label>
                            <span className='decorator'>
                                @
                            </span>
                            <input type='text' ref='instagramUserInput'/>
                        </fieldset>
                        <fieldset ref='instagram-hashtag' className='hide'>
                            <label>
                                Instagram Hashtag
                            </label>
                            <span className='decorator'>
                                #
                            </span>
                            <input type='text' ref='instagramHashtagInput'/>
                        </fieldset>
                        <fieldset ref='youtube-user' className='hide'>
                            <label>
                                YouTube Username
                            </label>
                            <input type='text' ref='youtubeUserInput'/>
                        </fieldset>
                        <fieldset ref='youtube-search' className='hide'>
                            <label>
                                YouTube Search
                            </label>
                            <input type='text' ref='youtubeSearchInput'/>
                        </fieldset>
                    </fieldset>
                </div>
            );
        }
    });
}(window));