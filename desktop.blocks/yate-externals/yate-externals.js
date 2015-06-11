modules.require('yate', function (yr) {
    var externals = yr.externals;

    externals['i18n'] = function (value) {
        return value;
    }
});