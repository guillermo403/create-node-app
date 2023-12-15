import inquirer, { type Question } from 'inquirer'
import fs from 'node:fs'
import { join } from 'node:path'

const questions: Question[] = [
	{
		type: 'input',
		name: 'name',
		message: "What's the name of your project?",
		default: 'node-app',
		filter: (input) => {
			if (input.trim() === '') return 'node-app'
			return input.toLowerCase().replace(/ /g, '-')
		}
	},
	{
		type: 'confirm',
		name: 'typescript',
		message: "Would you like to use Typescript?",
		default: true
	},
	{
		type: 'confirm',
		name: 'express',
		message: "Would you like to use Express?",
		default: true
	},
	{
		type: 'confirm',
		name: 'eslint',
		message: "Would you like to use Eslint to reinforce code style?",
		default: true
	}
]

export default async (): Promise<{
	appName: string,
	dependencies: string[],
	devDependencies: string[],
	scripts: Record<string, string>
}> => {
	const answers = await inquirer.prompt(questions)
	
	const { typescript, express, eslint } = answers
	const dependencies: string[] = []
	const devDependencies: string[] = []
	const scripts: Record<string, string> = {}

	const structure: Record<string, any> = {
		name: answers.name,
		'index': '',
		src: {
			routes: {
				'index': ''
			},
			controllers: {
				'index': ''
			},
		},
		'README.md': ''
	}
	
	if (typescript) {
		structure.ext = 'ts'
		devDependencies.push('typescript', '@types/node')
		structure['tsconfig.json'] = ''
		scripts.build = 'tsc'
		scripts.start = 'node dist/index.js'
	} else scripts.start = 'node index.js'
	if (express) {
		devDependencies.push('express')
		if (typescript) devDependencies.push('@types/express')
	}
	if (eslint) {
		const eslintConfig = {
			env: {
				browser: true,
				commonjs: true,
				es2021: true
			},
			extends: 'standard',
			overrides: [
				{
					env: {
						node: true
					},
					files: [
						'.eslintrc.{js,cjs}'
					],
					parserOptions: {
						sourceType: 'script'
					}
				}
			],
			parserOptions: {
				ecmaVersion: 'latest'
			},
			rules: {
			}
		}
		devDependencies.push('eslint', 'eslint-config-standard', 'eslint-plugin-import', 'eslint-plugin-n', 'eslint-plugin-promise')
		structure['.eslintrc.js'] = 'module.exports = ' + JSON.stringify(eslintConfig, null, 2)
		scripts.lint = 'eslint . --fix'
	}
	
	createStructure(structure, null)

	return { appName: answers.name, dependencies, devDependencies, scripts }
}

function createStructure (structure: Record<string, any>, path: string | null) {
	if (!path) {
		path = join(process.cwd(), structure.name)
		fs.mkdirSync(path, { recursive: true })
		process.chdir(path)
	}
	
	let ext = structure.ext ?? 'js'
	for (const key in structure) {
		if (key === 'name') continue
		if (key === 'ext') continue
		if (typeof structure[key] === 'object') {
			fs.mkdirSync(`${path}/${key}`)
			createStructure(structure[key], `${path}/${key}`)
		} else {
			const nameParts = key.split('.')
			const hasExt = nameParts.length > 1

			hasExt
				? fs.writeFileSync(`${path}/${key}`, structure[key])
				: fs.writeFileSync(`${path}/${key}.${ext}`, structure[key])
		}
	}
}