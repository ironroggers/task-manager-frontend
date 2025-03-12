import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, StyleSheet } from "react-native";
import axios from "axios";
import API_URL from "../../src/config";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function TaskDetailsScreen({ route }) {
  const { taskId } = route.params;
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTaskDetails = async () => {
      try {
        const token = await AsyncStorage.getItem("userToken");
        const response = await axios.get(`${API_URL}/tasks/${taskId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTask(response.data);
      } catch (error) {
        console.error("Error fetching task details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTaskDetails();
  }, [taskId]);

  if (loading) {
    return <ActivityIndicator size="large" color="#007AFF" style={styles.loader} />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{task.title}</Text>
      <Text style={styles.description}>{task.description}</Text>
      <Text style={styles.info}>Priority: {task.priority}</Text>
      <Text style={styles.info}>Status: {task.status}</Text>
      <Text style={styles.info}>
        Due Date: {task.dueDate ? new Date(task.dueDate).toDateString() : "Not set"}
      </Text>
      <Text style={styles.info}>
        Estimated Time: {task.estimatedTime ? `${task.estimatedTime} hours` : "Not specified"}
      </Text>
      <Text style={styles.info}>Created At: {new Date(task.createdAt).toLocaleString()}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#F5F5F5" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 10 },
  description: { fontSize: 18, color: "#555", marginBottom: 10 },
  info: { fontSize: 16, color: "#333", marginBottom: 5 },
  loader: { flex: 1, justifyContent: "center", alignItems: "center" },
});
