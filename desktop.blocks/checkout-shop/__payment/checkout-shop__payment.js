modules.define('checkout-shop__payment', ['Backbone', 'yate'], function (provide, Backbone, yate) {
    provide(Backbone.View.extend({

        events: {
        },

        initialize: function (options) {
            var view = this;

            this.$container = $(options.container);
            this.render();
            this.$container.append(this.$el);

            this.model.on('destroy', function () {
                view.destroy();
            });
        },

        destroy: function () {
            this.remove();
        },

        render: function () {
            var shopData = this.model.toJSON();
            this.$el.html(this.template(shopData));
        },

        template: function (data) {
            return yate.render('page', data, 'checkout-shop__payment', null, null);
        }
    }));
});