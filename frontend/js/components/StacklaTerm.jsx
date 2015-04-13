(function(window)
{
    'use strict';

    window.stacklaWp.admin.metabox.components.StacklaTerm = React.createClass(
    {
        propTypes:
        {
        },
        getInitialState:function()
        {
            return {
                dependencies:
                {
                    StacklaNetworkSelect:stacklaWp.admin.metabox.components.StacklaNetworkSelect
                },
                count:1,
                terms:[]
            }
        },
        /**
        *   Adds one to the count of StacklaNetworkSelect components to render;
        *   @return void;
        */
        addTerm:function()
        {
            this.setState(
            {
                terms:[],
                count:this.state.count + 1
            });
        },
        /**
        *   Subracts one to the count of StacklaNetworkSelect components to render;
        *   @return void;
        */
        removeTerm:function()
        {
            if(this.state.count <= 1) return;
            this.setState(
            {
                terms:[],
                count:this.state.count - 1
            });
        },
        /**
        *   Loops through the count, pushes StacklaNetworkSelect components to the terms array;
        *   Renders these components;
        *   @return void;
        */
        render:function()
        {
            var i;

            for(i = 0 ; i < this.state.count ; i++)
            {
                this.state.terms.push(
                    <this.state.dependencies.StacklaNetworkSelect 
                        twitter={stacklaWp.admin.metabox.config.network.twitter}
                        facebook={stacklaWp.admin.metabox.config.network.facebook}
                        instagram={stacklaWp.admin.metabox.config.network.instagram}
                        youtube={stacklaWp.admin.metabox.config.network.youtube}
                        key={i}
                    />
                );
            }

            return (
                <div className='term'>
                    {this.state.terms}
                </div>
            );
        }
    });
}(window));