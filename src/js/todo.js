const Priority = Object.freeze({
	HIGH: 'high',
	MEDIUM: 'medium',
	LOW: 'low',
	NONE: '',
});

/** Constructs a ToDo object
 *
 * @param {string} title - the title of the todo
 * @param {string} description - the description of the todo
 * @param {Date|null} dueDate - the due date for the todo. null signals no due date
 * @param {Priority} priority - the priority for the to do. empty signals no priority set
 * @param {string} notes - any additional notes for the todo
 */
export default class ToDo {
	#title;
	#description;
	#dueDate;
	#priority;
	#notes;

	constructor(title, description, dueDate, priority, notes = '') {
		priority = priority.toLowerCase();
		if (!Object.values(Priority).includes(priority)) {
			throw new TypeError(
				"incorrect input passed to priority, should be one of 'high', 'medium', 'low', ''"
			);
		}
		this.#title = title;
		this.#description = description;
		this.#dueDate = dueDate;
		this.#priority = priority;
		this.#notes = notes;
	}

	set title(newTitle) {
		if (typeof newTitle !== 'string') {
			throw new TypeError('title must be string');
		}
		this.#title = newTitle;
	}
	get title() {
		return this.#title;
	}

	set description(newDescription) {
		if (typeof newDescription !== 'string') {
			throw new TypeError('description must be string');
		}
		this.#description = newDescription;
	}
	get description() {
		return this.#description;
	}

	set dueDate(newDueDate) {
		if (newDueDate !== null && !(newDueDate instanceof Date)) {
			throw new TypeError('dueDate must be Date');
		}
		this.#dueDate = newDueDate;
	}
	get dueDate() {
		return this.#dueDate;
	}

	set priority(newPriority) {
		newPriority = newPriority.toLowerCase();
		if (!Object.values(Priority).includes(newPriority)) {
			throw new TypeError(
				"incorrect input passed to priority, should be one of 'high', 'medium', 'low', ''"
			);
		}
		this.#priority = newPriority;
	}
	get priority() {
		return this.#priority;
	}

	set notes(newNotes) {
		if (typeof newNotes !== 'string') {
			throw new TypeError('notes must be string');
		}
		this.#notes = newNotes;
	}
	get notes() {
		return this.#notes;
	}

	/** Creates an object that is a copy of all properties including private for reading */
	read() {
		return {
			title: this.#title,
			description: this.#description,
			dueDate: this.#dueDate,
			priority: this.#priority,
			notes: this.#notes,
		};
	}
}
