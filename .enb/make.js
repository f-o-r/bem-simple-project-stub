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
        var isCommonBundle = (nodeConfig.getPath() === commonPath);

        nodeConfig.addTechs([
            [techs.fileProvider, {
                target: '?.bemdecl.js'
            }],
            [enbBemTechs.levels, {
                levels: levels
            }],
            [enbBemTechs.deps, {
                target: (isCommonBundle) ? '?.deps.js' : '?.big.deps.js'
            }],

            [enbBemTechs.depsByTechToBemdecl, {
                sourceTech: 'js',
                destTech: 'yate-client',
                target: '?.yate.bemdecl.js'
            }],
            [enbBemTechs.depsOld, {
                bemdeclFile: '?.yate.bemdecl.js',
                target: (isCommonBundle) ? '?.yate.deps.js' : '?.yate.big.deps.js'
            }]
        ]);

        if (!isCommonBundle) {
            nodeConfig.addTechs([
                [enbBemTechs.provideDeps, {
                    node: commonPath,
                    target: commonName +'.deps.js'
                }],
                [enbBemTechs.subtractDeps, {
                    from: '?.big.deps.js',
                    what: commonName +'.deps.js',
                    target: '?.deps.js'
                }],

                [enbBemTechs.provideDeps, {
                    node: commonPath,
                    target: commonName +'.yate.deps.js'
                }],
                [enbBemTechs.subtractDeps, {
                    from: '?.yate.big.deps.js',
                    what: commonName +'.yate.deps.js',
                    target: '?.yate.deps.js'
                }]
            ])
        }

        nodeConfig.addTechs([
            [enbBemTechs.files],
            [techs.yateTech,{
                isCommon: isCommonBundle,
                'commonYateObjPath': commonYateObjPath
            }],
            [enbBemTechs.files, {
                filesTarget: '?.yate-client.files',
                dirsTarget: '?.yate-client.dirs',
                depsFile: '?.yate.deps.js'
            }],
            [techs.yateTech, {
                isCommon: isCommonBundle,
                target: '?.client.yate.js',
                targetYate: '?.client',
                filesTarget: '?.yate-client.files',
                commonYateObjPath: commonYateClientObjPath,
                prependJs: 'modules.require("yate", function (yr) {',
                appendJs: '});'
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
