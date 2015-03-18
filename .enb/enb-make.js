module.exports = function(config) {
    config.nodes('desktop.bundles/*');


    config.nodeMask(/desktop\.bundles\/.*/, function(nodeConfig) {
        nodeConfig.addTechs([
            new (require('enb/techs/file-provider'))({ target: '?.bemdecl.js' }),
            new (require('enb/techs/levels'))({ levels: getLevels(config) }),
            new (require('enb/techs/deps-old'))(),
            new (require('enb/techs/files'))(),
            new (require('enb/techs/js'))(),
            new (require('enb/techs/vanilla-js'))(),
            new (require('enb-stylus/techs/css-stylus-with-nib'))({
                'target': '?.css',
                'variables': {
                    'datauri': require('stylus').url()
                }
            }),
            new (require('enb/techs/file-merge'))({ sources: [ '?.vanilla.js', '?.js' ], target: '?.merge.js' })
        ]);

        nodeConfig.addTargets([
            '?.vanilla.js', '?.js', '?.merge.js', '_?.js', '?.css', '_?.css'
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
