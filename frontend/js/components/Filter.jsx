(function()
{
    'use strict';

    window.stacklaWp.admin.components.Filter = React.createClass(
    {
        propTypes:
        {
            key:React.PropTypes.number
        },
        getInitialState:function()
        {
            return {
                id:this.props.id,
                name:'',
                network:'',
                media:[],
                sorting:''
            }
        },
        handleNameChange:function(e)
        {
            this.setState({name:e.target.value});
        },
        handleNetworkChange:function(e)
        {
            this.setState({network:e.target.value});
        },
        handleMediaCheck:function(e)
        {
            var copy = this.state.media.slice();
            var index = copy.indexOf(e.target.value);

            if(e.target.checked === true)
            {
                if(index <= -1)
                {
                    copy.push(e.target.value);

                    this.setState(
                    {
                        media:copy
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
                        media:copy
                    });
                }
            }
        },
        handleSortingChange:function(e)
        {
            this.setState({sorting:e.target.value});
        },
        render:function()
        {
            return (
                <div className='stackla-widget-filter' key={this.props.key}>
                    <fieldset className='term-name'>
                        <label>
                            Filter name
                        </label>
                        <input type='text' className='widefat' onChange={this.handleNameChange}/>
                    </fieldset>
                    <fieldset>
                        <label>
                            Network
                        </label>
                        <select onChange={this.handleNetworkChange}>
                            <option></option>
                            <option value='twitter'>Twitter</option>
                            <option value='facebook'>Facebook</option>
                            <option value='instagram'>Instagram</option>
                            <option value='youtube'>YouTube</option>
                        </select>
                    </fieldset>
                     <fieldset>
                        <label>
                            Media
                        </label>
                        <fieldset>
                            <input type='checkbox' value='text-only' onChange={this.handleMediaCheck}/>
                            <label className='checkbox'>
                                Text-only
                            </label>
                        </fieldset>
                        <fieldset>
                            <input type='checkbox' value='images' onChange={this.handleMediaCheck}/>
                            <label className='checkbox'>
                                Images
                            </label>
                        </fieldset>
                        <fieldset>
                            <input type='checkbox' value='video' onChange={this.handleMediaCheck}/>
                            <label className='checkbox'>
                                Video
                            </label>
                        </fieldset>
                     </fieldset>
                     <fieldset>
                        <label>
                            Sorting
                        </label>
                        <select onChange={this.handleSortingChange}>
                            <option></option>
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
                 </div>
            );
        }
    });
}());