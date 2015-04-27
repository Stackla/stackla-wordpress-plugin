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
            editWidgetTermsData:React.PropTypes.func,
            errors:React.PropTypes.oneOfType([React.PropTypes.object , React.PropTypes.bool]),
            twitter:React.PropTypes.array,
            facebook:React.PropTypes.array,
            instagram:React.PropTypes.array,
            youtube:React.PropTypes.array,
            id:React.PropTypes.number,
            data:React.PropTypes.oneOfType([React.PropTypes.object , React.PropTypes.bool])
        },
        /**
        *   Sets the initial state of the component;
        *   @return {this.state} the component's state object;
        */
        getInitialState:function()
        {
            return {
                id:this.props.id,
                name:(this.props.data) ? this.props.data.name : '',
                network:(this.props.data) ? this.props.data.network : '',
                termId:(typeof this.props.data.termId !== 'undefined') ? this.props.data.termId : '',
                term:(this.props.data) ? this.props.data.term : '',
                termValue:(this.props.data) ? this.props.data.termValue : '',
                termDelimited:(this.props.data) ? this.props.data.network + '-' + this.props.data.term : '',
                errors:false,
                edited:false,
                removed:false
            }
        },
        /**
        *   Removes the term from the view and sets the removed flag on this.state;
        *   @param {e} event object;
        *   @return void;
        */
        handleRemoveTerm(e)
        {
            e.preventDefault();
            this.setState({removed:true , edited:true});
        },
        /**
        *   Handles the onChange event for the term name input field;
        *   @param {e} event object;
        *   @return void;
        */
        handleNameChange:function(e)
        {
            this.setState({name:e.target.value , edited:true});
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
                termValue:'',
                edited:true
            });
        },
        /**
        *   Handles the user changed the network's term option;
        *   @param {e} event object;
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
                termValue:'',
                edited:true
            });
        },
        /**
        *   Handles what happens when a term value is changed by the user;
        *   @param {e} event object;
        *   @return void;
        */
        handleTermValueChange:function(e)
        {
            this.setState({termValue:e.target.value , edited:true});
        },
        /**
        *   Matches the current network being rendered against what is in the state;
        *   @param {network} the current network in the render loop;
        *   @return boolean;
        */
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
        removeTermDelimiter:function(termDelimited)
        {
            var split = termDelimited.split('-');
            return split[1];
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

            if(this.state.removed === true)
            {
                return (
                    <div></div>
                );
            }

            return (
                <div className='stackla-block'>
                    <div className={(this.state.errors === false) ? 'stackla-widget-section' : 'stackla-widget-section stackla-widget-error'}>
                        <fieldset className='term-name'>
                            <label>
                                Term name
                            </label>
                            <input type='text' className='widefat' ref='termName' defaultValue={this.state.name} onChange={this.handleNameChange}/>
                        </fieldset>
                        <fieldset>
                            <label>
                                Choose a network
                            </label>
                            <div className={(this.state.network !== '') ? 'term-network-set' : 'hide'}>
                                {this.state.network}
                            </div>
                            <select 
                                ref='termNetwork' 
                                onChange={this.handleNetworkChange}
                                className={(this.state.network !== '') ? 'hide' : ''} 
                                defaultValue={this.state.network}
                            >
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
                                Choose a type
                            </label>
                            {
                                stacklaWp.admin.config.networks.map(function(network , i)
                                {
                                    if(self.checkTermSelected(network , self.props[network]) !== '')
                                    {
                                        return  <div key={i} className={(self.displayNetworkTermOptions(network)) ? 'term-type-set' : 'hide'}>
                                                {
                                                    self.removeTermDelimiter(self.checkTermSelected(network , self.props[network]))
                                                }
                                                </div>
                                    }
                                    else
                                    {
                                        return  <select 
                                                    className={(self.displayNetworkTermOptions(network)) ? '' : 'hide'} 
                                                    defaultValue={self.checkTermSelected(network , self.props[network])} 
                                                    ref={network + i}
                                                    onClick={self.checkTermSet}
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
                                    }
                                    
                                })
                            }
                        </fieldset>
                        <fieldset ref='termValue' className='term-values'>
                            <fieldset 
                                ref='twitter-user' 
                                className={(this.checkTermValueOption('twitter-user')) ? 'hide display' : 'hide'}
                            >
                                <label>
                                    Twitter Username
                                </label>
                                <span className='decorator'>
                                    @
                                </span>
                                <input 
                                    type='text'
                                    defaultValue={this.getDefaultTermValue('twitter-user')}
                                    ref='twitter-user-value'
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
                                    defaultValue={this.getDefaultTermValue('twitter-hashtag')}
                                    ref='twitter-hashtag-value'
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
                                    ref='facebook-page-value'
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
                                    ref='facebook-search-value'
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
                                    ref='instagram-user-value'
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
                                    ref='instagram-hashtag-value'
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
                                    ref='youtube-user-value'
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
                                    ref='youtube-search-value' 
                                    onChange={this.handleTermValueChange}
                                />
                            </fieldset>
                        </fieldset>
                        <div>
                            <a 
                                className='button remove-term'
                                onClick={this.handleRemoveTerm}
                            >
                                Remove <b>{this.state.name}</b>
                            </a>
                        </div>
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
                            <li className={(this.state.errors.sdk) ? '' : 'hide'}>
                                {(this.state.errors.sdk) ? this.state.errors.sdk : ''}
                            </li>
                        </ul>
                    </div>
                </div>
            );
        }
    });
}(window));