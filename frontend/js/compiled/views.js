(function(window)
{
    'use strict';

    window.stacklaWp.admin.metabox.views.StacklaWP = function()
    {
        var View = React.createClass(
        {displayName: "View",
            propTypes:
            {
            
            },
            getInitialState:function()
            {
                return {
                    dependencies:
                    {
                        StacklaWidgetTitle:stacklaWp.admin.metabox.components.StacklaWidgetTitle,
                        StacklaTerm:stacklaWp.admin.metabox.components.StacklaTerm,
                        StacklaFilter:stacklaWp.admin.metabox.components.StacklaFilter
                    }
                }
            },
            /**
            *   Calls the StacklaTerm component's addTerm method;
            *   @param {e} a JavaScript event object;
            *   @return void;
            */
            handleAddTerm:function(e)
            {
                e.preventDefault();
                this.refs.term.addTerm();
            },
            /**
            *   Calls the StacklaTerm component's removeTerm method;
            *   @param {e} a JavaScript event object;
            *   @return void;
            */
            handleRemoveTerm:function(e)
            {
                e.preventDefault();
                this.refs.term.removeTerm();
            },
            handleAddFilter:function(e)
            {
                e.preventDefault();
            },
            handleRemoveFilter:function(e)
            {
                e.preventDefault();
            },
            render:function()
            {
                return (
                    React.createElement("div", {className: "react-template"}, 
                        React.createElement(this.state.dependencies.StacklaWidgetTitle, {
                            data: stacklaWp.admin.metabox.existingData}
                        ), 
                        React.createElement("section", {className: "terms"}, 
                            React.createElement("header", null, 
                                React.createElement("h2", null, "Create Terms"), 
                                React.createElement("a", {href: "#", className: "button", onClick: this.handleAddTerm}, "Add Term"), 
                                React.createElement("a", {href: "#", className: "button", onClick: this.handleRemoveTerm}, "Remove Term")
                            ), 
                            React.createElement(this.state.dependencies.StacklaTerm, {ref: "term"})
                        ), 
                        React.createElement("section", {className: "filters"}, 
                            React.createElement("header", null, 
                                React.createElement("h2", null, "Create Filters"), 
                                React.createElement("a", {href: "#", className: "button", onClick: this.handleAddFilter}, "Add Filter"), 
                                React.createElement("a", {href: "#", className: "button", onClick: this.handleRemoveFilter}, "Remove Filter")
                            ), 
                            React.createElement(this.state.dependencies.StacklaFilter, {ref: "filter"})
                        )
                    )
                );
            }
        });

        React.render(React.createElement(View, null) , document.getElementById('stackla-metabox'));
    };
}(window));