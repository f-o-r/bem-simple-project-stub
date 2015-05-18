modules.define('content', ['i-bem__dom', 'functions__throttle'], function (provide, BEMDOM) {
    provide(BEMDOM.decl(this.name,
        {
            CONST: null,

            onSetMod: {
                'js': {
                    'inited': function () {
                        console.log('content init');
                        this.method();
                    }
                }
            },

            method: function () {
                console.log('method');
                this.__base.method();
            }
        },
        {
            method: function () {
                console.log('static method');
            }
        }
        ));
});