interface TaskInterface {
	_id?: string,
	title?: string,
	description?: string,
	group?: string,
	user?: string,
	completed?: boolean,
	deadline?: Date,
	createdAt: Date,
	updatedAt: Date
}

export default TaskInterface
