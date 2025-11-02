import em from '../js/events.js';
import folderIconSvg from '../img/folder-icon.svg';
import darkIconSvg from '../img/dark-mode-icon.svg';
import lightIconSvg from '../img/light-mode-icon.svg';

function debounce(fn, delay = 300) {
	let timeoutId;

	return function debouncedFunc(...args) {
		clearTimeout(timeoutId);

		timeoutId = setTimeout(() => {
			fn.apply(this, args);
		}, delay);
	};
}

function emitFilterChange(statusFilter, sortFilter, searchFilter) {
	em.emit('filterChange', statusFilter, sortFilter, searchFilter);
}

const debouncedEmitFilterChange = debounce(emitFilterChange);

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

	#selectedStatusFilter = 'active';
	#selectedSortFilter = 'due';
	#searchFilterValue = '';

	// 'All Projects' has an empty string for id, this will be the default selection on loading
	#selectedProject = '';

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
		return this.#selectedProject;
	}

	selectProject(id) {
		this.#selectedProject = id;
		// TODO: update highlight class on projects list

		this.updateHeader();
	}

	toggleDarkMode() {
		if (this.#htmlEl.classList.contains('dark')) {
			this.#darkToggleIcon.src = lightIconSvg;
		} else {
			this.#darkToggleIcon.src = darkIconSvg;
		}

		this.#htmlEl.classList.toggle('dark');
	}

	renderProjectsList(projects) {
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

			btn.addEventListener('click', () => {
				this.selectProject(btn.getAttribute('data-id'));
			});

			this.#projectsList.appendChild(newProjectEl);
		});

		// let the 'All Projects' entry have a special icon
		this.#projectsList.firstElementChild.querySelector('.projects__icon').src =
			folderIconSvg;
	}

	createTodoCard(todo) {
		const todoCard = this.#todoCardTemplate.content.cloneNode(true);
		todoCard.querySelector('.todo-card__title').textContent = todo.title;
		todoCard.querySelector('.todo-card__due-date').textContent = todo.dueDate;
		todoCard.querySelector('.todo-card__priority').textContent = todo.priority;
		todoCard.querySelector('.todo-card__description').textContent =
			todo.description;
		todoCard.querySelector('.todo-card__notes').textContent = todo.notes;

		return todoCard;
	}

	displayTodos(todos) {
		this.#todosContainer.innerHTML = '';
		for (const todo of todos) {
			const todoCard = this.createTodoCard(todo);
			this.#todosContainer.appendChild(todoCard);
		}
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
				debouncedEmitFilterChange(
					this.statusFilter,
					this.sortFilter,
					this.searchFilter
				);
			});
		});

		// bind event listener for selecting sort filters
		this.#sortFilterSelectEl.addEventListener('change', (e) => {
			this.sortFilter = e.target.value;
			debouncedEmitFilterChange(
				this.statusFilter,
				this.sortFilter,
				this.searchFilter
			);
		});

		// event listener for search bar inputs
		this.#searchFilterBar.addEventListener('input', (e) => {
			this.searchFilter = e.target.value;

			debouncedEmitFilterChange(
				this.statusFilter,
				this.sortFilter,
				this.searchFilter
			);
		});

		em.on('todosUpdated', this.displayTodos.bind(this));

		em.on('newTodoAdded', (projects) => {
			this.renderProjectsList(projects);
			this.updateHeader();
			this.closeModal();
			debouncedEmitFilterChange(
				this.statusFilter,
				this.sortFilter,
				this.searchFilter
			);
		});
	}
}
