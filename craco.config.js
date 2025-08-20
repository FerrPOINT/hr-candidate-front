const path = require('path');
const ModuleScopePlugin = require('react-dev-utils/ModuleScopePlugin');

module.exports = {
	webpack: {
		configure: (config) => {
			// Remove CRA's ModuleScopePlugin to allow imports outside src
			const isModuleScope = (p) => {
				const name = p && (p.constructor && p.constructor.name);
				return p instanceof ModuleScopePlugin || name === 'ModuleScopePlugin';
			};
			if (config.resolve && Array.isArray(config.resolve.plugins)) {
				config.resolve.plugins = config.resolve.plugins.filter((p) => !isModuleScope(p));
			}

			// Ensure babel-loader transpiles files from generated-src and new-design
			const generatedPath = path.resolve(__dirname, 'generated-src');
			const newDesignPath = path.resolve(__dirname, 'new-design');
			if (config.module && Array.isArray(config.module.rules)) {
				config.module.rules.forEach((rule) => {
					if (rule.oneOf && Array.isArray(rule.oneOf)) {
						rule.oneOf.forEach((one) => {
							// Generic include extension
							if (one.include) {
								if (Array.isArray(one.include)) {
									if (!one.include.includes(generatedPath)) one.include.push(generatedPath);
									if (!one.include.includes(newDesignPath)) one.include.push(newDesignPath);
								} else {
									one.include = [one.include, generatedPath, newDesignPath];
								}
							}

							// Specifically ensure babel-loader includes new-design
							if (one.loader && typeof one.loader === 'string' && one.loader.includes('babel-loader')) {
								if (one.include) {
									if (Array.isArray(one.include)) {
										if (!one.include.includes(newDesignPath)) one.include.push(newDesignPath);
										if (!one.include.includes(generatedPath)) one.include.push(generatedPath);
									} else {
										one.include = [one.include, generatedPath, newDesignPath];
									}
								} else {
									one.include = [generatedPath, newDesignPath];
								}
							}
						});
					}
				});
			}

			// Optional alias to shorten imports
			config.resolve = config.resolve || {};
			config.resolve.alias = {
				...(config.resolve.alias || {}),
				'@generated': generatedPath,
			};

			return config;
		},
	},
}; 