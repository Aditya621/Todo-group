import { useState } from "react";
import TodoList from "./TodoList";

export function TodoGroup() {
  const [grpValue, setGrpValue] = useState("");
  const [todoGrp, setTodoGrp] = useState([]);
  const [openGroupId, setOpenGroupId] = useState(null);
  const [grpTasks, setGrpTasks] = useState({});

  // const [grpTasks, setGrpTasks] = useState({
  //   1 : [{1,personal,true}, {2,prof,false}],
  //   2 : [{id,value,checked}],
  // ...
  // });

  // todoGrp = [
  //   {id:1, value: 'personal', checked: false},
  //   {id:2, value: 'Prof.', checked: false}
  // ]

  // this is updated from child
  // grpTasks = {
  //   1: [
  //     {id:1, value: 'Gym', checked: false},
  //     {id:1, value: 'Gym', checked: false}
  //   ],
  //   2 : [
  //     {id:1, value: 'Doc Read', checked: false}
  //   ]
  // }

  const handleAddFun = () => {
    if (grpValue.trim() === "") return;
    setTodoGrp(prevList => [
      ...prevList,
      {
        id: prevList.length + 1,
        value: grpValue,
        checked: false,
      },
    ]);
    setGrpValue("");
  };

  const handleCheckbox = id => {
    setTodoGrp(prevList =>
      prevList.map(grp =>
        grp.id === id ? { ...grp, checked: !grp.checked } : grp
      )
    );

    setGrpTasks(prev => {
      const currentTasks = prev[id] || [];

      return {
        ...prev,
        [id]: currentTasks.map(task => ({
          ...task,
          checked: false,
        })),
      };
    });
  };

  const toggleAccordion = id => {
    setOpenGroupId(prevId => (prevId === id ? null : id));
  };

  const updateGroupTasks = (grpId, tasks) => {
    setGrpTasks(prev => ({
      ...prev,
      [grpId]: tasks,
    }));

    console.log(grpTasks);
  };

  const updateGroupCheckbox = (grpId, checked) => {
    setTodoGrp(prev =>
      prev.map(group => (group.id === grpId ? { ...group, checked } : group))
    );
  };

  const groupDeleteHandler = id => {
    setTodoGrp(prev => prev.filter(todo => todo.id !== id));

    setGrpTasks(prev => [
      {
        ...prev,
        [id]: [],
      },
    ]);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex flex-col items-center">
      <h1 className="text-2xl font-semibold text-blue-700 mb-6">Todo Groups</h1>

      {/* Input area */}
      <div className="w-full max-w-md flex gap-2 mb-8">
        <input
          type="text"
          value={grpValue}
          onChange={e => setGrpValue(e.target.value)}
          placeholder="Enter group name"
          className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleAddFun}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Add Group
        </button>
      </div>

      {/* Group List */}
      <div className="w-full max-w-2xl space-y-4">
        {todoGrp.length > 0 ? (
          todoGrp.map(group => (
            <div
              key={group.id}
              className="bg-white border border-gray-200 rounded-lg shadow"
            >
              <div
                className="flex justify-between items-center p-4 cursor-pointer hover:bg-gray-50"
                onClick={() => toggleAccordion(group.id)}
              >
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={group.checked}
                    onChange={e => {
                      e.stopPropagation();
                      handleCheckbox(group.id);
                    }}
                    className="w-4 h-4"
                  />
                  <span
                    className={`font-medium text-gray-800 ${
                      group.checked ? "line-through text-gray-500" : ""
                    }`}
                  >
                    {group.value}
                  </span>
                </div>

                <div className="flex gap-10 p-2 ">
                  <button
                    className="text-red-600 hover:underline"
                    onClick={() => groupDeleteHandler(group.id)}
                  >
                    delete
                  </button>
                  <span className="text-gray-400 text-sm">
                    {openGroupId === group.id ? "▲" : "▼"}
                  </span>
                </div>
              </div>

              {openGroupId === group.id && (
                <div className="p-4 border-t border-gray-100 bg-gray-50">
                  <div className="text-sm text-gray-600 italic">
                    {
                      <TodoList
                        groupId={group.id}
                        groupName={group.value}
                        allChecked={group.checked}
                        tasks={grpTasks[group.id] || []}
                        onTaskChanges={updatedTask =>
                          updateGroupTasks(group.id, updatedTask)
                        }
                        onAllCheckedChange={isChecked =>
                          updateGroupCheckbox(group.id, isChecked)
                        }
                      />
                    }
                  </div>
                </div>
              )}
            </div>
          ))
        ) : (
          <p className="text-center text-gray-600">No groups created yet.</p>
        )}
      </div>
    </div>
  );
}
