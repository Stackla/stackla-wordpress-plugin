(function(window)
{
    'use strict';

    window.stacklaWp.public.widgetNavigation =
    {
        widgetId:false,
        selectors:
        {
            widget:'.stacklafw',
            nav:'.stackla-widget-nav',
            list:'.stackla-widget-nav ul',
            item:'.stackla-widget-nav ul li',
            anchor:'.stackla-widget-nav ul li a'
        },
        run:function()
        {
            if(!this.selectors.nav.length) return;
            if(!this.selectors.widget.length) return;

            var self = this;

            this.widgetId = $(this.selectors.widget).data('id');

            if(this.widgetId === false || typeof this.widgetId == 'undefined') return;

            $(this.selectors.anchor).on('click' , function(e)
            {
                e.preventDefault();

                var $container = $(this).parent();

                $(self.selectors.item).removeClass('active');
                $container.addClass('active');

                StacklaFluidWidget.changeFilter(self.widgetId, $(this).attr('data-filter'));
            });
        }
    };
}(window));