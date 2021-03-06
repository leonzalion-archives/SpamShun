import { builtinModules } from 'node:module';
import path from 'node:path';
import process from 'node:process';
import fs from 'node:fs';
import type { UserConfig } from 'vite';
import desm, { join } from 'desm';

const { chrome } = JSON.parse(
	fs
		.readFileSync(join(import.meta.url, '../../electron-vendors.config.json'))
		.toString()
) as { chrome: string; node: string };

const PACKAGE_ROOT = desm(import.meta.url);

const config: UserConfig = {
	mode: process.env.MODE,
	root: PACKAGE_ROOT,
	envDir: process.cwd(),
	resolve: {
		alias: {
			'~p': path.join(PACKAGE_ROOT, 'src'),
		},
	},
	build: {
		sourcemap: 'inline',
		target: `chrome${chrome}`,
		outDir: 'dist',
		assetsDir: '.',
		minify: process.env.MODE !== 'development',
		lib: {
			entry: 'src/index.ts',
			formats: ['cjs'],
		},
		rollupOptions: {
			external: [
				'electron',
				'word-list',
				...builtinModules,
				...builtinModules.map((moduleName) => `node:${moduleName}`),
			],
			output: {
				entryFileNames: '[name].cjs',
			},
		},
		emptyOutDir: true,
		brotliSize: false,
	},
};

export default config;
