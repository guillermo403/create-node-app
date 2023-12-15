import { exec } from 'node:child_process'
import { promisify } from 'node:util'
import { packageNotFound } from './enums'
const execAsync = promisify(exec)

const checkLastVersion = (p: string) => {
	return execAsync(`npm view ${p} version`)
		.then(({stdout}) => stdout.trim())
		.catch(() => packageNotFound)
}

export default checkLastVersion
