modules.define('abstract-view', ['i-bem__dom', 'app'], function (provide, BEMDOM, app) {
    provide(BEMDOM.decl(this.name,
        {
            onSetMod: {
                'js': {
                    'inited': function () {
                        this.collection = app.getData('abstractCollection');
                        this.listeners();
                        this.render();
                    }
                }
            },

            listeners: function () {
                this.collection.on('change', this.render);
            },

            render: function () {
                this.collection.forEach(function (item) {
                    console.log(item);
                });
            }
        }));
});