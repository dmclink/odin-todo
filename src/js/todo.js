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
	#id;
	#projectId;
	#title;
	#description;
	#dueDate;
	#priority;
	#notes;
	#complete;
	#created;

	constructor(
		projectId,
		title,
		description = '',
		dueDate = '',
		priority = '',
		notes = ''
	) {
		if (!title) {
			throw Error('title must not be empty');
		}

		const priorityLower = priority.toLowerCase();
		if (!Object.values(Priority).includes(priorityLower)) {
			throw new TypeError(
				"incorrect input passed to priority, should be one of 'high', 'medium', 'low', ''"
			);
		}

		this.#id = crypto.randomUUID();
		this.#projectId = projectId;
		this.#title = title;
		this.#description = description;
		this.#dueDate = dueDate;
		this.#priority = priorityLower;
		this.#notes = notes;
		this.#complete = false;
		this.#created = new Date();
	}

	get id() {
		return this.#id;
	}

	get projectId() {
		return this.#projectId;
	}

	get created() {
		return this.#created;
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
		const newPriorityLower = newPriority.toLowerCase();
		if (!Object.values(Priority).includes(newPriorityLower)) {
			throw new TypeError(
				"incorrect input passed to priority, should be one of 'high', 'medium', 'low', ''"
			);
		}
		this.#priority = newPriorityLower;
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
			id: this.#id,
			title: this.#title,
			description: this.#description,
			dueDate: this.#dueDate,
			priority: this.#priority,
			notes: this.#notes,
			complete: this.#complete,
		};
	}

	/** Toggles boolean for ToDo's completion status */
	toggleComplete() {
		this.#complete = !this.#complete;
	}

	get complete() {
		return this.#complete;
	}

	get status() {
		return this.#complete ? 'complete' : 'active';
	}
}
