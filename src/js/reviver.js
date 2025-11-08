import ToDo from './todo.js';
import Project from './project.js';
import ProjectManager from './projectmanager.js';

function isProjectObj(v) {
	return typeof v === 'object' && v !== null && v.objectType === 'Project';
}

function isToDoObj(v) {
	return typeof v === 'object' && v !== null && v.objectType === 'ToDo';
}

function isProjectsArr(k, v) {
	return k === 'projects' && typeof v === 'object' && v !== null;
}

function isProjectManagerObj(k, v) {
	return (
		k === '' &&
		typeof v === 'object' &&
		v !== null &&
		v.objectType === 'ProjectManager'
	);
}

export default function reviver(k, v) {
	if (isProjectObj(v)) {
		return new Project(v.name, v.todos, v.id, v.count);
	}

	if (isToDoObj(v)) {
		return new ToDo(
			v.projectId,
			v.title,
			v.description,
			v.dueDate,
			v.priority,
			v.notes,
			v.id,
			v.complete,
			v.created
		);
	}

	if (isProjectsArr(k, v)) {
		const deserializedMap = new Map(v);

		return deserializedMap;
	}

	if (isProjectManagerObj(k, v)) {
		const defaultProject = v.projects.get(v.defaultProject);
		return new ProjectManager(v.projects, defaultProject);
	}

	return v;
}
