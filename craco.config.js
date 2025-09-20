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
	jest: {
		configure: (jestConfig) => {
			// Применяем настройки из jest.config.js
			return {
				...jestConfig,
				transformIgnorePatterns: [
					'/node_modules/(?!(react-dnd|react-dnd-html5-backend|@react-dnd|@radix-ui|lucide-react|@testing-library|react-dnd-core|@elevenlabs|react-router-dom|react-router|@hookform|react-hook-form|framer-motion|embla-carousel|cmdk|sonner|vaul|recharts|next-themes|input-otp|jwt-decode|web-vitals|zod|zustand|class-variance-authority|clsx|tailwind-merge|date-fns|form-data|react-dom|react|axios)/)'
				],
				moduleNameMapper: {
					...jestConfig.moduleNameMapper,
					'^generated-src/(.*)$': '<rootDir>/tests/mocks/generated-client.ts',
					'\\.(css|less|scss|sass)$': 'identity-obj-proxy',
					'\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': 'identity-obj-proxy',
					'^react-dnd$': '<rootDir>/node_modules/react-dnd/dist/index.js',
					'^react-dnd-html5-backend$': '<rootDir>/node_modules/react-dnd-html5-backend/dist/index.js',
					'^(\\.{1,2}/.*)\\.js$': '$1',
				},
				coverageThreshold: {
					global: {
						branches: 30,
						functions: 30,
						lines: 30,
						statements: 30
					}
				}
			};
		}
	}
}; 