(function()
{
    'use strict';

    window.app.stacklaTextSearch =
    {
        conf:
        {
            form:"#search-form",
            refSearch:false,
            widgetId:'3579',
            delay:100
        },
        run:function()
        {
            var self = this;

            $(this.conf.form).on('submit' , function(e)
            {
                e.preventDefault();
                self.search($(this).find('input[name="keyword"]').val());
            });
        },
        search:function(keyword)
        {
            var self = this;

            if(keyword.length < 3) return;

            if (this.conf.refSearch)
            {
                clearTimeout(this.conf.refSearch);
            }
            this.conf.refSearch = setTimeout(function()
            {
                StacklaFluidWidget.searchFilter(self.conf.widgetId, keyword);
            }, this.conf.delay);
        }
    };
}());