import ToDo from ('./todo.js')

class Project {
  #todos;

  constructor() {
    this.#todos = [];
  }

  add(newTodo) {
    if (!(newTodo instanceof ToDo)) {
      throw new TypeError('projects only accepts ToDo items')
    }
    this.#todos.push(newTodo);
  }

  remove(id) {
    const idx = this.#todos.find((todo) => todo.id === id);
    if (!idx) {
      throw new Error('non existing id passed to remove');
    }

    this.#todos.splice(idx, 1);
  }
}