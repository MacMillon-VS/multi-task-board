import PlusIcon from "../icons/PlusIcon";
import { useMemo, useState } from "react";
import { Column, Id, Task } from "../types";
import ColumnContainer from "./ColumnContainer";
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { SortableContext, arrayMove } from "@dnd-kit/sortable";
import { createPortal } from "react-dom";
import TaskCard from "./TaskCard";

const defaultCols: Column[] = [
  {
    id: "todo",
    title: "Todo",
  },
  {
    id: "doing",
    title: "Work in progress",
  },
  {
    id: "done",
    title: "Done",
  },
];

const defaultTasks: Task[] = [
  {
    id: "1",
    columnId: "todo",
    content: "List admin APIs for dashboard",
  },
  {
    id: "2",
    columnId: "todo",
    content:
      "Develop user registration functionality with OTP delivered on SMS after email confirmation and phone number confirmation",
  },
  {
    id: "3",
    columnId: "doing",
    content: "Conduct security testing",
  },
  {
    id: "4",
    columnId: "doing",
    content: "Analyze competitors",
  },
  {
    id: "5",
    columnId: "done",
    content: "Create UI kit documentation",
  },
  {
    id: "6",
    columnId: "done",
    content: "Dev meeting",
  },
  {
    id: "7",
    columnId: "done",
    content: "Deliver dashboard prototype",
  },
  {
    id: "8",
    columnId: "todo",
    content: "Optimize application performance",
  },
  {
    id: "9",
    columnId: "todo",
    content: "Implement data validation",
  },
  {
    id: "10",
    columnId: "todo",
    content: "Design database schema",
  },
  {
    id: "11",
    columnId: "todo",
    content: "Integrate SSL web certificates into workflow",
  },
  {
    id: "12",
    columnId: "doing",
    content: "Implement error logging and monitoring",
  },
  {
    id: "13",
    columnId: "doing",
    content: "Design and implement responsive UI",
  },
];

function KanbanBoard() {
  // const [columns, setColumns] = useState<Column[]>(defaultCols);
  const [isHelpVisible, setIsHelpVisible] = useState(false);
  const [columns, setColumns] = useState<Column[]>(getColumnsFromLocalStorage);
const [tasks, setTasks] = useState<Task[]>(getTasksFromLocalStorage);
  const columnsId = useMemo(() => columns.map((col) => col.id), [columns]);

  // const [tasks, setTasks] = useState<Task[]>(defaultTasks);

  const [activeColumn, setActiveColumn] = useState<Column | null>(null);

  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 10,
      },
    })
  );
  function getColumnsFromLocalStorage(): Column[] {
    const columnsJSON = localStorage.getItem('columns');
    return columnsJSON ? JSON.parse(columnsJSON) : defaultCols;
  }
  
  function setColumnsInLocalStorage(columns: Column[]): void {
    localStorage.setItem('columns', JSON.stringify(columns));
  }
  
  function getTasksFromLocalStorage(): Task[] {
    const tasksJSON = localStorage.getItem('tasks');
    return tasksJSON ? JSON.parse(tasksJSON) : defaultTasks;
  }
  
  function setTasksInLocalStorage(tasks: Task[]): void {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }
  return (
    <div
      className="
        m-auto
        flex
        min-h-screen
        w-full
        items-center
        overflow-x-auto
        overflow-y-hidden
        px-[40px]
    "
    >
      
      <DndContext
        sensors={sensors}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        onDragOver={onDragOver}
      >
        <div className="m-auto flex gap-4">
          <div className="flex gap-4">
            <SortableContext items={columnsId}>
              {columns.map((col) => (
                <ColumnContainer
                  key={col.id}
                  column={col}
                  deleteColumn={deleteColumn}
                  updateColumn={updateColumn}
                  createTask={createTask}
                  deleteTask={deleteTask}
                  updateTask={updateTask}
                  tasks={tasks.filter((task) => task.columnId === col.id)}
                />
              ))}
            </SortableContext>
          </div>
          <div className="flex flex-col items-center" >
          <button
            onClick={() => {
              createNewColumn();
            }}
            className="
      h-[60px]
      w-[350px]
      min-w-[350px]
      cursor-pointer
      rounded-lg
      bg-mainBackgroundColor
      border-2
      border-columnBackgroundColor
      p-4
      ring-rose-500
      hover:ring-2
      flex
      gap-2
      "
          >
            <PlusIcon />
            Add Column
          </button>
        <button className="w-[120px] 
      cursor-pointer
      text-center
      rounded-lg
      bg-rose-700
      hover:bg-rose-400
      border-2
      border-rose-400
      p-4
      ring-columnBackgroundColor
      hover:ring-2
      flex
      m-4
      justify-center
      gap-2" onClick={()=>{
        setColumns([]);
  setTasks([]);
        localStorage.removeItem('columns'); localStorage.removeItem('tasks')}}>Reset Tasks</button>
        <button className="border w-[120px] border-gray-700 p-3 rounded-md hover:ring-rose-500 hover:ring-1 hover:text-slate-200 cursor-help m-2 text-center text-gray-500" onMouseEnter={()=>setIsHelpVisible(true)} onMouseLeave={()=>setIsHelpVisible(false)}>Help</button>
        {isHelpVisible&&<ul className="p-2 rounded-md ring-rose-500 ring-1 text-slate-200 cursor-help m-2 text-left text-sm">
          <li>Click Add column to start</li>
          <li>After edit</li>
          <li>To save press enter or click outside column title</li>
          <li>To save press shift+enter or click outside task</li>
          <li>Drag and drop columns or task to move around</li>
          <li>Click Reset to delete everything</li>
          
        </ul>}
      </div>
        </div>

        {createPortal(
          <DragOverlay>
            {activeColumn && (
              <ColumnContainer
                column={activeColumn}
                deleteColumn={deleteColumn}
                updateColumn={updateColumn}
                createTask={createTask}
                deleteTask={deleteTask}
                updateTask={updateTask}
                tasks={tasks.filter(
                  (task) => task.columnId === activeColumn.id
                )}
              />
            )}
            {activeTask && (
              <TaskCard
                task={activeTask}
                deleteTask={deleteTask}
                updateTask={updateTask}
              />
            )}
          </DragOverlay>,
          document.body
        )}
      </DndContext>
    </div>
  );

  function createTask(columnId: Id) {
    const newTask: Task = {
      id: generateId(),
      columnId,
      content: `Task ${tasks.length + 1}`,
    };

    // setTasks([...tasks, newTask]);
    const updatedTasks = [...tasks, newTask];
  setTasks(updatedTasks);

  // Update localStorage with the updated columns
  setTasksInLocalStorage(updatedTasks);
  }

  function deleteTask(id: Id) {
    const newTasks = tasks.filter((task) => task.id !== id);
    setTasks(newTasks);
    setTasksInLocalStorage(newTasks)
  }

  function updateTask(id: Id, content: string) {
    const newTasks = tasks.map((task) => {
      if (task.id !== id) return task;
      return { ...task, content };
    });

    setTasks(newTasks);
    setTasksInLocalStorage(newTasks);
  }

  function createNewColumn() {
    const columnToAdd: Column = {
      id: generateId(),
      title: `Column ${columns.length + 1}`,
    };

    // setColumns([...columns, columnToAdd]);
    const updatedColumns = [...columns, columnToAdd];
  setColumns(updatedColumns);

  // Update localStorage with the updated columns
  setColumnsInLocalStorage(updatedColumns);
  }

  function deleteColumn(id: Id) {
    const filteredColumns = columns.filter((col) => col.id !== id);
    setColumns(filteredColumns);
    setColumnsInLocalStorage(filteredColumns)

    const newTasks = tasks.filter((t) => t.columnId !== id);
    setTasks(newTasks);
    setTasksInLocalStorage(newTasks)
  }

  function updateColumn(id: Id, title: string) {
    const newColumns = columns.map((col) => {
      if (col.id !== id) return col;
      return { ...col, title };
    });

    setColumns(newColumns);
    setColumnsInLocalStorage(newColumns)
  }

  function onDragStart(event: DragStartEvent) {
    if (event.active.data.current?.type === "Column") {
      setActiveColumn(event.active.data.current.column);
      return;
    }

    if (event.active.data.current?.type === "Task") {
      setActiveTask(event.active.data.current.task);
      return;
    }
  }

  function onDragEnd(event: DragEndEvent) {
    setActiveColumn(null);
    setActiveTask(null);

    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const isActiveAColumn = active.data.current?.type === "Column";
    if (!isActiveAColumn) return;


    setColumns((columns) => {
      const activeColumnIndex = columns.findIndex((col) => col.id === activeId);

      const overColumnIndex = columns.findIndex((col) => col.id === overId);

      // return arrayMove(columns, activeColumnIndex, overColumnIndex);
      const updatedColumns = arrayMove(columns, activeColumnIndex, overColumnIndex);

    // Update the state with the updated columns
    setColumns(updatedColumns);

    // Update localStorage with the updated columns
    setColumnsInLocalStorage(updatedColumns);

    return updatedColumns;
    });
  }

  function onDragOver(event: DragOverEvent) {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const isActiveATask = active.data.current?.type === "Task";
    const isOverATask = over.data.current?.type === "Task";

    if (!isActiveATask) return;

    // Im dropping a Task over another Task
    if (isActiveATask && isOverATask) {
      setTasks((tasks) => {
        const activeIndex = tasks.findIndex((t) => t.id === activeId);
        const overIndex = tasks.findIndex((t) => t.id === overId);

        if (tasks[activeIndex].columnId != tasks[overIndex].columnId) {
          // Fix introduced after video recording
          tasks[activeIndex].columnId = tasks[overIndex].columnId;
          return arrayMove(tasks, activeIndex, overIndex - 1);
        }

        // return arrayMove(tasks, activeIndex, overIndex);
        const updatedTasks = arrayMove(tasks, activeIndex, overIndex);

    setTasks(updatedTasks);

    setTasksInLocalStorage(updatedTasks);

    return updatedTasks;
      });
    }

    const isOverAColumn = over.data.current?.type === "Column";

    // Im dropping a Task over a column
    if (isActiveATask && isOverAColumn) {
      setTasks((tasks) => {
        const activeIndex = tasks.findIndex((t) => t.id === activeId);

        tasks[activeIndex].columnId = overId;
        // console.log("DROPPING TASK OVER COLUMN", { activeIndex });
        // return arrayMove(tasks, activeIndex, activeIndex);
        const updatedTasks = arrayMove(tasks, activeIndex, activeIndex);

        setTasks(updatedTasks);
    
        setTasksInLocalStorage(updatedTasks);
    
        return updatedTasks;
      });
    }
  }
}

function generateId() {
  /* Generate a random number between 0 and 10000 */
  return Math.floor(Math.random() * 10001);
}

export default KanbanBoard;