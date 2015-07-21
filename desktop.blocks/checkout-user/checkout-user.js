modules.define(
    'checkout-user',
    ['Backbone', 'yate'],
    function (provide, Backbone, yate) {

        provide(Backbone.View.extend({

        initialize: function (options) {
            this.$container = $(options.container);

            this.render();
            this.$container.append(this.$el);
            this.setListeners();
        },

        setListeners: function () {
            var view = this;

            this.model.on('destroy', function () {
                view.destroy();
            });
        },

        destroy: function () {
            this.remove();
        },

        render: function () {
            this.$el.html(this.template(this.model.toJSON()));
        },

        template: function (data) {
            return yate.render('page', data, 'checkout-user', null, null);
        }
    }));
});