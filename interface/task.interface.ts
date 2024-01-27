interface TaskInterface {
	_id?: string,
	title?: string,
	description?: string,
	group?: string,
	user?: string,
	completed?: boolean,
	deadline?: Date
}

export default TaskInterface
