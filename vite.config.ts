import { defineConfig } from 'vite';
import { libInjectCss } from 'vite-plugin-lib-inject-css';
import dts from 'vite-plugin-dts'
import banner from 'vite-plugin-banner'

export default defineConfig({
	plugins: [
		libInjectCss(),
		dts(), 
		banner(`/*
* Project: Bootstrap Notify = v${process.env.npm_package_version}
* Description: Turns standard Bootstrap toasts into "Growl-like" notifications.
* Author: Mouse0270 aka Robert McIntosh
* Fork by w8tcha
* License: MIT License
* Website: https://github.com/w8tcha/bootstrap-growl
*/`)
	],
	build: {
		lib: {
			// Could also be a dictionary or array of multiple entry points
			entry: './src/bootstrap-notify.ts',
			name: 'Notify',
			// the proper extensions will be added
			fileName: 'bootstrap-notify',
			formats: ['es', 'iife', 'umd']
		},
		rollupOptions: {
			external: ['bootstrap'],
			output: {
				globals: {
					bootstrap: 'bootstrap'
				}
			}
		},
		sourcemap: true
	}
});