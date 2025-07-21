// App.tsx
import React, { useEffect, useRef, useState } from "react";
import { View } from "react-native";
import { Todo } from "./src/types/Todo";
import {
  subscribeToTodos,
  addTodo,
  updateTodo,
  deleteTodo,
} from "./src/services/firebaseService";
import * as Notifications from "expo-notifications";
import TodoListScreen from "./src/screens/TodoListScreen";
import AddTodoModal, { AddTodoModalRef } from "./src/modals/AddTodoModal";
import { useNotificationSetup } from "./src/hooks/useNotificationSetup";

import AsyncStorage from "@react-native-async-storage/async-storage";

export default function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const modalRef = useRef<AddTodoModalRef>(null);
  const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null);
  useNotificationSetup();

  useEffect(() => {
    const unsubscribe = subscribeToTodos(setTodos);
    console.log("working");
    
    return () => unsubscribe();
  }, []);


 //  handleAdd return the new todo ID
 const handleAdd = async (title: string, reminderTime: Date | null): Promise<string | null> => {
  if (title.trim()) {
    const newTodoId = await addTodo(title); // addTodo in firebaseService already returns string
  
    return newTodoId; // Return the ID here!
  }
  return null; // Return null if no title or something goes wrong
};

  // handleToggle
  const handleToggle =async (id: string, completed: boolean) => {
    const newCompleted = !completed;
    await updateTodo(id, { completed: newCompleted });
  
    if (newCompleted) {
      // Cancel reminder if marking as completed
      const notificationId = await AsyncStorage.getItem(`notification-${id}`);
      if (notificationId) {
        try {
          await Notifications.cancelScheduledNotificationAsync(notificationId);
          await AsyncStorage.multiRemove([
            `notification-${id}`,
            `reminderTime-${id}`,
          ]);
          console.log(`⏰ Notification ${notificationId} cancelled for completed task`);
        } catch (error) {
          console.error(`❌ Failed to cancel notification for task ${id}`, error);
        }
      }
    }
  };

  
  //   handleDelete function
  const handleDelete = async (id: string) => {
  
    const notificationId = await AsyncStorage.getItem(`notification-${id}`);
    if (notificationId) {
   
      try {
        await Notifications.cancelScheduledNotificationAsync(notificationId);
     
        await AsyncStorage.multiRemove([
          `notification-${id}`,
          `reminderTime-${id}`,
        ]);
       
      } catch (cancelError) {
        console.error(
          `Error cancelling notification ${notificationId}:`,
          cancelError
        );
      }
    } else {
      console.log(`No notification ID found in AsyncStorage for todo ${id}.`);
    }
    await deleteTodo(id);
    console.log(`Todo ${id} deleted from Firebase.`);
  };
  // handleOpenEdit
  const handleOpenEdit = (todo: Todo) => {
    setSelectedTodo(todo);
    modalRef.current?.open(todo);
  };
  // handleEdit
  const handleEdit = async (id: string, title: string) => {
    const todo = todos.find((t) => t.id === id);
    if (todo?.title === title.trim()) {
      // console.log('⚠️ No change in title, skipping update')
      return;
    }
    await updateTodo(id, { title });

    setSelectedTodo(null);
  };

  return (
    <View style={{ flex: 1 }}>
      <TodoListScreen
        todos={todos}
        onAddPress={() => {
          setSelectedTodo(null);
          modalRef.current?.open();
        }}
        onToggle={handleToggle}
        onDelete={handleDelete}
        onEdit={handleOpenEdit}
      />
      <AddTodoModal
        ref={modalRef}
       
        onAdd={handleAdd} 
        onEdit={handleEdit}
        editingTodo={selectedTodo}
      />
    </View>
  );
}
