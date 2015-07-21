modules.define('User', ['Backbone'], function(provide, Backbone) {
    provide(Backbone.Model.extend({
        validate: function () {
            console.log(arguments);
        }
    }));
});