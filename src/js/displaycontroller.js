import em from '../js/events.js';
import folderIconSvg from '../img/folder-icon.svg';
import darkIconSvg from '../img/dark-mode-icon.svg';
import lightIconSvg from '../img/light-mode-icon.svg';

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

export default class DisplayController {
	// cached selectors
	#projectsList = document.querySelector('#projects__list');
	#projectsListItemTemplate = document.querySelector('#projects__li-template');
	#darkToggleIcon = document.querySelector('#header__dark-toggle-icon');
	#htmlEl = document.querySelector('html');
	#newToDoModal = document.querySelector('#new-todo');
	#newToDoForm = document.querySelector('#new-todo__form');
	#headerTitle = document.querySelector('#header__title');
	#headerCount = document.querySelector('#header__active-todos');
	#statusFilterBtns = document.querySelectorAll('.filter__button');
	#sortFilterSelectEl = document.querySelector('#filter__todo-select');
	#searchFilterBar = document.querySelector('#search');
	#todoCardTemplate = document.getElementById('todo-card-template');
	#todosContainer = document.getElementById('todos');

	// initial state for filters
	#selectedStatusFilter = 'active';
	#selectedSortFilter = 'due';
	#searchFilterValue = '';

	// state variables
	#defaultProjectId;
	#selectedProject;

	constructor(defaultProjectId) {
		this.#defaultProjectId = defaultProjectId;
		this.#selectedProject = 'default';
	}

	set searchFilter(newVal) {
		this.#searchFilterValue = newVal;
	}

	get searchFilter() {
		return this.#searchFilterValue;
	}

	set sortFilter(newVal) {
		this.#selectedSortFilter = newVal;
	}

	get sortFilter() {
		return this.#selectedSortFilter;
	}

	selectStatusFilter(btn) {
		this.#statusFilterBtns.forEach((btn) => {
			btn.removeAttribute('aria-selected');
		});

		btn.setAttribute('aria-selected', 'true');

		this.#selectedStatusFilter = btn.value;
	}

	get statusFilter() {
		return this.#selectedStatusFilter;
	}

	// brings up the add new todo modal. called when "+ Add Todo" button clicked
	showModal() {
		this.#newToDoModal.showModal();
	}

	// closes the add new todo modal and resets all form fields
	closeModal() {
		this.#newToDoForm.reset();
		this.#newToDoModal.close();
	}

	// returns the form data from the add new todo modal
	getFormData() {
		return new FormData(this.#newToDoForm);
	}

	// updates header title elements with selected project's name and count
	updateHeader() {
		const { name, count } = this.getSelectedNameCount();
		this.#headerTitle.textContent = name;
		this.#headerCount.textContent = count;
	}

	// returns the name and count of the currently selected project
	// based on the data written into the projects list. the projects list
	// fully refreshed whenever changes are made so the data can be considered up to date
	getSelectedNameCount() {
		const id = this.#selectedProject;

		const projectBtns = this.#projectsList.querySelectorAll('.projects__btn');

		const selectedBtn = Array.from(projectBtns).find(
			(btn) => btn.getAttribute('data-id') === id
		);

		const name = selectedBtn.getAttribute('data-name');
		const count = selectedBtn.getAttribute('data-count');

		return { name, count };
	}

	// returns the id of the currently selected project
	selectedProject() {
		return this.#selectedProject === 'default'
			? this.#defaultProjectId
			: this.#selectedProject;
	}

	// stores the id given to the private selected project id field
	// and refresh header with the selected project
	selectProject(id) {
		this.#selectedProject = id;

		this.updateHeader();
	}

	// turns dark mode on or off and swaps the toggle icon
	toggleDarkMode() {
		if (this.#htmlEl.classList.contains('dark')) {
			this.#darkToggleIcon.src = lightIconSvg;
		} else {
			this.#darkToggleIcon.src = darkIconSvg;
		}

		this.#htmlEl.classList.toggle('dark');
	}

	handleProjectButtonClick(e) {
		const clickedBtn = e.currentTarget;
		this.selectProject(clickedBtn.getAttribute('data-id'));

		this.#projectsList.querySelectorAll('.projects__btn').forEach((btn) => {
			btn.removeAttribute('aria-selected');
		});

		clickedBtn.setAttribute('aria-selected', 'true');
	}

	renderProjectsList(projects, initialBuild = false) {
		// wipe projects list so we can fill in with updated count values and projects by appending
		this.#projectsList.innerHTML = '';

		// create a new element for each input project and append it to list
		projects.forEach((project) => {
			const newProjectEl =
				this.#projectsListItemTemplate.content.cloneNode(true);

			newProjectEl.querySelector('.projects__project-name').textContent =
				project.name;

			const todoCount = newProjectEl.querySelector('.projects__todo-count');

			todoCount.textContent = project.count;

			const btn = newProjectEl.querySelector('.projects__btn');
			btn.setAttribute('data-id', project.id || '');
			btn.setAttribute('data-name', project.name || '');
			btn.setAttribute('data-count', project.count || '0');
			if (project.default) {
				btn.setAttribute('data-default-btn', 'true');
			}

			btn.addEventListener('click', this.handleProjectButtonClick.bind(this));

			this.#projectsList.appendChild(newProjectEl);
		});

		// let the 'All Projects' entry have a special icon
		this.#projectsList.firstElementChild.querySelector('.projects__icon').src =
			folderIconSvg;

		if (initialBuild) {
			this.#projectsList.firstElementChild
				.querySelector('.projects__btn')
				.setAttribute('aria-selected', 'true');
		}
	}

	/** Creates an HTML element from the todo-card-template and writes the given data to it
	 *
	 * @param {ToDo} todo - the object that holds the data we will write to the new HTML element
	 * @returns {HTMLElement} - the built todo-card element
	 */
	createTodoCard(todo) {
		const todoCard = this.#todoCardTemplate.content.cloneNode(true);
		todoCard.firstElementChild.setAttribute('data-id', todo.id);
		todoCard.firstElementChild.setAttribute('data-created', todo.created);
		todoCard.firstElementChild.setAttribute('data-project-id', todo.projectId);

		if (todo.complete) {
			todoCard.querySelector('.todo-card__status-checkbox').checked = true;
		}

		todoCard
			.querySelector('.todo-card__status-checkbox')
			.addEventListener('change', () => {
				em.emit('changeTodoStatus', todo.projectId, todo.id);
				this.filterDisplayedTodos();
			});

		todoCard.querySelector('.todo-card__title').textContent = todo.title;
		todoCard.querySelector('.todo-card__due-date').textContent = todo.dueDate;
		todoCard.querySelector('.todo-card__priority').textContent = todo.priority;
		todoCard.querySelector('.todo-card__description').textContent =
			todo.description;
		todoCard.querySelector('.todo-card__notes').textContent = todo.notes;

		return todoCard;
	}

	/** Removes hidden class from a todo if it passes both status and search filter checks.
	 * Assumes hidden class has been applied todo element already.
	 * @param {HTMLElement} todo - the todo element to filter
	 */
	filterTodo(todo) {
		let containsStatus = false;
		if (this.statusFilter === 'all') {
			containsStatus = true;
		} else {
			const todoIsComplete = todo.querySelector(
				'.todo-card__status-checkbox'
			).checked;
			const statusFilterComplete = this.statusFilter === 'complete';

			containsStatus = todoIsComplete === statusFilterComplete;
		}

		let containsSearch = false;
		if (!this.searchFilter) {
			containsSearch = true;
		} else {
			const title = todo.querySelector('.todo-card__title').textContent;
			const description = todo.querySelector(
				'.todo-card__description'
			).textContent;
			const notes = todo.querySelector('.todo-card__notes').textContent;

			if (
				title.includes(this.searchFilter) ||
				description.includes(this.searchFilter) ||
				notes.includes(this.searchFilter)
			) {
				containsSearch = true;
			}
		}

		if (containsSearch && containsStatus) {
			todo.classList.remove('hidden');
		}
	}

	sortTodos(sortMethod, todoNodes) {
		const todos = Array.from(todoNodes);

		switch (sortMethod) {
			case 'due':
				todos.sort((a, b) => {
					const aDate = new Date(
						a.querySelector('.todo-card__due-date').textContent
					);
					const bDate = new Date(
						b.querySelector('.todo-card__due-date').textContent
					);

					if (aDate.getTime() === bDate.getTime()) {
						return comparePriority(
							a.querySelector('.todo-card__priority').textContent,
							b.querySelector('.todo-card__priority').textContent
						);
					}

					return aDate > bDate;
				});
				break;

			case 'name':
				todos.sort(
					(a, b) =>
						a.querySelector('.todo-card__title').textContent.toLowerCase() >
						b.querySelector('.todo-card__title').textContent.toLowerCase()
				);
				break;

			case 'created':
				todos.sort(
					(a, b) =>
						a.getAttribute('data-created') < b.getAttribute('data-created')
				);
				break;
		}

		todos.forEach((todo) => {
			this.#todosContainer.appendChild(todo);
		});
	}

	/** Only shows todos with the completion status given. Optional search param will
	 * further filter todos that contain a match of the input in the title, description,
	 * or notes of the todo. If empty string is entered to search, it is skipped.
	 */
	filterDisplayedTodos() {
		const todos = this.#todosContainer.querySelectorAll('.todo-card');
		todos.forEach((todo) => {
			todo.classList.add('hidden');
		});

		todos.forEach((todo) => {
			this.filterTodo(todo);
		});

		this.sortTodos(this.#selectedSortFilter, todos);
	}

	buildTodos(todos) {
		this.#todosContainer.innerHTML = '';
		for (const todo of todos) {
			const todoCard = this.createTodoCard(todo);
			this.#todosContainer.appendChild(todoCard);
		}

		this.filterDisplayedTodos();
	}

	bindEvents() {
		document.querySelector('#new-todo__add').addEventListener('click', () => {
			const formData = this.getFormData();
			// check required name field has a value
			if (!formData.get('name')) {
				document
					.querySelector('#new-todo__name')
					.setCustomValidity('Name is required');
				document.querySelector('#new-todo__name').reportValidity();
				return;
			}

			const projectId = this.selectedProject();

			em.emit('addTodo', projectId, formData);
		});

		// bind event for dark mode toggle button
		document
			.querySelector('#header__dark-toggle')
			.addEventListener('click', () => {
				this.toggleDarkMode();
			});

		// bind event to open modal
		document.querySelector('#header__add-btn').addEventListener('click', () => {
			this.showModal();
		});

		// bind event to close modal on cancel button click
		document
			.querySelector('#new-todo__cancel')
			.addEventListener('click', () => {
				this.closeModal();
			});

		// bind event for selecting status filters
		this.#statusFilterBtns.forEach((btn) => {
			btn.addEventListener('click', () => {
				this.selectStatusFilter(btn);
				this.filterDisplayedTodos();
			});
		});

		// bind event listener for selecting sort filters
		this.#sortFilterSelectEl.addEventListener('change', (e) => {
			this.sortFilter = e.target.value;
			this.filterDisplayedTodos();
		});

		// event listener for search bar inputs
		this.#searchFilterBar.addEventListener('input', (e) => {
			this.searchFilter = e.target.value;

			this.filterDisplayedTodos();
		});

		em.on('todosUpdated', this.buildTodos.bind(this));

		em.on('newTodoAdded', (projects) => {
			this.renderProjectsList(projects);
			this.updateHeader();
			this.closeModal();
			this.filterDisplayedTodos();
		});
	}
}
