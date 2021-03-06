/*
    !! NOTE !!

    There are some outdated naming conventions here as this code was written a bit before the SDK was complete.
    Here's a rough key mapping how they match up to their counterparts in the SDK:

    this.state.term == term->type
    this.state.termValue == term->term
    this.state.termDelimited == term->type + '-' + term->network
*/

(function(window)
{
    'use strict';

    var DEBUG = false;

    if (typeof $ === 'undefined') {
        var $ = jQuery;
    }

    function log(message, type) {
        if (!type) type = 'INFO';
        if (DEBUG) {
            window.console.log('[' + type + '] ' + message);
        }
    }

    window.stacklaWp.admin.components.Term = React.createClass( {
        propTypes: {
            editWidgetTermsData: React.PropTypes.func,
            errors: React.PropTypes.oneOfType([React.PropTypes.object , React.PropTypes.bool]),
            twitter: React.PropTypes.array,
            facebook: React.PropTypes.array,
            instagram: React.PropTypes.array,
            youtube: React.PropTypes.array,
            id: React.PropTypes.number,
            readonly: false,
            data: React.PropTypes.oneOfType([React.PropTypes.object , React.PropTypes.bool])
        },
        /**
        *   Sets the initial state of the component;
        *   @return object  {this.state}    the component's state object;
        */
        getInitialState:function() {
            return {
                id: this.props.id,
                name: (this.props.data) ? this.props.data.name : '',
                network: (this.props.data) ? this.props.data.network : '',
                termId: (typeof this.props.data.termId !== 'undefined') ? this.props.data.termId : '',
                term: (this.props.data) ? this.props.data.term : '',
                termValue: (this.props.data) ? this.props.data.termValue : '',
                termDelimited: (this.props.data) ? this.props.data.network + '-' + this.props.data.term : '',
                errors: false,
                edited: false,
                removed: false
            }
        },
        /**
        *   Removes the term from the view and sets the removed flag on this.state;
        *   @param object   {e} event object;
        *   @return void;
        */
        handleRemoveTerm(e) {
            e.preventDefault();
            log('handleRemoveTerm');
            this.setState({removed:true , edited:true});
        },
        /**
        *   Handles the onChange event for the term name input field;
        *   @param object   {e} event object;
        *   @return void;
        */
        handleNameChange:function(e) {
            log('handleNameChange');
            this.setState({name:e.target.value , edited:true});
        },
        /**
        *   Handles the user changing the network option;
        *   @param object   {e} event object;
        *   @return void;
        */
        handleNetworkChange:function(e) {
            var value = e.target.value;

            $(React.findDOMNode(this.refs.termRules)).find('select').removeClass('display');
            $(React.findDOMNode(this.refs.termValue)).find('fieldset').removeClass('display');

            if(value == '') {
                $(React.findDOMNode(this.refs.termRulesLabel)).removeClass('display');
                $(React.findDOMNode(this.refs.termValue)).find('fieldset').removeClass('display');
            } else {
                $(React.findDOMNode(this.refs.termRulesLabel)).addClass('display');
                $(React.findDOMNode(this.refs[value])).addClass('display');
            }

            log('handleNetworkChange');
            this.setState( {
                network: value,
                term: '',
                termValue: '',
                edited: true
            });
        },
        /**
        *   Handles the user changing the network's type option;
        *   @param object   {e} event object;
        *   @return void;
        */
        handleTypeChange:function(e) {
            var value = e.target.value;
            var split = value.split('-');

            $(React.findDOMNode(this.refs.termValue)).find('fieldset').removeClass('display');

            $(React.findDOMNode(this.refs[value])).addClass('display')

            log('handleTypeChange');
            this.setState( {
                term: split[1],
                termValue: '',
                edited: true
            });
        },
        /**
        *   Handles the user changing the term value;
        *   @param object   {e} event object;
        *   @return void;
        */
        handleTermValueChange:function(e) {
            log('handleTermValueChange');
            this.setState({termValue:e.target.value , edited:true});
        },
        /**
        *   Determines which type options to display based on the current this.state.network;
        *   @param string   {network}   the current network in the component's state;
        *   @return boolean {true || false} true if the passed network is the current network || false if not;
        */
        displayNetworkTypeOptions:function(network) {
            if(this.state.network === '') return false;
            if(this.state.network == network) return true;
            return false;
        },
        /**
        *   Checks if the typeOptionsName passed is the current;
        *   @param string   {typeOptionsName} the needle;
        *   @param array   {options} the haystack;
        *   @return string  {mixed} delimited type option with this.state.term || empty string;
        */
        checkTypeSelected:function(typeOptionsName , options) {
            if(this.state.termId === '') return '';
            if(options.indexOf(this.state.term) > -1) return typeOptionsName + '-' + this.state.term;
            return '';
        },
        /**
        *   Removes the '-' delimiter from the network type option;
        *   @param string   {delimited} a string delimited by one hyphen;
        *   @return string  the term type without its network;
        */
        removeTypeDelimiter:function(delimited) {
            var split = delimited.split('-');
            return split[1];
        },
        /**
        *   Checks the option ref against the set termDelimited value;
        *   @param string   {ref}   a React DOMNode reference;
        *   @return boolean;
        */
        checkTermValueOption:function(ref) {
            if(this.state.termDelimited === '') return false;
            if(this.state.termDelimited == ref) return true;
            return false;
        },
        /**
        *   Gets the default term value by checking a delimited string against the current termDelimited value;
        *   @param string   {delimited} a network-termType format hyphenated string
        *   @return string;
        */
        getDefaultTermValue:function(delimited) {
            if(this.state.termDelimited === '') return '';
            if(this.state.termDelimited == delimited) return this.state.termValue;
            return '';
        },

        /**
        *   Renders a Term component;
        *   @return React component;
        */
        render:function() {
            var self = this;
            var first = (this.props.id === 0) ? 'first' : ''
            var readonly = this.props.readonly;
            var removeTerm, typeOptions, networkOptions;

            if(this.state.removed === true) {
                return (
                    <div></div>
                );
            }
            if (!this.props.readonly) {
                removeTerm = (
                    <div>
                        <a className='remove-term' onClick={this.handleRemoveTerm}>
                            Remove <b>{this.state.name}</b>
                        </a>
                    </div>
                )
            }

            typeOptions = stacklaWp.admin.config.networks.map(function(network , i) {
                if(self.checkTypeSelected(network , self.props[network]) !== '') {
                    return  <div key={i} className={(self.displayNetworkTypeOptions(network)) ? 'term-type-set' : 'hide'}>{ self.removeTypeDelimiter(self.checkTypeSelected(network , self.props[network])) }</div>
                } else {
                    return  <select
                                className={(self.displayNetworkTypeOptions(network)) ? '' : 'hide'}
                                defaultValue={self.checkTypeSelected(network , self.props[network])}
                                ref={network + i}
                                onClick={self.checkTermSet}
                                onChange={self.handleTypeChange}
                                key={network + i}
                            >
                                <option value=''></option>
                                {
                                    self.props[network].map(function(option , j) {
                                        return  <option
                                                    key={option + j}
                                                    value={network + '-' + option}>
                                                    {option}
                                                </option>
                                    })
                                }
                            </select>
                }

            })

            return (
                <div className={first + ' stackla-block'}>
                    <div className={(this.state.errors === false) ? 'stackla-widget-section' : 'stackla-widget-section stackla-widget-error'}>
                        <div className='stackla-widget-inner'>
                            <fieldset>
                                <label>
                                    Choose a network
                                </label>
                                <div className={(this.state.termId !== '') ? 'term-network-set' : 'hide'}>
                                    {this.state.network}
                                </div>
                                <select
                                    ref='termNetwork'
                                    onChange={this.handleNetworkChange}
                                    className={(this.state.termId !== '') ? 'hide' : ''}
                                    defaultValue={this.state.network}
                                >
                                    <option value=''></option>
                                    {
                                        stacklaWp.admin.config.networks.map(function(network , i) {
                                            return <option value={network} key={i}>{network}</option>
                                        })
                                    }
                                </select>
                            </fieldset>
                            <fieldset ref='termRules'>
                                <label className={(this.state.network === '') ? 'hide' : ''} ref='termRulesLabel'>
                                    Choose a type
                                </label>
                                {typeOptions}
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
                                        readOnly={readonly}
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
                                        readOnly={readonly}
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
                                        readOnly={readonly}
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
                                        readOnly={readonly}
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
                                        readOnly={readonly}
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
                                        readOnly={readonly}
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
                                        readOnly={readonly}
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
                                        readOnly={readonly}
                                    />
                                </fieldset>
                            </fieldset>
                            {removeTerm}
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
                </div>
            );
        }
    });
}(window));
