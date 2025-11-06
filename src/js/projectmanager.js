import Project from './project.js';
import ToDo from './todo.js';
import em from '../js/events.js';

export default class ProjectManager {
	#projects;
	#defaultProject;

	constructor() {
		const defaultName = 'Todos';
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

	changeName(id, newName) {
		this.getProject(id).name = newName;
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

	listProjectNamesAndCounts() {
		const result = [];
		let totalCount = 0;
		Object.values(this.getProjects()).forEach((project) => {
			result.push({ id: project.id, name: project.name, count: project.count });
			totalCount += project.count;
		});

		result.unshift({
			id: 'default',
			name: 'All Projects',
			count: totalCount,
			default: true,
		});

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

		const projects = this.listProjectNamesAndCounts();
		em.emit('newTodoAdded', projects);
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
	 * or notes of the todo. If empty string is entered to search, it is skipped.
	 *
	 * @param {'all'|'complete'|'active'} status - completion status of todos to show
	 * @param {string} search - find todos containing this string
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

	bindEvents() {
		// when a user clicks the add todo button in the add todo modal
		em.on('addTodo', (projectId, formData) => {
			this.getProject(projectId).add(
				new ToDo(
					projectId,
					formData.get('name'),
					formData.get('description'),
					formData.get('due-date'),
					formData.get('priority'),
					formData.get('notes')
				)
			);

			const projects = this.listProjectNamesAndCounts();

			const todos = this.getAllTodos();

			em.emit('todosUpdated', todos);
			em.emit('newTodoAdded', projects);
		});

		// emits whenever a todo's status checkbox is clicked
		em.on('changeTodoStatus', (projectId, todoId) => {
			this.getProject(projectId).toggleComplete(todoId);

			const projects = this.listProjectNamesAndCounts();
			em.emit('newTodoAdded', projects);
		});

		em.on('changeName', (projectId, newName) => {
			this.changeName(projectId, newName);

			const projects = this.listProjectNamesAndCounts();
			em.emit('newTodoAdded', projects);
		});

		em.on('deleteProject', (id) => {
			this.remove(id);

			const projects = this.listProjectNamesAndCounts();
			em.emit('newTodoAdded', projects);
		});

		em.on('setDefault', (id) => {
			// this function call will result in emit 'newTodoAdded' event refreshing projects
			// on the frontend
			this.setDefaultProject(id);
		});

		em.on('newProject', (name) => {
			this.addProject(name);

			const projects = this.listProjectNamesAndCounts();
			em.emit('newTodoAdded', projects);
		});
	}
}
