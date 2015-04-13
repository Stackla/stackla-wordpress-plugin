(function(window)
{
    'use strict';

    window.stacklaWp.admin.metabox.components.StacklaWidgetTitle = React.createClass(
    {
        propTypes:
        {
            data:React.PropTypes.object
        },
        getInitialState:function()
        {
            return {
                data:[]
            }
        },
        render:function()
        {
            return (
                <fieldset>
                    <label>
                        The title for your stackla widget
                    </label>
                    <input type='text' className='widefat' name='stackla_wp_title' defaultValue={this.props.data.title}/>
                </fieldset>
            );
        }
    });
}(window));

/*
    This shouldn't be here, it's a gulp problem, fix it
*/

(function(window)
{
    'use strict';

    window.stacklaWp.admin.metabox.components.StacklaFilter = React.createClass(
    {
        propTypes:
        {
            
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
                <div className='stackla-filter'>
                    <fieldset className='term-name'>
                        <label>
                            Filter name
                        </label>
                        <input type='text' className='widefat'/>
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
                            <input type='checkbox' /><label className='checkbox'>Text-only</label>
                        </fieldset>
                        <fieldset>
                            <input type='checkbox' /><label className='checkbox'>Images</label>
                        </fieldset>
                        <fieldset>
                            <input type='checkbox' /><label className='checkbox'>Video</label>
                        </fieldset>
                     </fieldset>
                     <fieldset>
                        <label>
                            Sorting
                        </label>
                        <select>
                            <option></option>
                            <option value='latest'>Latest</option>
                            <option value='greatest'>Greatest</option>
                            <option value='votes'>Votes</option>
                        </select>
                     </fieldset>
                 </div>
            );
        }
    });
}(window));