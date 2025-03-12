import React, { useEffect, useState } from "react";
import {SafeAreaView, ScrollView, View} from "react-native";
import { TextInput, Button, Card, Text, Snackbar, Menu, Divider } from "react-native-paper";
import DateTimePicker from "@react-native-community/datetimepicker";
import API_URL from "../../src/config";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function CreateTaskFormScreen({ route, navigation }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [status, setStatus] = useState("Pending");
  const [dueDate, setDueDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [estimatedTime, setEstimatedTime] = useState("");
  const [taskId, setTaskId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [priorityMenuVisible, setPriorityMenuVisible] = useState(false);
  const [statusMenuVisible, setStatusMenuVisible] = useState(false);

  useEffect(() => {
    if (route.params?.task) {
      const { _id, title, description, priority, status, dueDate, estimatedTime } = route.params.task;
      setTitle(title);
      setDescription(description);
      setPriority(priority || "Medium");
      setStatus(status || "Pending");
      setDueDate(dueDate ? new Date(dueDate) : new Date());
      setEstimatedTime(estimatedTime || "");
      setTaskId(_id);
    }
  }, [route.params?.task]);

  const showSnackbar = (message) => {
    setSnackbarMessage(message);
    setSnackbarVisible(true);
  };

  const handleSubmit = async () => {
    if (!title.trim() || !description.trim() || !estimatedTime.trim()) {
      showSnackbar("All fields are required");
      return;
    }

    setLoading(true);
    const taskData = { title, description, priority, status, dueDate, estimatedTime };
    const method = taskId ? "PUT" : "POST";
    const url = taskId ? `${API_URL}/tasks/${taskId}` : `${API_URL}/tasks`;

    try {
      const token = await AsyncStorage.getItem("userToken");
      if (!token) throw new Error("User not authenticated");

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(taskData),
      });

      if (!response.ok) throw new Error(taskId ? "Failed to update task" : "Failed to create task");

      showSnackbar(taskId ? "Task updated successfully" : "Task created successfully");
      setTimeout(() => navigation.goBack(), 1000);
    } catch (error) {
      showSnackbar(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, padding: 20, backgroundColor: "#FAFAFA" }}>
      <ScrollView style={{ flex: 1 }}>
        <Card mode="elevated" style={{ padding: 20, borderRadius: 10 }}>
          <Text variant="titleLarge" style={{ marginBottom: 10, fontWeight: "bold" }}>
            {taskId ? "Edit Task" : "Create Task"}
          </Text>

          <TextInput
            label="Title"
            mode="outlined"
            value={title}
            onChangeText={setTitle}
            style={{ marginBottom: 15 }}
          />

          <TextInput
            label="Description"
            mode="outlined"
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
            style={{ marginBottom: 15 }}
          />
          <View style={{  marginBottom: 15}}>
            <Menu
              visible={priorityMenuVisible}
              onDismiss={() => setPriorityMenuVisible(false)}
              anchor={
                <Button mode="outlined" onPress={() => setPriorityMenuVisible(true)}>
                  Priority: {priority}
                </Button>
              }
            >
              <Menu.Item onPress={() => setPriority("Low")} title="Low" />
              <Menu.Item onPress={() => setPriority("Medium")} title="Medium" />
              <Menu.Item onPress={() => setPriority("High")} title="High" />
            </Menu>
          </View>

          <View style={{  marginBottom: 15}}>
            <Menu
              visible={statusMenuVisible}
              onDismiss={() => setStatusMenuVisible(false)}
              anchor={
                <Button mode="outlined" onPress={() => setStatusMenuVisible(true)}>
                  Status: {status}
                </Button>
              }
            >
              <Menu.Item onPress={() => setStatus("Pending")} title="Pending" />
              <Menu.Item onPress={() => setStatus("In Progress")} title="In Progress" />
              <Menu.Item onPress={() => setStatus("Completed")} title="Completed" />
            </Menu>
          </View>

          <TextInput
            label="Estimated Time (hours)"
            mode="outlined"
            keyboardType="numeric"
            value={estimatedTime}
            onChangeText={setEstimatedTime}
            style={{ marginBottom: 15 }}
          />

          <Button
            mode="outlined"
            onPress={() => setShowDatePicker(true)}
            style={{ marginBottom: 15 }}
          >
            Select Due Date: {dueDate.toDateString()}
          </Button>

          {showDatePicker && (
            <DateTimePicker
              value={dueDate}
              mode="date"
              display="default"
              onChange={(event, date) => {
                setShowDatePicker(false);
                if (date) setDueDate(date);
              }}
            />
          )}

          <Button
            mode="contained"
            onPress={handleSubmit}
            loading={loading}
            disabled={loading}
            style={{ borderRadius: 8, backgroundColor: "#6200EE" }}
          >
            {taskId ? "Update Task" : "Create Task"}
          </Button>
        </Card>

        <Snackbar
          visible={snackbarVisible}
          onDismiss={() => setSnackbarVisible(false)}
          duration={2000}
        >
          {snackbarMessage}
        </Snackbar>
      </ScrollView>
    </SafeAreaView>
  );
}