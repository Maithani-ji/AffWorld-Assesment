import React, { forwardRef, useImperativeHandle, useState } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import * as Notifications from "expo-notifications";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Todo } from "../types/Todo";

export type AddTodoModalRef = {
  open: (todo?: Todo) => void;
};

interface Props {
  onAdd: (title: string, reminderTime: Date | null) => Promise<string | null>;
  onEdit: (id: string, title: string) => void;
  editingTodo: Todo | null;
}

const AddTodoModal = forwardRef<AddTodoModalRef, Props>(
  ({ onAdd, onEdit }, ref) => {
    const [modalVisible, setModalVisible] = useState(false);
    const [title, setTitle] = useState("");
    const [editId, setEditId] = useState<string | null>(null);
    const [reminderTime, setReminderTime] = useState<Date | null>(null);
    const [isPickerVisible, setPickerVisible] = useState(false);

    const handleScheduleNotification = async (todoId: string, todoTitle: string) => {
      if (!reminderTime) return;

      const triggerTime = new Date(reminderTime);

      try {
        const notificationId = await Notifications.scheduleNotificationAsync({
          content: {
            title: "⏰ Todo Reminder",
            body: todoTitle,
          },
          trigger: {
            type: Notifications.SchedulableTriggerInputTypes.DAILY,
            hour: triggerTime.getHours(),
            minute: triggerTime.getMinutes(),
          },
        });

        await AsyncStorage.setItem(`notification-${todoId}`, notificationId);
        await AsyncStorage.setItem(`reminderTime-${todoId}`, reminderTime.toISOString());
      } catch {}
    };

    useImperativeHandle(ref, () => ({
      open: async (todo?: Todo) => {
        if (todo) {
          setTitle(todo.title);
          setEditId(todo.id);
          const storedTime = await AsyncStorage.getItem(`reminderTime-${todo.id}`);
          setReminderTime(storedTime ? new Date(storedTime) : null);
        } else {
          setTitle("");
          setEditId(null);
          setReminderTime(null);
        }
        setModalVisible(true);
      },
    }));

    const handleSubmit = async () => {
      if (!title.trim()) return;

      if (editId) {
        const existingId = await AsyncStorage.getItem(`notification-${editId}`);
        if (existingId) {
          await Notifications.cancelScheduledNotificationAsync(existingId);
          await AsyncStorage.multiRemove([
            `notification-${editId}`,
            `reminderTime-${editId}`,
          ]);
        }
      }

      let todoId: string | null = editId;

      if (editId) {
        onEdit(editId, title);
      } else {
        todoId = await onAdd(title, reminderTime);
        if (!todoId) {
          setModalVisible(false);
          return;
        }
      }

      if (reminderTime && todoId) {
        await handleScheduleNotification(todoId, title);
      }

      setModalVisible(false);
      setTitle("");
      setEditId(null);
      setReminderTime(null);
    };

    return (
      <Modal transparent visible={modalVisible} animationType="slide">
        <View style={styles.overlay}>
          <View style={styles.modalContent}>
            <Text style={styles.heading}>
              {editId ? "Edit Task" : "Add New Task"}
            </Text>

            <TextInput
              placeholder="Enter task title"
              style={styles.input}
              value={title}
              onChangeText={setTitle}
            />

            <TouchableOpacity
              onPress={() => setPickerVisible(true)}
              style={styles.timePicker}
            >
              <Text>
                {reminderTime
                  ? `🕒 ${reminderTime.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}`
                  : "Set Reminder Time"}
              </Text>
            </TouchableOpacity>

            <DateTimePickerModal
              isVisible={isPickerVisible}
              mode="time"
              date={reminderTime || new Date()}
              onConfirm={(date) => {
                setReminderTime(date);
                setPickerVisible(false);
              }}
              onCancel={() => setPickerVisible(false)}
              is24Hour={false}
              // display="spinner"
            />

            <View style={styles.buttons}>
              <TouchableOpacity
                style={[styles.button, { backgroundColor: "#ccc" }]}
                onPress={() => {
                  setModalVisible(false);
                  setTitle("");
                  setEditId(null);
                  setReminderTime(null);
                }}
              >
                <Text>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.button, { backgroundColor: "#1E90FF" }]}
                onPress={handleSubmit}
              >
                <Text style={{ color: "white" }}>
                  {editId ? "Update" : "Add"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  }
);

export default AddTodoModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    width: "85%",
  },
  heading: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 10,
    marginBottom: 20,
  },
  timePicker: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 10,
    borderRadius: 8,
    marginBottom: 20,
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 10,
  },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
});
