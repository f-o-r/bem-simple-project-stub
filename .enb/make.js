var path = require('path');
var bundlesPath = 'desktop.bundles';
var commonName = 'common';
var commonPath = path.join(bundlesPath, commonName);
var commonYateObjPath = path.resolve(path.join(bundlesPath, commonName));

commonYateObjPath = [commonYateObjPath, 'common.yate.obj'].join('/');

module.exports = function(config) {
    config.nodes('desktop.bundles/*');

    config.nodeMask(/desktop\.bundles\/.*/, function(nodeConfig) {
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
            new (require('enb/techs/file-merge'))({ sources: [ '?.vanilla.js', '?.js', '?.yate.js' ], target: '?.merge.js' })
        ]);

        if (nodeConfig.getPath() === commonPath) {
            nodeConfig.addTechs([
                new (require('enb/techs/deps-old'))(),
                new (require('./techs/yate.js'))({
                    'isCommon': true
                })
            ]);
        } else {
            nodeConfig.addTechs([
                new (require('./techs/yate.js'))({
                    'commonYateObjPath': commonYateObjPath
                }),
                new (require('enb/techs/deps-old'))({ depsTarget: '?.big.deps.js' }),
                new (require('enb/techs/deps-provider'))({ sourceNodePath: commonPath, depsTarget: commonName+'.deps.js' }),
                new (require('enb/techs/deps-subtract'))({ subtractWhatTarget: commonName+'.deps.js', subtractFromTarget: '?.big.deps.js', depsTarget: '?.deps.js' })
            ]);
        }

        nodeConfig.addTargets([
            '?.vanilla.js', '?.js', '?.merge.js', '_?.js', '?.css', '_?.css', '?.yate.js'
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
        'desktop.libs',
        'desktop.blocks'
    ].map(function(level) {
        return config.resolvePath(level);
    });
}
