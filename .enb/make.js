var path = require('path');
var techs = {
    fileProvider: require('enb/techs/file-provider'),
    fileMerge: require('enb/techs/file-merge'),
    fileCopy: require('enb/techs/file-copy'),

    stylusWithNim: require('enb-stylus/techs/css-stylus-with-nib'),

    js: require('enb/techs/js'),
    jsExpandIncludes: require('enb/techs/js-expand-includes'),
    vanillaJs: require('enb-diverse-js/techs/vanilla-js'),
    browserJs: require('enb-diverse-js/techs/browser-js'),

    yateTech:   require('./techs/yate.js'),

    borschik: require('enb-borschik/techs/borschik')
};

var enbBemTechs = require('enb-bem-techs');

var bundlesPath = 'desktop.bundles';
var commonName = 'common';
var commonPath = path.join(bundlesPath, commonName);
var commonYatePath = path.resolve(path.join(bundlesPath, commonName));
var commonYateObjPath = [commonYatePath, 'common.yate.obj'].join('/');
var commonYateClientObjPath = [commonYatePath, 'common.client.yate.obj'].join('/');

var levels = [
    { path: 'libs/bem-core/common.blocks', check: false },
    { path: 'libs/bem-core/desktop.blocks', check: false },
    'desktop.pages',
    'desktop.libs',
    'desktop.blocks'
];

module.exports = function(config) {
    config.nodes(bundlesPath + '/*', function(nodeConfig) {

        if (nodeConfig.getPath() === commonPath) {
            nodeConfig.addTechs([
                //[enbBemTechs.depsOld],

                // Сборка всех Yate шаблонов
                [techs.yateTech,{
                    'isCommon': true
                }],

                // Сборка только клиентских Yate шаблонов
                [enbBemTechs.depsByTechToBemdecl, {
                    sourceTech: 'js',
                    destTech: 'yate-client',
                    filesTarget: '?.deps.js',
                    target: '?.yate.bemdecl.js'
                }],
                [enbBemTechs.depsOld, {
                    bemdeclFile: '?.yate.bemdecl.js',
                    target: '?.yate.deps.js'
                }],
                [enbBemTechs.files, {
                    filesTarget: '?.yate-client.files',
                    dirsTarget: '?.yate-client.dirs',
                    depsFile: '?.yate.deps.js'
                }],

                [techs.yateTech, {
                    isCommon: true,
                    target: '?.client.yate.js',
                    targetYate: '?.client',
                    filesTarget: '?.yate-client.files',
                    prependJs: 'modules.require("yate", function (yr) {',
                    appendJs: '});'
                }]
            ]);
        } else {
            nodeConfig.addTechs([
                // Вычитание common-бандл из page-бандл
                //[enbBemTechs.depsOld, {
                //    depsFile: '?.deps.js'
                //}],
                [enbBemTechs.provideDeps, {
                    node: commonPath,
                    target: commonName +'.deps.js'
                }],
                //[enbBemTechs.subtractDeps, {
                //    from: '?.big.deps.js',
                //    what: commonName +'.deps.js',
                //    target: '?.deps.js'
                //}],

                // Сборка всех Yate шаблонов + импорт common
                [techs.yateTech,{
                    'commonYateObjPath': commonYateObjPath
                }],


                // Сборка только клиентских Yate шаблонов + импорт клиентского common
                [enbBemTechs.depsByTechToBemdecl, {
                    sourceTech: 'js',
                    destTech: 'yate-client',
                    filesTarget: '?.deps.js',
                    target: '?.yate.bemdecl.js'
                }],
                [enbBemTechs.depsOld, {
                    bemdeclFile: '?.yate.bemdecl.js',
                    target: '?.yate.deps.js'
                }],
                [enbBemTechs.provideDeps, {
                    node: commonPath,
                    target: commonName +'.yate.deps.js',
                    source: commonName +'.yate.deps.js'
                }],
                //[enbBemTechs.subtractDeps, {
                //    from: '?.big.yate.deps.js',
                //    what: commonName +'.yate.deps.js',
                //    target: '?.yate.deps.js'
                //}],
                [enbBemTechs.files, {
                    filesTarget: '?.yate-client.files',
                    dirsTarget: '?.yate-client.dirs',
                    depsFile: '?.yate.deps.js'
                }],
                [techs.yateTech, {
                    target: '?.client.yate.js',
                    targetYate: '?.client',
                    filesTarget: '?.yate-client.files',
                    commonYateObjPath: commonYateClientObjPath,
                    prependJs: 'modules.require("yate", function (yr) {',
                    appendJs: '});'
                }]
            ]);
        }

        nodeConfig.addTechs([
            [techs.fileProvider, {
                target: '?.bemdecl.js'
            }],
            [enbBemTechs.levels, {
                levels: levels
            }],
            [enbBemTechs.deps],
            [enbBemTechs.files, {
                depsFile: '?.deps.js'
            }],
            [techs.js],
            [techs.vanillaJs],
            [techs.fileMerge, {
                sources: [
                    '?.vanilla.js',
                    '?.js',
                    '?.client.yate.js'
                ],
                target: '?.merge.js'
            }],
            [techs.stylusWithNim, {
                target: '?.css',
                variables: {
                    datauri: require('stylus').url()
                }
            }]
        ]);

        nodeConfig.addTargets([
            '?.merge.js',
            '_?.js',
            '?.css',
            '_?.css',
            '?.yate.js',
            '?.client.yate.js'
        ]);
    });

    config.mode('development', function() {
        config.nodes(bundlesPath + '/*', function(nodeConfig) {
            nodeConfig.addTechs([
                [techs.jsExpandIncludes, {
                    sourceTarget: '?.merge.js',
                    destTarget: '_?.js'
                }],
                [techs.fileCopy, {
                    sourceTarget: '?.css',
                    destTarget: '_?.css'
                }]
            ]);
        });
    });

    config.mode('production', function() {
        config.nodes(bundlesPath + '/*', function(nodeConfig) {
            nodeConfig.addTechs([
                [techs.jsExpandIncludes, {
                    sourceTarget: '?.merge.js',
                    destTarget: '_?.include.js'
                }],
                [techs.borschik, {
                    sourceTarget: '?.include.js',
                    destTarget: '_?.js',
                    freeze: true,
                    minify: true
                }],
                [techs.borschik, {
                    sourceTarget: '?.css',
                    destTarget: '_?.css',
                    tech: 'cleancss',
                    freeze: true,
                    minify: true
                }]
            ]);
        });
    });
};
