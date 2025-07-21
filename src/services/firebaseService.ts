// services/firebaseService.ts

import {
    collection,
    onSnapshot,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
    getDocs,
    getFirestore,
    Timestamp
  } from 'firebase/firestore'
  import { db } from '../firebase/firebaseConfig'
import { Todo } from '../types/Todo'
  

  
  // Firestore collection reference
  const todosCollection = collection(db, 'todos');
  
  export const subscribeToTodos = (callback: (todos: Todo[]) => void) => {
    return onSnapshot(todosCollection, (snapshot) => {
      const todos = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as Todo[];
      callback(todos);
    });
  };
  
  // --- IMPORTANT CHANGE HERE: Return the ID ---
  export const addTodo = async (title: string): Promise<string> => {
    const newTodo = {
      title,
      completed: false,
      createdAt: new Date().toISOString(),
    };
    const docRef = await addDoc(todosCollection, newTodo);
    return docRef.id; // <-- Return the newly generated Firebase ID
  };
  
  export const updateTodo = async (id: string, data: Partial<Todo>) => {
    const todoRef = doc(db, 'todos', id);
    await updateDoc(todoRef, data);
  };
  
  export const deleteTodo = async (id: string) => {
    const todoRef = doc(db, 'todos', id);
    await deleteDoc(todoRef);
  };