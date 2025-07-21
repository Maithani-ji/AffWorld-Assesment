// src/screens/TodoListScreen.tsx
import React from 'react'
import { FlatList, View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { Todo } from '../types/Todo'
import TodoItem from '../components/TodoItem'

interface Props {
  todos: Todo[]
  onAddPress: () => void
  onToggle: (id: string, completed: boolean) => void
  onDelete: (id: string) => void
  onEdit: (todo: Todo) => void
}

const TodoListScreen: React.FC<Props> = ({
  todos,
  onAddPress,
  onToggle,
  onDelete,
  onEdit,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Todo List 📝</Text>

      <FlatList
        data={todos}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TodoItem
            todo={item}
            onToggle={onToggle}
            onDelete={onDelete}
            onPressDetail={onEdit} 
          />
        )}
        ListEmptyComponent={() => (
          <Text style={{ textAlign: 'center' }}>No Tasks Yet. Add some!</Text>
        )}
      />

      <TouchableOpacity style={styles.addButton} onPress={onAddPress}>
        <Text style={styles.addButtonText}>+ Add Task</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: "15%",
    flex: 1,
    backgroundColor: '#fff',
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,alignSelf:'center',
  },
  addButton: {
    backgroundColor: '#1E90FF',
    padding: 14,
    marginTop: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  addButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
})

export default TodoListScreen