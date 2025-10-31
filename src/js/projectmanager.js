import Project from './project.js';

export default class ProjectManager {
	#projects;
	#defaultProject;

	constructor() {
		const defaultName = 'default';
		const newDefaultProject = new Project(defaultName);
		const newDefaultId = newDefaultProject.id;
		this.#defaultProject = newDefaultProject;
		this.#projects = new Map();

		this.#projects.set(newDefaultId, newDefaultProject);
	}

	addProject(name) {
		const newProject = new Project(name);
		const newId = newProject.id;

		this.#projects.set(newId, newProject);
	}

	remove(id) {
		if (!this.#projects.has(id)) {
			throw new Error(`no project at ${id} exists`);
		}

		this.#projects.delete(id);
	}

	/** Returns project with inputted id. If no project exists or no projectId is inputted,
	 * returns the default project.
	 *
	 * @param {string|undefined} projectId - the project id to search
	 * @returns
	 */
	getProject(projectId = '') {
		if (!projectId || !this.#projects.has(projectId)) {
			return this.#defaultProject;
		}

		return this.#projects.get(projectId);
	}

	getProjects() {
		const result = {};
		for (const [key, val] of this.#projects.entries()) {
			result[key] = val;
		}

		return result;
	}

	/** Sets default project to the project stored at projectId. Throws error if none exist.
	 *
	 * @param {string} projectId - the project id of the new default project
	 */
	setDefaultProject(projectId) {
		if (!projectId || !this.#projects.has(projectId)) {
			throw new Error(`no project at ${projectId} exists`);
		}

		this.#defaultProject = this.#projects.get(projectId);
	}

	/** Gets full list of todos from every project */
	getAllTodos() {
		const result = [];
		Object.values(this.getProjects()).forEach((project) => {
			result.push(...project.getTodos());
		});

		return result;
	}

	/** Only shows todos with the completion status given. Optional search param will
	 * further filter todos that contain a match of the input in the title, description,
	 * or notes of the todo
	 *
	 * @param {'all'|'complete'|'active'} status - completion status of todos to show
	 * @param {*} search
	 */
	filterTodos(status, search = '') {
		let todos = this.getAllTodos();

		if (status !== 'all') {
			todos = todos.filter((todo) => todo.status === status);
		}

		if (search) {
			todos = todos.filter(
				(todo) =>
					todo.title.includes(search) ||
					todo.description.includes(search) ||
					todo.notes.includes(search)
			);
		}

		return todos;
	}
}
