modules.define('page', ['i-bem__dom'], function (provide, DOM) {

    DOM.decl('page', {
        onSetMod: {
            'js': {
                'inited': function () {
                    console.log(this.domElem[0].outerHTML);
                }
            }
        }
    });

    provide(DOM);

});