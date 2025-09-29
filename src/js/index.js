import ToDo from './todo.js';

const todo1 = new ToDo(
	'new todo',
	'new description',
	new Date(Date.now()),
	'low'
);

console.log(todo1.read());
