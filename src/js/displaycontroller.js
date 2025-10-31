import folderIconSvg from '../img/folder-icon.svg';

export default class DisplayController {
	#projectsList = document.querySelector('#projects__list');
	#projectsListItemTemplate = document.querySelector('#projects__li-template');

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
