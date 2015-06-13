var path = require('path');
var bundlesPath = 'desktop.bundles';
var commonName = 'common';
var commonPath = path.join(bundlesPath, commonName);
var commonYatePath = path.resolve(path.join(bundlesPath, commonName));
var commonYateObjPath = [commonYatePath, 'common.yate.obj'].join('/');
var commonYateClientObjPath = [commonYatePath, 'common.client.yate.obj'].join('/');

module.exports = function(config) {
    config.nodes('desktop.bundles/*');

    config.nodeMask(/desktop\.bundles\/.*/, function(nodeConfig) {
        if (nodeConfig.getPath() === commonPath) {
            nodeConfig.addTechs([
                new (require('enb/techs/deps-old'))(),

                // Сборка всех Yate шаблонов
                new (require('./techs/yate.js'))({
                    'isCommon': true
                }),

                // Сборка только клиентских Yate шаблонов
                new (require('enb/techs/bemdecl-from-deps-by-tech'))({ depsFiles: '?.deps.js', target: '?.yate.bemdecl.js', sourceTech: 'js', destTech: 'yate-client' }),
                new (require('enb/techs/deps-old'))({ bemdeclTarget: '?.yate.bemdecl.js', depsTarget: '?.yate.deps.js' }),
                new (require('enb/techs/files'))({filesTarget: '?.yate-client.files', dirsTarget: '?.yate-client.dirs', depsTarget: '?.yate.deps.js'}),
                new (require('./techs/yate.js'))({
                    isCommon: true,
                    target: '?.client.yate.js',
                    targetYate: '?.client',
                    filesTarget: '?.yate-client.files',
                    prependJs: 'modules.require("yate", function (yr) {',
                    appendJs: '});'
                })
            ]);
        } else {
            nodeConfig.addTechs([
                // Вычитание common-бандл из page-бандл
                new (require('enb/techs/deps-old'))({ depsTarget: '?.big.deps.js' }),
                new (require('enb/techs/deps-provider'))({ sourceNodePath: commonPath, depsTarget: commonName+'.deps.js' }),
                new (require('enb/techs/deps-subtract'))({ subtractWhatTarget: commonName+'.deps.js', subtractFromTarget: '?.big.deps.js', depsTarget: '?.deps.js' }),

                // Сборка всех Yate шаблонов + импорт common
                new (require('./techs/yate.js'))({
                    'commonYateObjPath': commonYateObjPath
                }),

                // Сборка только клиентских Yate шаблонов + импорт клиентского common
                new (require('enb/techs/bemdecl-from-deps-by-tech'))({ depsFiles: '?.big.deps.js', target: '?.yate.bemdecl.js', sourceTech: 'js', destTech: 'yate-client' }),
                new (require('enb/techs/deps-old'))({ bemdeclTarget: '?.yate.bemdecl.js', depsTarget: '?.big.yate.deps.js' }),
                new (require('enb/techs/deps-provider'))({ sourceNodePath: commonPath, sourceTarget: commonName+'.yate.deps.js', depsTarget: commonName+'.yate.deps.js' }),
                new (require('enb/techs/deps-subtract'))({ subtractWhatTarget: commonName+'.yate.deps.js', subtractFromTarget: '?.big.yate.deps.js', depsTarget: '?.yate.deps.js' }),
                new (require('enb/techs/files'))({filesTarget: '?.yate-client.files', dirsTarget: '?.yate-client.dirs', depsTarget: '?.yate.deps.js'}),
                new (require('./techs/yate.js'))({
                    target: '?.client.yate.js',
                    targetYate: '?.client',
                    filesTarget: '?.yate-client.files',
                    commonYateObjPath: commonYateClientObjPath,
                    prependJs: 'modules.require("yate", function (yr) {',
                    appendJs: '});'
                })
            ]);
        }

        nodeConfig.addTechs([
            new (require('enb/techs/file-provider'))({ target: '?.bemdecl.js' }),
            new (require('enb/techs/levels'))({ levels: getLevels(config) }),
            new (require('enb/techs/files'))(),
            new (require('enb/techs/js'))(),
            new (require('enb/techs/vanilla-js'))(),
            new (require('enb-stylus/techs/css-stylus-with-nib'))({
                'target': '?.css',
                'variables': {
                    'datauri': require('stylus').url()
                }
            }),
            new (require('enb/techs/file-merge'))({ sources: [ '?.vanilla.js', '?.js', '?.client.yate.js' ], target: '?.merge.js' })
        ]);

        nodeConfig.addTargets([
            '?.vanilla.js', '?.js', '?.merge.js', '_?.js', '?.css', '_?.css', '?.yate.js', '?.client.yate.js'
        ]);
    });

    config.mode('development', function() {
        config.nodeMask(/desktop\.bundles\/.*/, function(nodeConfig) {
            nodeConfig.addTechs([
                new (require('enb/techs/js-expand-includes'))({ sourceTarget: '?.merge.js', destTarget: '_?.js' }),
                new (require('enb/techs/file-copy'))({ sourceTarget: '?.css', destTarget: '_?.css' })
            ]);
        });
    });

    config.mode('production', function() {
        config.nodeMask(/desktop\.bundles\/.*/, function(nodeConfig) {
            nodeConfig.addTechs([
                new (require('enb/techs/js-expand-includes'))({ sourceTarget: '?.merge.js', destTarget: '?.include.js' }),
                new (require('enb/techs/borschik'))({ sourceTarget: '?.include.js', destTarget: '_?.js' }),
                new (require('enb/techs/borschik'))({ sourceTarget: '?.css', destTarget: '_?.css' })
            ]);
        });
    });
};

function getLevels(config) {
    return [
        'libs/bem-core/common.blocks',
        'libs/bem-core/desktop.blocks',
        'desktop.pages',
        'desktop.libs',
        'desktop.blocks'
    ].map(function(level) {
        return config.resolvePath(level);
    });
}
