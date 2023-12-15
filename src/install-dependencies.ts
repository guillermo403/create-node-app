import inquirer from 'inquirer'
import execute from './execute-command'

const install = async () => {
	return await inquirer.prompt([
		{
			type: 'confirm',
			name: 'installDependencies',
			message: 'Do you want to install the dependencies now?',
			default: true
		}
	])
		.then(({ installDependencies }) => {
			if (!installDependencies) return {}
			return inquirer.prompt([
				{
					type: 'list',
					name: 'packageManager',
					message: 'Select a package manager',
					choices: ['npm', 'yarn', 'pnpm'],
					default: 'npm'
				}
			])
		})
		.then((answer) => {
			if (!('packageManager' in answer)) return
			return execute(`${answer.packageManager} install`)
		})
}

export default install