(function(window)
{
    'use strict';
    if (typeof $ === 'undefined') {
        var $ = jQuery;
    }

    window.stacklaWp.public.widgetNavigation =
    {
        selectors:
        {
            widgetWrapper:'.stackla-widget-wrapper',
            nav:'.stackla-widget-nav',
            list:'.stackla-widget-nav ul',
            item:'.stackla-widget-nav ul li',
            anchor:'.stackla-widget-nav ul li a'
        },
        run:function()
        {
            if(!this.selectors.nav.length) return;
            if(!this.selectors.widgetWrapper.length) return;

            var self = this;

            $(this.selectors.anchor).on('click' , function(e)
            {
                e.preventDefault();

                var $li = $(this).parent();
                var widgetId = $(this).closest(self.selectors.widgetWrapper).data('widgetid');

                $(self.selectors.item).removeClass('active');
                $li.addClass('active');

                StacklaFluidWidget.changeFilter(widgetId, $(this).attr('data-filter'));
            });
        }
    };
}(window));
