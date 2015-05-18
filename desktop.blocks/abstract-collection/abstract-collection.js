modules.define('AbstractCollection', ['Backbone', 'AbstractModel'], function(provide, Backbone, AbstractModel) {
    var AbstractCollection = Backbone.Collection.extend({
        model: AbstractModel
    });

    provide(AbstractCollection);
});