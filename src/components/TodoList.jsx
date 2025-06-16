import { useState, useEffect } from "react";

export default function TodoList({
  groupId,
  groupName,
  tasks,
  onTaskChanges,
  allChecked,
  onAllCheckedChange,
}) {
  const [inputValue, setInputValue] = useState("");
  const [todoList, setTodoList] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [currentTodo, setCurrentTodo] = useState(null);
  const [sortCompleted, setsortCompleted] = useState(false);

  useEffect(() => {
    if (tasks.length === 0) return;

    if (allChecked) {
      debugger;
      const updatedTasks = tasks.map(todo => ({
        ...todo,
        checked: allChecked,
      }));
      onTaskChanges(updatedTasks);
      console.log(updatedTasks);
    }
  }, [allChecked]);

  useEffect(() => {
    if (tasks.length === 0) return;

    const allSelected = tasks.every(todo => todo.checked);
    onAllCheckedChange(allSelected);
  }, [tasks]);

  const addList = () => {
    if (inputValue.trim() === "") return;

    if (editMode && currentTodo) {
      // setTodoList(prevList =>
      //   prevList.map(todo =>
      //     todo.id === currentTodo.id ? { ...todo, value: inputValue } : todo
      //   )
      // );

      const updated = tasks.map(todo =>
        todo.id === currentTodo.id ? { ...todo, value: inputValue } : todo
      );
      setEditMode(false);
      setCurrentTodo(null);
      onTaskChanges(updated);
    } else {
      // setTodoList(prevList => [
      //   ...prevList,
      //   {
      //     id: prevList.length + 1,
      //     value: inputValue,
      //     checked: false,
      //   },
      // ]);

      const newTodo = {
        id: tasks.length + 1,
        value: inputValue,
        checked: false,
      };
      onTaskChanges([...tasks, newTodo]);
    }

    setInputValue("");
  };

  const handleInput = e => setInputValue(e.target.value);

  const handleDelete = id => {
    // setTodoList(prevList => prevList.filter(val => val.id !== id));

    const updateDelete = tasks.filter(val => val.id !== id);
    onTaskChanges(updateDelete);
  };

  const handleEdit = todo => {
    setEditMode(true);
    setInputValue(todo.value);
    setCurrentTodo(todo);
  };

  const cancelEdit = () => {
    setEditMode(false);
    setInputValue("");
    setCurrentTodo(null);
  };

  const handleCheckbox = id => {
    // setTodoList(prevList =>
    //   prevList.map(todo =>
    //     todo.id === id ? { ...todo, checked: !todo.checked } : todo
    //   )
    // );

    const updateCheckbox = tasks.map(todo =>
      todo.id === id ? { ...todo, checked: !todo.checked } : todo
    );
    onTaskChanges(updateCheckbox);
  };

  const toggleSorting = () => {
    setsortCompleted(prev => !prev);
  };

  const sortedTodos = sortCompleted
    ? [...tasks].sort((a, b) =>
        a.checked === b.checked ? 0 : a.checked ? 1 : -1
      )
    : tasks;

  // const getSortedTodos = () => {
  //   if (sortCompleted) {
  //     return [...tasks].sort((a, b) => {
  //       if (a.checked === b.checked) return 0;
  //       return a.checked ? 1 : -1;
  //     });
  //   }
  //   return tasks;
  // };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-10 px-4">
      <h1 className="text-3xl font-bold mb-6 text-blue-700">
        Todo List for: {groupName}
      </h1>

      <div className="flex flex-col sm:flex-row gap-4 mb-6 w-full max-w-xl">
        <input
          type="text"
          value={inputValue}
          onChange={handleInput}
          placeholder="Enter a task..."
          className="flex-1 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <div className="flex gap-2">
          <button
            onClick={addList}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          >
            {editMode ? "Update" : "Add"}
          </button>
          {editMode && (
            <button
              onClick={cancelEdit}
              className="px-4 py-2 bg-gray-400 text-white rounded-md hover:bg-gray-500 transition"
            >
              Cancel
            </button>
          )}
        </div>
      </div>

      <div className="w-full max-w-xl mb-6">
        <label className="flex items-center gap-2 text-gray-700">
          <input
            type="checkbox"
            checked={sortCompleted}
            onChange={toggleSorting}
            className="w-4 h-4"
          />
          Sort incomplete tasks first
        </label>
      </div>

      <div className="w-full max-w-2xl bg-white rounded-md shadow p-4">
        {tasks.length > 0 ? (
          <table className="w-full table-auto border-collapse">
            <thead>
              <tr className="bg-gray-200 text-left">
                <th className="p-2 border-b">Done</th>
                <th className="p-2 border-b">#</th>
                <th className="p-2 border-b">Task</th>
                <th className="p-2 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedTodos.map(todo => (
                <tr key={todo.id} className="hover:bg-gray-100">
                  <td className="p-2 border-b">
                    <input
                      type="checkbox"
                      checked={todo.checked}
                      onChange={() => handleCheckbox(todo.id)}
                      className="w-4 h-4"
                    />
                  </td>
                  <td className="p-2 border-b">{todo.id}</td>
                  <td
                    className={`p-2 border-b ${
                      todo.checked ? "line-through text-gray-500" : ""
                    }`}
                  >
                    {todo.value}
                  </td>
                  <td className="p-2 border-b space-x-2">
                    <button
                      onClick={() => handleEdit(todo)}
                      className="text-blue-600 hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(todo.id)}
                      className="text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-center text-gray-600">Add Today's Tasks :)</p>
        )}
      </div>
    </div>
  );
}
