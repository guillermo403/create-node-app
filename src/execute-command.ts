import { exec } from 'node:child_process'
import { promisify } from 'node:util'
const execAsync = promisify(exec)

const execute = async (command: string) => {
	const { stdout } = await execAsync(command)
	return stdout
}

export default execute