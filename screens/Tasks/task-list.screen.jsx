import React, { useEffect, useState, useCallback } from "react";
import { View, FlatList, Alert, SafeAreaView, RefreshControl, StyleSheet, Animated, TouchableOpacity } from "react-native";
import { Card, Text, FAB, IconButton, Surface, ActivityIndicator } from "react-native-paper";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import API_URL from "../../src/config";
import { Swipeable } from "react-native-gesture-handler";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import sampleTasks from '../../src/data/sample-tasks.json';

export default function TaskListScreen({ navigation }) {
  const [tasks, setTasks] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSampleMode, setIsSampleMode] = useState(false);

  const fetchTasks = useCallback(async () => {
    if (!refreshing) setIsLoading(true);
    try {
      const token = await AsyncStorage.getItem("userToken");
      const response = await axios.get(`${API_URL}/tasks`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(isSampleMode ? sampleTasks.tasks : response.data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  }, [refreshing, isSampleMode]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const loadSampleTasks = () => {
    setIsSampleMode(true);
    setTasks(sampleTasks.tasks);
  };

  const unloadSampleTasks = async () => {
    setIsSampleMode(false);
    setIsLoading(true);
    try {
      const token = await AsyncStorage.getItem("userToken");
      const response = await axios.get(`${API_URL}/tasks`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(response.data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteTask = async (taskId) => {
    if (isSampleMode) return; // Prevent deletion in sample mode

    Alert.alert("Delete Task", "Are you sure you want to delete this task?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
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

  const renderRightActions = (progress, dragX, taskId) => {
    const scale = dragX.interpolate({
      inputRange: [-100, 0],
      outputRange: [1, 0],
      extrapolate: 'clamp',
    });

    return (
      <Animated.View style={[styles.deleteAction, { transform: [{ scale }] }]}>
        <IconButton 
          icon="delete-outline" 
          iconColor="white" 
          size={28} 
          onPress={() => deleteTask(taskId)}
        />
      </Animated.View>
    );
  };

  const renderTask = ({ item, index }) => {
    const animatedValue = new Animated.Value(0);
    Animated.timing(animatedValue, {
      toValue: 1,
      duration: 300,
      delay: index * 100,
      useNativeDriver: true,
    }).start();

    return (
      <Animated.View style={{
        opacity: animatedValue,
        transform: [{
          translateY: animatedValue.interpolate({
            inputRange: [0, 1],
            outputRange: [50, 0],
          }),
        }],
      }}>
        <Swipeable
          enabled={!isSampleMode}
          renderRightActions={(progress, dragX) => 
            !isSampleMode ? renderRightActions(progress, dragX, item._id) : null
          }
        >
          <TouchableOpacity 
            onPress={() => navigation.navigate("TaskDetails", { 
              task: item,
              isSampleMode: isSampleMode
            })}
            activeOpacity={0.7}
          >
            <Surface style={styles.card} elevation={2}>
              <Card.Content style={styles.cardContent}>
                <View style={styles.textContainer}>
                  <Text variant="titleLarge" style={styles.taskTitle}>
                    {item.title}
                  </Text>
                  <Text 
                    variant="bodyMedium" 
                    style={styles.taskDescription} 
                    numberOfLines={2}
                  >
                    {item.description}
                  </Text>
                </View>
                {!isSampleMode && (
                  <IconButton
                    icon="pencil-outline"
                    iconColor="#4CAF50"
                    size={24}
                    style={styles.editButton}
                    onPress={() => navigation.navigate("CreateTaskForm", { task: item })}
                  />
                )}
              </Card.Content>
            </Surface>
          </TouchableOpacity>
        </Swipeable>
      </Animated.View>
    );
  };

  const ListEmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyIconContainer}>
        <MaterialCommunityIcons 
          name="clipboard-text-outline" 
          size={80} 
          color="#6200EE" 
        />
        <View style={styles.emptyIconOverlay}>
          <MaterialCommunityIcons 
            name="plus-circle" 
            size={32} 
            color="#4CAF50" 
            style={styles.plusIcon}
          />
        </View>
      </View>
      <Text style={styles.emptyText}>No Tasks Yet</Text>
      <Text style={styles.emptySubText}>
        Get started by creating your first task{'\n'}
        or load sample tasks below.
      </Text>
      <View style={styles.emptyButtonsContainer}>
        <TouchableOpacity
          style={styles.emptyButton}
          onPress={() => navigation.navigate("CreateTaskForm")}
        >
          <MaterialCommunityIcons name="plus" size={24} color="#FFFFFF" />
          <Text style={styles.emptyButtonText}>Create Task</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.emptyButton, styles.sampleButton]}
          onPress={loadSampleTasks}
        >
          <MaterialCommunityIcons name="database-import" size={24} color="#FFFFFF" />
          <Text style={styles.emptyButtonText}>Load Samples</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6200EE" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        {isSampleMode && (
          <View style={styles.sampleModeBar}>
            <Text style={styles.sampleModeText}>Sample Tasks Mode</Text>
            <TouchableOpacity
              style={styles.unloadButton}
              onPress={unloadSampleTasks}
            >
              <MaterialCommunityIcons name="close" size={20} color="#FFFFFF" />
              <Text style={styles.unloadButtonText}>Return to My Tasks</Text>
            </TouchableOpacity>
          </View>
        )}
        
        <FlatList
          contentContainerStyle={[
            styles.listContainer,
            tasks.length === 0 && styles.emptyList
          ]}
          data={tasks}
          keyExtractor={(item, index) => item._id || `sample-${index}`}
          refreshControl={
            <RefreshControl 
              refreshing={refreshing} 
              onRefresh={() => {
                setRefreshing(true);
                fetchTasks();
              }}
              colors={['#6200EE']}
              tintColor="#6200EE"
              enabled={!isSampleMode}
            />
          }
          renderItem={renderTask}
          ListEmptyComponent={ListEmptyComponent}
          showsVerticalScrollIndicator={false}
        />

        {tasks.length > 0 && !isSampleMode && (
          <FAB
            icon="plus"
            label="New Task"
            style={styles.fab}
            onPress={() => navigation.navigate("CreateTaskForm")}
            color="#FFFFFF"
          />
        )}
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#F5F5F5",
  },
  safeArea: {
    flex: 1,
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 90,
  },
  emptyList: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  card: { 
    marginVertical: 6,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    overflow: 'hidden',
  },
  cardContent: { 
    flexDirection: "row", 
    alignItems: "center", 
    justifyContent: "space-between",
    padding: 16,
  },
  textContainer: { 
    flex: 1,
    marginRight: 16,
  },
  taskTitle: { 
    fontSize: 18,
    fontWeight: "700",
    color: "#1A1A1A",
    marginBottom: 4,
  },
  taskDescription: { 
    color: "#757575",
    fontSize: 14,
    lineHeight: 20,
  },
  deleteAction: { 
    justifyContent: "center", 
    alignItems: "center", 
    backgroundColor: "#FF5252", 
    width: 80,
    height: '100%',
  },
  editButton: {
    margin: 0,
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
  },
  fab: { 
    position: "absolute", 
    right: 16, 
    bottom: 16, 
    backgroundColor: "#6200EE",
    borderRadius: 16,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    minHeight: 500,
  },
  emptyIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(98, 0, 238, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    position: 'relative',
  },
  emptyIconOverlay: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 4,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  plusIcon: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  emptyText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 12,
    textAlign: 'center',
  },
  emptySubText: {
    fontSize: 16,
    color: '#757575',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  emptyButtonsContainer: {
    flexDirection: 'row',
    gap: 16,
  },
  emptyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#6200EE',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    shadowColor: "#6200EE",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  sampleButton: {
    backgroundColor: '#4CAF50',
  },
  emptyButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  sampleModeBar: {
    backgroundColor: '#4CAF50',
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sampleModeText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  unloadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  unloadButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
});