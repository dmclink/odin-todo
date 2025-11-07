import ToDo from './todo.js';

export default class Project {
	#name;
	#todos;
	#id;
	#count;

	constructor(name) {
		if (typeof name !== 'string') {
			throw new Error('Name must be string');
		}

		this.#name = name;
		this.#todos = [];
		this.#id = crypto.randomUUID();
		this.#count = 0;
	}

	/** Adds new todo to this project's list
	 *
	 * @param {ToDo} newTodo - the new todo to add to the list
	 */
	add(newTodo) {
		if (!(newTodo instanceof ToDo)) {
			throw new TypeError('projects only accepts ToDo items');
		}
		this.#todos.push(newTodo);
		this.#count++;
	}

	/** Removes the todo from this project's list that has a matching id with input
	 *
	 * @param {string} id - the id of the todo we want to delete
	 */
	remove(id) {
		const idx = this.#todos.find((todo) => todo.id === id);
		if (!idx) {
			throw new Error('non existing id passed to remove');
		}

		const [removedTodo] = this.#todos.splice(idx, 1);
		if (!removedTodo.complete) {
			this.#count--;
		}
	}

	/** Toggles completion status for the todo with the given id and updates
	 * the project's count depending on its completion status.
	 *
	 * @param {string} id - the id of the todo to lookup and toggle status
	 */
	toggleComplete(id) {
		const todo = this.getTodo(id);

		if (!todo) {
			throw new Error('no todo with given id:', id);
		}

		if (todo.complete) {
			this.#count++;
		} else {
			this.#count--;
		}

		todo.toggleComplete();
	}

	/** Returns the ToDo object of the todo with matching id. IDs should
	 * be unique and only one should match. May return undefined if no matching
	 * todo is in this project.
	 *
	 * @param {string} id - ID of todo to lookup and match
	 * @returns {ToDo|undefined} - object of the found todo
	 */
	getTodo(id) {
		return this.#todos.find((todo) => todo.id === id);
	}

	get id() {
		return this.#id;
	}

	get name() {
		return this.#name;
	}

	set name(newName) {
		if (!newName) {
			throw new Error('cannot set to empty name');
		}

		this.#name = newName;
	}

	get count() {
		return this.#count;
	}

	getTodos() {
		return [...this.#todos];
	}
}
