/*
    Beware all ye who enter; there's a bunch of hardcoded stuff in here
*/
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
            id:React.PropTypes.number,
            data:React.PropTypes.oneOfType([React.PropTypes.object , React.PropTypes.bool])
        },
        getInitialState:function()
        {
            return {
                id:this.props.id,
                name:(this.props.data) ? this.props.data.name : '',
                network:(this.props.data) ? this.props.data.network : '',
                term:(this.props.data) ? this.props.data.term : '',
                termValue:(this.props.data) ? this.props.data.termValue : '',
                termDelimited:(this.props.data) ? this.props.data.network + '-' + this.props.data.term : '',
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
        displayNetworkTermOptions:function(network)
        {
            if(this.state.network === '') return false;
            if(this.state.network == network) return true;
            return false;
        },
        checkTermSelected:function(termOptionsName , options)
        {
            if(this.state.term === '') return '';
            if(options.indexOf(this.state.term) > -1) return termOptionsName + '-' + this.state.term;
            return '';
        },
        checkTermValueOption:function(ref)
        {
            if(this.state.termDelimited === '') return false;
            if(this.state.termDelimited == ref) return true;
            return false;
        },
        getDefaultTermValue:function(delimited)
        {
            if(this.state.termDelimited === '') return '';
            if(this.state.termDelimited == delimited) return this.state.termValue;
            return '';
        },
        render:function()
        {
            var self = this;
            console.log(this.state);
            return (
                <div className='stackla-block'>
                    <div className={(this.state.errors === false) ? 'stackla-widget-section' : 'stackla-widget-section stackla-widget-error'}>
                        <fieldset className='term-name'>
                            <label>
                                Term name
                            </label>
                            <input type='text' className='widefat' defaultValue={this.state.name} onChange={this.handleNameChange}/>
                        </fieldset>
                        <fieldset>
                            <label>
                                Choose a network
                            </label>
                            <select onChange={this.handleNetworkChange} defaultValue={this.state.network}>
                                <option value=''></option>
                                {
                                    stacklaWp.admin.config.networks.map(function(network , i)
                                    {
                                        return <option value={network} key={i}>{network}</option>
                                    })
                                }
                            </select>
                        </fieldset>
                        <fieldset ref='termRules'>
                            <label className={(this.state.network === '') ? 'hide' : ''} ref='termRulesLabel'>
                                Choose a term
                            </label>
                            {
                                stacklaWp.admin.config.networks.map(function(network , i)
                                {
                                    return  <select 
                                                className={(self.displayNetworkTermOptions(network)) ? '' : 'hide'} 
                                                defaultValue={self.checkTermSelected(network , self.props[network])} 
                                                ref={network} 
                                                onChange={self.handleTermChange}
                                                key={network + i}
                                            >
                                                <option value=''></option>
                                                {
                                                    self.props[network].map(function(option , j)
                                                    {
                                                        return  <option
                                                                    key={option + j}
                                                                    value={network + '-' + option}
                                                                >
                                                                    {option}
                                                                </option>
                                                    })
                                                }
                                            </select>
                                })
                            }
                        </fieldset>
                        <fieldset ref='termValue' className='term-values'>
                            <fieldset 
                                ref='twitter-username' 
                                className={(this.checkTermValueOption('twitter-username')) ? 'hide display' : 'hide'}
                            >
                                <label>
                                    Twitter Username
                                </label>
                                <span className='decorator'>
                                    @
                                </span>
                                <input 
                                    type='text' 
                                    defaultValue={this.getDefaultTermValue('twitter-username')}
                                    maxLength='15' 
                                    onChange={this.handleTermValueChange}/>
                            </fieldset>
                            <fieldset 
                                ref='twitter-hashtag' 
                                className={(this.checkTermValueOption('twitter-hashtag')) ? 'hide display' : 'hide'}
                            >
                                <label>
                                    Twitter Hashtag
                                </label>
                                <span className='decorator'>
                                    #
                                </span>
                                <input 
                                    type='text'
                                    maxLength='129'
                                    defaultValue={this.getDefaultTermValue('twitter-hastag')}
                                    onChange={this.handleTermValueChange}
                                />
                            </fieldset>
                            <fieldset 
                                ref='facebook-page' 
                                className={(this.checkTermValueOption('facebook-page')) ? 'hide display' : 'hide'}
                            >
                                <label>
                                    Facebook Page URL or Facebook Page Name
                                </label>
                                <input 
                                    type='text'
                                    defaultValue={this.getDefaultTermValue('facebook-page')}
                                    onChange={this.handleTermValueChange}
                                />
                            </fieldset>
                            <fieldset 
                                ref='facebook-search'
                                className={(this.checkTermValueOption('facebook-search')) ? 'hide display' : 'hide'}
                            >
                                <label>
                                    Facebook Search (Search for all these words)
                                </label>
                                <input 
                                    type='text'
                                    defaultValue={this.getDefaultTermValue('facebook-search')}
                                    onChange={this.handleTermValueChange}/>
                            </fieldset>
                            <fieldset 
                                ref='instagram-user' 
                                className={(this.checkTermValueOption('instagram-user')) ? 'hide display' : 'hide'}
                            >
                                <label>
                                    Instagram User
                                </label>
                                <span className='decorator'>
                                    @
                                </span>
                                <input 
                                    type='text'
                                    defaultValue={this.getDefaultTermValue('instagram-user')}
                                    onChange={this.handleTermValueChange}
                                />
                            </fieldset>
                            <fieldset 
                                ref='instagram-hashtag' 
                                className={(this.checkTermValueOption('instagram-hashtag')) ? 'hide display' : 'hide'}
                            >
                                <label>
                                    Instagram Hashtag
                                </label>
                                <span className='decorator'>
                                    #
                                </span>
                                <input 
                                    type='text'
                                    defaultValue={this.getDefaultTermValue('instagram-hashtag')}
                                    onChange={this.handleTermValueChange}/>
                            </fieldset>
                            <fieldset 
                                ref='youtube-user' 
                                className={(this.checkTermValueOption('youtube-user')) ? 'hide display' : 'hide'}
                            >
                                <label>
                                    YouTube Username
                                </label>
                                <input 
                                    type='text'
                                    defaultValue={this.getDefaultTermValue('youtube-user')}
                                    onChange={this.handleTermValueChange}
                                />
                            </fieldset>
                            <fieldset 
                                ref='youtube-search' 
                                className={(this.checkTermValueOption('youtube-search')) ? 'hide display' : 'hide'}
                            >
                                <label>
                                    YouTube Search
                                </label>
                                <input 
                                    type='text'
                                    defaultValue={this.getDefaultTermValue('youtube-search')} 
                                    onChange={this.handleTermValueChange}
                                />
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