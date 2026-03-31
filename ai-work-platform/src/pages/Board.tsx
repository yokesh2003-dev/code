import React, { useState } from "react";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { TaskCard } from "@/components/TaskCard";
import { TaskModal } from "@/components/TaskModal";
import { useStore } from "@/lib/store";
import { Task } from "@/lib/types";

const COLUMNS = ["Pending", "In Progress", "Completed"] as const;

export function Board() {
  const { state, dispatch } = useStore();
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    
    const { source, destination, draggableId } = result;
    if (source.droppableId === destination.droppableId) return; // Didn't change column

    const task = state.tasks.find(t => t.id === draggableId);
    if (task) {
      dispatch({ 
        type: "UPDATE_TASK", 
        payload: { ...task, status: destination.droppableId as Task["status"] } 
      });
    }
  };

  return (
    <div className="h-full flex flex-col animate-in fade-in">
      <h1 className="text-3xl font-bold mb-6">Kanban Board</h1>

      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-6 overflow-hidden">
          {COLUMNS.map(column => {
            const columnTasks = state.tasks.filter(t => t.status === column);
            
            return (
              <div key={column} className="flex flex-col glass-panel rounded-2xl bg-muted/20 border-transparent overflow-hidden">
                <div className="p-4 font-bold border-b border-border/50 flex justify-between items-center bg-card/50">
                  {column}
                  <span className="text-xs bg-background px-2 py-1 rounded-md text-muted-foreground">{columnTasks.length}</span>
                </div>
                
                <Droppable droppableId={column}>
                  {(provided, snapshot) => (
                    <div 
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`flex-1 p-3 space-y-3 overflow-y-auto transition-colors ${snapshot.isDraggingOver ? 'bg-primary/5' : ''}`}
                    >
                      {columnTasks.map((task, index) => (
                        <Draggable key={task.id} draggableId={task.id} index={index}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              style={provided.draggableProps.style}
                              className={snapshot.isDragging ? "task-dragging" : ""}
                            >
                              <TaskCard task={task} onClick={() => setSelectedTask(task)} isDraggable />
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            );
          })}
        </div>
      </DragDropContext>

      {selectedTask && (
        <TaskModal task={selectedTask} onClose={() => setSelectedTask(null)} />
      )}
    </div>
  );
}
