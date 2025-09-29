import ToDo from ('./todo.js')

export default class Project {
  #name;
  #todos;
  #id;

  constructor(name) {
    this.#name = name;
    this.#todos = [];
    this.#id = crypto.randomUUID();
  }

  /** Adds new todo to this project's list
   * 
   * @param {ToDo} newTodo - the new todo to add to the list
   */
  add(newTodo) {
    if (!(newTodo instanceof ToDo)) {
      throw new TypeError('projects only accepts ToDo items')
    }
    this.#todos.push(newTodo);
  }

  /** Removes the todo from this project's list that has a matching id with input
   * 
   * @param {string} id - the id of the todo we want to delete 
   */
  remove(id) {
    const idx = this.#todos.find((todo) => todo.id === id);
    if (!idx) {
      throw new Error('non existing id passed to remove');
    }

    this.#todos.splice(idx, 1);
  }

  get id() {
    return this.#id;
  }
}