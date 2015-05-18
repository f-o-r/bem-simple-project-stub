modules.define('service-list', ['i-bem__dom', 'app'], function (provide, BEMDOM, app) {
    provide(BEMDOM.decl(this.name,
        {
            onSetMod: {
                'js': {
                    'inited': function () {
                        this.offsetTop = this.domElem.offset().top;
                        this.collection = app.getData('serviceList');
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
            },

            getOffsetTop: function () {
                return this.domElem.offset().top;
            }
        }));
});