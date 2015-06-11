const YATE_EXTENSION = 'yate';

var fs = require('fs');
var yate = require('yate');

module.exports = require('enb/lib/build-flow').create()
    .name('yate')
    .target('target', '?.yate.js')
    .useFileList('yate')
    .defineOption('verbose', false)
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

    if (!sourceFiles.length) {
        return resultYateJsSource;
    }

    // Собираем зависимости в конструкциях Yate
    targetDepsYateSource = 'module "'+targetName+'"\n';
    targetDepsYateSource += sourceFiles.map(function(file) {
        return 'include "'+file.fullname+'"';
    }).join('\n');

    // Сохраняем зависимости в файл на жесткий диск, для последующей компиляции
    fs.writeFileSync(targetYateFilePath, targetDepsYateSource);

    try {
        resultYateJsSource = 'modules.require("yate", function (yr) {';
        resultYateJsSource += yate.compile(resultYateFilePath).js
        resultYateJsSource += '});';
    } catch(error) {
        throw new Error('The technology "yate" throw compile error. '+error);
    }

    return resultYateJsSource;
}