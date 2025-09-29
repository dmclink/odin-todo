import Project from './project.js';

class ProjectManager {
	#projects;
	#defaultProject;

	constructor() {
		const defaultName = 'default';
		const newDefaultProject = new Project(defaultName);
		const newDefaultId = newDefaultProject.id();
		this.#defaultProject = newDefaultProject;
		this.#projects = new Map();

		this.#projects.set(newDefaultId, newDefaultProject);
	}

	add(name) {
		const newProject = new Project(name);
		const newId = newProject.id();

		this.#projects.set(newId, newProject);
	}

	remove(id) {
		if (!this.#projects.has(id)) {
			throw new Error(`no project at ${id} exists`);
		}

		this.#projects.delete(id);
	}
}
