import React, { useEffect, useState } from "react";
import { View, FlatList, Alert, SafeAreaView, RefreshControl, StyleSheet } from "react-native";
import { Card, Text, FAB, IconButton } from "react-native-paper";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import API_URL from "../../src/config";
import { Swipeable } from "react-native-gesture-handler";

export default function TaskListScreen({ navigation }) {
  const [tasks, setTasks] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    setRefreshing(true);
    try {
      const token = await AsyncStorage.getItem("userToken");
      const response = await axios.get(`${API_URL}/tasks`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(response.data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
    setRefreshing(false);
  };

  const deleteTask = async (taskId) => {
    Alert.alert("Delete Task", "Are you sure you want to delete this task?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete", style: "destructive", onPress: async () => {
          try {
            const token = await AsyncStorage.getItem("userToken");
            await axios.delete(`${API_URL}/tasks/${taskId}`, {
              headers: { Authorization: `Bearer ${token}` },
            });
            setTasks(tasks.filter((task) => task._id !== taskId));
            Alert.alert("Success", "Task deleted successfully");
          } catch (error) {
            console.error("Error deleting task:", error);
            Alert.alert("Error", "Failed to delete task");
          }
        },
      },
    ]);
  };

  const renderTask = ({ item }) => (
    <Swipeable
      renderRightActions={() => (
        <View style={styles.deleteAction}>
          <IconButton icon="delete" color="white" size={28} onPress={() => deleteTask(item._id)} />
        </View>
      )}
    >
      <Card style={styles.card} onPress={() => navigation.navigate("TaskDetails", { taskId: item._id })}>
        <Card.Content style={styles.cardContent}>
          <View style={styles.textContainer}>
            <Text variant="titleMedium" style={styles.taskTitle}>{item.title}</Text>
            <Text variant="bodyMedium" style={styles.taskDescription} numberOfLines={2}>{item.description}</Text>
          </View>
          <IconButton
            icon="pencil"
            iconColor="#4CAF50"
            size={24}
            onPress={() => navigation.navigate("CreateTaskForm", { task: item })}
          />
        </Card.Content>
      </Card>
    </Swipeable>
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={tasks}
        keyExtractor={(item) => item._id}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={fetchTasks} />}
        renderItem={renderTask}
      />

      {/* Floating Action Button */}
      <FAB
        icon="plus"
        style={styles.fab}
        label="New Task"
        onPress={() => navigation.navigate("CreateTaskForm")}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F5F5", paddingHorizontal: 15, paddingTop: 10 },
  card: { marginVertical: 8, elevation: 5, backgroundColor: "#fff", borderRadius: 12, padding: 5 },
  cardContent: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  textContainer: { flex: 1 },
  taskTitle: { fontWeight: "bold", fontSize: 18, color: "#333" },
  taskDescription: { color: "#666", fontSize: 14 },
  deleteAction: { justifyContent: "center", alignItems: "center", backgroundColor: "#E53935", width: 80, borderRadius: 10 },
  fab: { position: "absolute", right: 20, bottom: 20, backgroundColor: "#6200EE", elevation: 5 },
});