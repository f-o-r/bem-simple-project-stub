modules.define('checkout-shop__total', ['Backbone', 'yate'], function (provide, Backbone, yate) {
    provide(Backbone.View.extend({

        events: {
        },

        initialize: function (options) {
            var view = this;

            this.$container = $(options.container);
            this.render();
            this.$container.append(this.$el);

            this.model.on('change:offers change:delivery.selected change:payment.selected', function () {
                view.render();
            });

            this.model.on('destroy', function () {
                view.destroy();
            });
        },

        destroy: function () {
            this.remove();
        },

        render: function () {
            var data = this.model.toJSON();
            data.totalPrice = this.model.totalPrice();

            this.$el.html(this.template(data));
        },

        template: function (data) {
            return yate.render('page', data, 'checkout-shop__total', null, null);
        }
    }));
});