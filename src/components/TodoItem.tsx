import React from 'react'
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TouchableOpacity,
} from 'react-native'
import { Todo } from '../types/Todo'
import { Circle, CheckCircle, Pencil } from 'lucide-react-native'

type Props = {
  todo: Todo
  onToggle: (id: string, completed: boolean) => void
  onDelete: (id: string) => void
  onPressDetail: (todo: Todo) => void
}

const TodoItem: React.FC<Props> = ({
  todo,
  onToggle,
  onDelete,
  onPressDetail,
}) => {
  return (
    <View style={styles.todoItem}>
      <Pressable
        style={styles.checkbox}
        onPress={() => onToggle(todo.id, todo.completed)}
      >
        {todo.completed ? (
          <CheckCircle size={20} color="#4CAF50" />
        ) : (
          <Circle size={20} color="#999" />
        )}
      </Pressable>

      <Text
        style={[styles.title, todo.completed && styles.completed]}
        onPress={() => onPressDetail(todo)}
      >
        {todo.title}
      </Text>

      <View style={styles.actions}>
        <TouchableOpacity onPress={() => onPressDetail(todo)}>
          <Pencil size={16} color="#555" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => onDelete(todo.id)}>
          <Text style={styles.delete}>❌</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  todoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 8,
    marginBottom: 12,
  },
  checkbox: {
    marginRight: 10,
  },
  title: {
    flex: 1,
    fontSize: 16,
  },
  completed: {
    textDecorationLine: 'line-through',
    color: 'gray',
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
  delete: {
    fontSize: 14,
  },
})

export default TodoItem
