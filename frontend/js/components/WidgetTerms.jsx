(function(window)
{
    'use strict';

    window.stacklaWp.admin.components.WidgetTerms = React.createClass(
    {
        propTypes:
        {
            initialData:React.PropTypes.oneOfType([React.PropTypes.array , React.PropTypes.bool])
        },
        getInitialState:function()
        {
            return {
                dependencies:
                {
                    Term:stacklaWp.admin.components.Term
                },
                count:(this.props.initialData) ? this.props.initialData.length : 1,
                data:(this.props.initialData) ? this.props.initialData : [],
                items:[],
            }
        },
        /**
        *   Adds one to the count of Term components to render;
        *   @return void;
        */
        addTerm:function(e)
        {
            e.preventDefault();

            this.setState(
            {
                items:[],
                count:this.state.count + 1
            });
        },
        /**
        *   Subracts one to the count of Term components to render;
        *   @return void;
        */
        removeTerm:function(e)
        {
            e.preventDefault();

            if(this.state.count <= 1) return;
            this.setState(
            {
                items:[],
                count:this.state.count - 1
            });
        },
        /**
        *   Loops through the count, pushes Term components to the items array;
        *   Renders these components;
        *   @return void;
        */
        render:function()
        {
            var i;
            
            for(i = 0 ; i < this.state.count ; i++)
            {
                var fieldsetData = false;

                if(this.state.data.length)
                {
                    if(typeof this.state.data[i] !== 'undefined')
                    {
                        fieldsetData = this.state.data[i];
                    }
                }
                this.state.items.push(
                    <this.state.dependencies.Term 
                        twitter={stacklaWp.admin.config.network.twitter}
                        facebook={stacklaWp.admin.config.network.facebook}
                        instagram={stacklaWp.admin.config.network.instagram}
                        youtube={stacklaWp.admin.config.network.youtube}
                        key={i}
                        id={i}
                        ref={i}
                        data={fieldsetData}
                    />
                );
            }

            return (
                <div className='stackla-widget-terms'>
                    <header>
                        <h2>Create Terms</h2>
                        <a href='#' className='button' onClick={this.addTerm}>Add Term</a>
                        <a href='#' className='button' onClick={this.removeTerm}>Remove Term</a>
                    </header>
                    {this.state.items}
                </div>
            );
        }
    });
}(window));