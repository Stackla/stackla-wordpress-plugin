(function()
{
    'use strict';

    window.stacklaWp.admin.components.Filter = React.createClass(
    {
        propTypes:
        {
            key:React.PropTypes.number,
            id:React.PropTypes.number,
            data:React.PropTypes.oneOfType([React.PropTypes.object , React.PropTypes.bool]),
            onRemove:React.PropTypes.func,
            readonly: false,
            showRemove:React.PropTypes.bool
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
                network:(this.props.data) ? this.props.data.network : stacklaWp.admin.config.networks,
                filterId:(typeof this.props.data.filterId !== 'undefined') ? this.props.data.filterId : '',
                media:(this.props.data) ? this.props.data.media : stacklaWp.admin.config.media,
                sorting:(this.props.data) ? this.props.data.sorting : 'latest',
                errors:false,
                edited:false,
                removed:false
            }
        },
        /**
        *   Handles the "removal" of a filter component;
        *   @param {e} event object;
        *   @return void;
        */
        handleRemoveFilter:function(e)
        {
            e.preventDefault();
            this.setState({removed:true , edited:true} , this.props.onRemove);
        },
        /**
        *   Handles the change event for the filter name input field;
        *   @param {e} event object;
        *   @return void;
        */
        handleNameChange:function(e)
        {
            if (this.props.readonly) {
                return;
            }
            this.setState({name:e.target.value , edited:true});
        },
        /**
        *   Handles the change events for the network checkboxes;
        *   @param {e} event object;
        *   @return void;
        */
        handleNetworkCheck:function(e)
        {
            if (this.props.readonly) {
                return;
            }
            var copy = this.state.network.slice();
            var index = copy.indexOf(e.target.value);

            if(e.target.checked === true)
            {
                if(index <= -1)
                {
                    copy.push(e.target.value);

                    this.setState(
                    {
                        network:copy,
                        edited:true
                    });
                }
            }
            else
            {
                if(index > -1)
                {
                    copy.splice(index , 1);

                    this.setState(
                    {
                        network:copy,
                        edited:true
                    });
                }
            }
        },
        /**
        *   Handles the change events for the media checkboxes;
        *   @param {e} event object;
        *   @return void;
        */
        handleMediaCheck:function(e)
        {
            if (this.props.readonly) {
                return;
            }
            var copy = this.state.media.slice();
            var index = copy.indexOf(e.target.value);

            if(e.target.checked === true)
            {
                if(index <= -1)
                {
                    copy.push(e.target.value);

                    this.setState(
                    {
                        media:copy,
                        edited:true
                    });
                }
            }
            else
            {
                if(index > -1)
                {
                    copy.splice(index , 1);

                    this.setState(
                    {
                        media:copy,
                        edited:true
                    });
                }
            }
        },
        /**
        *   Handles the change event for the sorting select field;
        *   @param {e} event object;
        *   @return void;
        */
        handleSortingChange:function(e)
        {
            if (this.props.readonly) {
                return;
            }
            this.setState({sorting:e.target.value , edited:true});
        },
        /**
        *   Checks to see if an array value has been set;
        *   @param {key} the array key to look for;
        *   @param {value} the value to look for mapped to the key;
        *   @return void;
        */
        checkArrayValue:function(key , value)
        {
            if(!this.state[key].length) return false;

            if(this.state[key].indexOf(value) > -1)
            {
                return true;
            }
            return false;
        },
        /**
        *   Renders a Filter component;
        *   @return React component;
        */
        render:function()
        {
            var first = (this.props.id === 0) ? 'first ' : ''
            var readonly = this.props.readonly;
            var removeFilter;

            if(this.state.removed === true)
            {
                return (
                    <div></div>
                );
            }

            if (!readonly) {
                removeFilter = (
                     <div className={(this.props.showRemove) ? '' : 'hide'}>
                        <a className='remove-filter' onClick={this.handleRemoveFilter}>
                            Remove <b>{this.state.name}</b>
                        </a>
                     </div>
                )
            }
            return (
                <div className={first + 'stackla-block'}>
                    <div className={(this.state.errors === false) ? 'stackla-widget-section' : 'stackla-widget-section stackla-widget-error'}>
                        <div className='stackla-widget-inner'>
                            <fieldset className='term-name'>
                                <label>
                                    Filter name
                                </label>
                                <input
                                    type='text'
                                    className='widefat'
                                    value={this.state.name}
                                    onChange={this.handleNameChange}
                                        disabled={readonly}
                                />
                            </fieldset>
                            <fieldset>
                                <label>
                                    Network
                                </label>
                                <fieldset>
                                    <label className='checkbox'>
                                        <input
                                            type='checkbox'
                                            value='twitter'
                                            defaultChecked={this.checkArrayValue('network' , 'twitter')}
                                            onChange={this.handleNetworkCheck}
                                            disabled={readonly}
                                        />
                                        Twitter
                                    </label>
                                </fieldset>
                                <fieldset>
                                    <label className='checkbox'>
                                        <input
                                            type='checkbox'
                                            value='facebook'
                                            defaultChecked={this.checkArrayValue('network' , 'facebook')}
                                            onChange={this.handleNetworkCheck}
                                            disabled={readonly}
                                        />
                                        Facebook
                                    </label>
                                </fieldset>
                                <fieldset>
                                    <label className='checkbox'>
                                        <input
                                            type='checkbox'
                                            value='instagram'
                                            defaultChecked={this.checkArrayValue('network' , 'instagram')}
                                            onChange={this.handleNetworkCheck}
                                            disabled={readonly}
                                        />
                                        Instagram
                                    </label>
                                </fieldset>
                                <fieldset>
                                    <label className='checkbox'>
                                        <input
                                            type='checkbox'
                                            value='youtube'
                                            defaultChecked={this.checkArrayValue('network' , 'youtube')}
                                            onChange={this.handleNetworkCheck}
                                            disabled={readonly}
                                        />
                                        YouTube
                                    </label>
                                </fieldset>
                            </fieldset>
                             <fieldset>
                                <label>
                                    Media
                                </label>
                                <fieldset>
                                    <label className='checkbox'>
                                        <input
                                            type='checkbox'
                                            value='text'
                                            defaultChecked={this.checkArrayValue('media' , 'text')}
                                            disabled={readonly}
                                            onChange={this.handleMediaCheck}/>
                                        Text-only
                                    </label>
                                </fieldset>
                                <fieldset>
                                    <label className='checkbox'>
                                        <input
                                            type='checkbox'
                                            value='image'
                                            defaultChecked={this.checkArrayValue('media' , 'image')}
                                            disabled={readonly}
                                            onChange={this.handleMediaCheck}/>
                                        Images
                                    </label>
                                </fieldset>
                                <fieldset>
                                    <label className='checkbox'>
                                        <input
                                            type='checkbox'
                                            value='video'
                                            defaultChecked={this.checkArrayValue('media' , 'video')}
                                            disabled={readonly}
                                            onChange={this.handleMediaCheck}
                                        />
                                        Video
                                    </label>
                                </fieldset>
                             </fieldset>
                             <fieldset>
                                <label>
                                    Sorting
                                </label>
                                <select value={this.state.sorting} onChange={this.handleSortingChange}
                                        disabled={readonly}>
                                    <option value='latest'>
                                        Latest
                                    </option>
                                    <option value='greatest'>
                                        Greatest
                                    </option>
                                    <option value='votes'>
                                        Votes
                                    </option>
                                </select>
                             </fieldset>
                             {removeFilter}
                            <div className={(this.state.errors === false) ? 'hide' : 'stackla-error-message'}>
                                <ul>
                                    <li className={(this.state.errors.name) ? '' : 'hide'}>
                                        {(this.state.errors.name) ? this.state.errors.name : ''}
                                    </li>
                                    <li className={(this.state.errors.media) ? '' : 'hide'}>
                                        {(this.state.errors.media) ? this.state.errors.media : ''}
                                    </li>
                                    <li className={(this.state.errors.network) ? '' : 'hide'}>
                                        {(this.state.errors.network) ? this.state.errors.network : ''}
                                    </li>
                                    <li className={(this.state.errors.sorting) ? '' : 'hide'}>
                                        {(this.state.errors.sorting) ? this.state.errors.sorting : ''}
                                    </li>
                                    <li className={(this.state.errors.sdk) ? '' : 'hide'}>
                                        {(this.state.errors.sdk) ? this.state.errors.sdk : ''}
                                    </li>
                                </ul>
                             </div>
                         </div>

                     </div>
                 </div>
            );
        }
    });
}());
