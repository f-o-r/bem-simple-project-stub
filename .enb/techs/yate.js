const YATE_EXTENSION = 'yate';

var fs = require('fs');
var yate = require('yate');
var methods = {};

function builder (sourceFiles) {
    var node;

    try {
        var yate = require('yate');
    } catch (e) {
        throw new Error('The technology "yate" cannot be executed because the npm module "yate" was not found.');
    }

    node = this.node;

    this._targetName = node.unmaskTargetName('?');
    this._targetFileName = node.unmaskTargetName(this._targetYate);
    this._targetPath = node.resolvePath('');
    this._targetYateFilePath = this._targetPath + this._targetFileName + '.' + YATE_EXTENSION;
    this._sourceFiles = sourceFiles;

    if (!sourceFiles.length) {
        return '';
    }

    this.prepareTemplate();
    this.importCommon();

    return this.compile();
}

methods.prepareTemplate = function () {
    var moduleName = (this._isCommon || this._moduleNameByBundle) ? this._targetName : 'page';
    var targetDepsYateSource = 'module "'+moduleName+'"\n\n';

    // Импортим общий common
    if (!this._isCommon && this._commonYateObjPath && fs.existsSync(this._commonYateObjPath)) {
        targetDepsYateSource += 'import "common"\n\n';
    }

    // Собираем зависимости
    targetDepsYateSource += this._sourceFiles.map(function(file) {
        return 'include "'+file.fullname+'"';
    }).join('\n');

    // Сохраняем зависимости в файл на жесткий диск, для последующей компиляции
    fs.writeFileSync(this._targetYateFilePath, targetDepsYateSource, 'utf-8');
};

methods.importCommon = function () {
    var commonYateObj;

    // Если это common бандл, то для него него нужно делать импорт
    if (this._isCommon) {
        return;
    }

    // Добавляем импорты, аналогично этому: https://github.com/pasaran/yate/blob/master/yate#L53
    if (this._commonYateObjPath && fs.existsSync(this._commonYateObjPath)) {
        yate.modules = {};
        commonYateObj = JSON.parse(fs.readFileSync(this._commonYateObjPath));
        yate.modules[commonYateObj.name] = commonYateObj;
    } else {
        this.node.getLogger().logWarningAction('warning', this._targetName+'.yate.js', 'Не найден или не задан common бандл: ' + this._commonYateObjPath);
    }
};

methods.compile = function () {
    var resultYateJsSource;

    try {
        resultYateJsSource = this._prependJs;
        resultYateJsSource += yate.compile(this._targetYateFilePath).js;
        resultYateJsSource += this._appendJs;
    } catch (error) {
        throw new Error('The technology "yate" throw compile error. '+error);
    }

    return resultYateJsSource;
};

module.exports = require('enb/lib/build-flow').create()
    .name('yate')
    .target('target', '?.yate.js')
    .useFileList('yate')
    .defineOption('verbose', false)
    .defineOption('targetYate', '?')
    .defineOption('commonYateObjPath', false)
    .defineOption('isCommon', false)
    .defineOption('prependJs', '')
    .defineOption('appendJs', '')
    .builder(builder)
    .methods(methods)
    .createTech();