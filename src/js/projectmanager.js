import Project from './project.js';
import ToDo from './todo.js';
import em from '../js/events.js';

const priorityMap = {
	high: 3,
	medium: 2,
	low: 1,
	'': 0,
};

function comparePriority(pri1, pri2) {
	const pri1Val = priorityMap[pri1];
	const pri2Val = priorityMap[pri2];

	return pri1Val < pri2Val;
}

function sortTodos(sortMethod, todos) {
	switch (sortMethod) {
		case 'due':
			todos.sort((a, b) => {
				const aDate = new Date(a.dueDate);
				const bDate = new Date(b.dueDate);

				if (aDate.getTime() === bDate.getTime()) {
					return comparePriority(a.priority, b.priority);
				}

				return aDate > bDate;
			});
			break;

		case 'name':
			todos.sort((a, b) => a.title.toLowerCase() > b.title.toLowerCase());
			break;

		case 'created':
			todos.sort((a, b) => a.created < b.created);
			break;
	}
}

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
			id: this.#defaultProject.id,
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
		// when the user clicks either one of the filter tabs, selects a new sort,
		// enters a query in the search bar, or adds a new todo
		em.on('filterChange', (status, sort, search) => {
			const todos = this.filterTodos(status, search);
			sortTodos(sort, todos);
			em.emit('todosUpdated', todos);
		});

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

			em.emit('newTodoAdded', projects);
		});
	}
}
