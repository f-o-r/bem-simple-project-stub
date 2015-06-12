const YATE_EXTENSION = 'yate';

var fs = require('fs');
var yate = require('yate');

module.exports = require('enb/lib/build-flow').create()
    .name('yate')
    .target('target', '?.yate.js')
    .useFileList('yate')
    .defineOption('verbose', false)
    .defineOption('commonYateObjPath', false)
    .defineOption('isCommon', false)
    .builder(builder)
    .createTech();

function builder (sourceFiles) {
    try {
        var yate = require('yate');
    } catch (e) {
        throw new Error('The technology "yate" cannot be executed because the npm module "yate" was not found.');
    }

    var node = this.node;
    var targetName = node.unmaskTargetName('?');
    var targetPath = node.resolvePath('');
    var targetYateFilePath = targetPath + targetName + '.' + YATE_EXTENSION;
    var targetDepsYateSource;
    var resultYateFilePath = targetYateFilePath;
    var resultYateJsSource = '';
    var commonYateObjPath = this._commonYateObjPath;
    var commonYateObj;
    var hasCommonYate = commonYateObjPath && fs.existsSync(commonYateObjPath);

    if (!sourceFiles.length) {
        return resultYateJsSource;
    }

    // Готовим Yate к компиляции
    targetDepsYateSource = 'module "'+targetName+'"\n\n';

    // Импортим общий common
    if (!this._isCommon && hasCommonYate) {
        targetDepsYateSource += 'import "common"\n\n';
    }

    // Собираем зависимости
    targetDepsYateSource += sourceFiles.map(function(file) {
        return 'include "'+file.fullname+'"';
    }).join('\n');

    // Сохраняем зависимости в файл на жесткий диск, для последующей компиляции
    fs.writeFileSync(targetYateFilePath, targetDepsYateSource, 'utf-8');

    // Добавляем импорты, аналогично этому: https://github.com/pasaran/yate/blob/master/yate#L53
    if (hasCommonYate) {
        yate.modules = {};
        commonYateObj = JSON.parse(fs.readFileSync(commonYateObjPath));
        yate.modules[commonYateObj.name] = commonYateObj;
    } else {
        this.node.getLogger().logWarningAction('warning', targetName+'.yate.js', 'Не найден или не задан common бандл');
    }

    try {
        resultYateJsSource = 'modules.require("yate", function (yr) {';
        resultYateJsSource += yate.compile(resultYateFilePath).js
        resultYateJsSource += '});';
    } catch (error) {
        throw new Error('The technology "yate" throw compile error. '+error);
    }

    return resultYateJsSource;
}