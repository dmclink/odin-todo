import folderIconSvg from '../img/folder-icon.svg';
import darkIconSvg from '../img/dark-mode-icon.svg';
import lightIconSvg from '../img/light-mode-icon.svg';

export default class DisplayController {
	#projectsList = document.querySelector('#projects__list');
	#projectsListItemTemplate = document.querySelector('#projects__li-template');
	#darkToggleIcon = document.querySelector('#header__dark-toggle-icon');
	#htmlEl = document.querySelector('html');
	#newToDoModal = document.querySelector('#new-todo');
	#newToDoForm = document.querySelector('#new-todo__form');
	#selectedProject;

	showModal() {
		this.#newToDoModal.showModal();
	}

	closeModal() {
		this.#newToDoForm.reset();
		this.#newToDoModal.close();
	}

	getFormData() {
		return new FormData(this.#newToDoForm);
		// TODO:
	}

	selectProject(id) {
		this.#selectedProject = id;
		// TODO: update highlight class on projects list
		// TODO: update name and count in header
	}

	selectedProject() {
		return this.#selectedProject;
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

			newProjectEl.querySelector('.projects__todo-count').textContent =
				project.count;

			newProjectEl['data-id'] = project.id;

			this.#projectsList.appendChild(newProjectEl);
		});
		console.log(
			this.#projectsList.firstElementChild.querySelector('.projects__icon').src
		);
		// let the 'All Projects' entry have a special icon
		this.#projectsList.firstElementChild.querySelector('.projects__icon').src =
			folderIconSvg;
	}
}
