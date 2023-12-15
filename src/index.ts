#!/usr/bin/env node

import checkLastVersion from "./check-version"
import { packageNotFound } from "./enums"
import updatePakageJson from "./update-package"
import askForPackages from "./show-prompt"
import chalk from 'chalk'
import boxen from 'boxen'
import install from "./install-dependencies"

const getLastVersions = async (packages: any) => {	
	const versions: string[] = []

	for await (const p of packages) {
		const v = await checkLastVersion(p)
		if (v === packageNotFound) continue
		versions.push(`${p}->${v}`)
	}

	return versions
}

const main = async () => {
	const { appName, dependencies: packages, devDependencies: devPackages, scripts } = await askForPackages()
	const versions = await getLastVersions([packages, devPackages].flat())

	const dependencies: Record<string, string> = {}
	const devDependencies: Record<string, string> = {}

	for (const packageVersion of versions) {
		const [pack, version] = packageVersion.split('->')
		if (packages.includes(pack)) dependencies[pack] = `^${version}`
		else if (devPackages.includes(pack))	devDependencies[pack] = `^${version}`
	}
	
	updatePakageJson({ dependencies, devDependencies, scripts, appName })

	await install()

	const boxenOptions = {
		padding: 1,
		margin: 1
	}
	let text = `npm run ${chalk.blue('lint')}`
	console.log(boxen(text, boxenOptions))
}

main()