import fs from 'node:fs'
import { join } from 'node:path'

const updatePakageJson = (
	{ dependencies, devDependencies, scripts, appName }:
	{
		appName: string,
		dependencies: Record<string, string>,
		devDependencies: Record<string, string>,
		scripts: Record<string, string>
	}
) => {
	const PACKAGEJSON_PATH = join(process.cwd(), 'package.json')

	let packageJson
	try {
		packageJson = JSON.parse(fs.readFileSync(PACKAGEJSON_PATH, 'utf-8'))
	} catch (_) {
		packageJson = {
			name: appName,
			version: "1.0.0",
			description: "",
			main: "index.js",
			scripts,
			keywords: [],
			author: "",
			license: "ISC"
		}
	}
	packageJson.dependencies = dependencies
	packageJson.devDependencies = devDependencies
	fs.writeFileSync(PACKAGEJSON_PATH, JSON.stringify(packageJson, null, 2))
}

export default updatePakageJson