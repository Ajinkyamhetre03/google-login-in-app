import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  TextInput,
  Button,
  FlatList,
  TouchableOpacity,
  Alert,
} from "react-native";
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "./../../configFireBase/configFirebase";

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");

  // Fetch tasks from Firestore on load
  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "tasks"));
      const tasksArray = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setTasks(tasksArray);
    } catch (e) {
      console.error("Error fetching tasks: ", e);
    }
  };

  // Add a new task
  const addTask = async () => {
    if (newTask.trim() === "") {
      Alert.alert("Error", "Task cannot be empty");
      return;
    }
    try {
      const docRef = await addDoc(collection(db, "tasks"), {
        text: newTask,
        completed: false,
      });
      setTasks([...tasks, { text: newTask, completed: false, id: docRef.id }]);
      setNewTask("");
    } catch (e) {
      console.error("Error adding task: ", e);
    }
  };

  // Toggle task completion
  const toggleComplete = async (id, completed) => {
    try {
      const taskRef = doc(db, "tasks", id);
      await updateDoc(taskRef, { completed: !completed });
      setTasks(
        tasks.map((task) =>
          task.id === id ? { ...task, completed: !completed } : task
        )
      );
    } catch (e) {
      console.error("Error updating task: ", e);
    }
  };

  // Delete a task
  const deleteTask = async (id) => {
    try {
      await deleteDoc(doc(db, "tasks", id));
      setTasks(tasks.filter((task) => task.id !== id));
    } catch (e) {
      console.error("Error deleting task: ", e);
    }
  };

  return (
    <View style={{ flex: 1, padding: 20, justifyContent: "center" }}>
      <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 20 }}>
        To-Do List
      </Text>

      {/* Input to add a new task */}
      <TextInput
        placeholder="Enter new task"
        value={newTask}
        onChangeText={setNewTask}
        style={{
          borderWidth: 1,
          borderColor: "#ddd",
          padding: 10,
          marginBottom: 10,
          borderRadius: 5,
        }}
      />
      <Button title="Add Task" onPress={addTask} />

      {/* List of tasks */}
      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              padding: 10,
              borderBottomWidth: 1,
              borderBottomColor: "#ddd",
            }}
          >
            <TouchableOpacity
              onPress={() => toggleComplete(item.id, item.completed)}
            >
              <Text
                style={{
                  fontSize: 18,
                  textDecorationLine: item.completed ? "line-through" : "none",
                }}
              >
                {item.text}
              </Text>
            </TouchableOpacity>
            <Button
              title="Delete"
              color="red"
              onPress={() => deleteTask(item.id)}
            />
          </View>
        )}
      />
    </View>
  );
}
