import React from "react";
import { View, ScrollView, StyleSheet, SafeAreaView } from "react-native";
import { Text, Surface, IconButton, Divider } from "react-native-paper";
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function TaskDetailsScreen({ route, navigation }) {
  const { task, isSampleMode } = route.params;

  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'high':
        return '#FF5252';
      case 'medium':
        return '#FFC107';
      case 'low':
        return '#4CAF50';
      default:
        return '#757575';
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return 'check-circle';
      case 'in progress':
        return 'progress-clock';
      case 'pending':
        return 'clock-outline';
      default:
        return 'help-circle-outline';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <Surface style={styles.card} elevation={2}>
          <View style={styles.header}>
            <Text variant="headlineMedium" style={styles.title}>
              {task.title}
            </Text>
            {!isSampleMode && (
              <IconButton
                icon="pencil"
                iconColor="#4CAF50"
                size={24}
                style={styles.editButton}
                onPress={() => navigation.navigate("CreateTaskForm", { task })}
              />
            )}
          </View>

          <Text style={styles.description}>{task.description}</Text>

          <Divider style={styles.divider} />

          <View style={styles.detailsContainer}>
            <View style={styles.detailRow}>
              <MaterialCommunityIcons 
                name="flag" 
                size={24} 
                color={getPriorityColor(task.priority)} 
              />
              <View style={styles.detailText}>
                <Text style={styles.detailLabel}>Priority</Text>
                <Text style={[styles.detailValue, { color: getPriorityColor(task.priority) }]}>
                  {task.priority || 'Not set'}
                </Text>
              </View>
            </View>

            <View style={styles.detailRow}>
              <MaterialCommunityIcons 
                name={getStatusIcon(task.status)} 
                size={24} 
                color="#6200EE" 
              />
              <View style={styles.detailText}>
                <Text style={styles.detailLabel}>Status</Text>
                <Text style={styles.detailValue}>{task.status || 'Not set'}</Text>
              </View>
            </View>

            <View style={styles.detailRow}>
              <MaterialCommunityIcons name="calendar" size={24} color="#FF9800" />
              <View style={styles.detailText}>
                <Text style={styles.detailLabel}>Due Date</Text>
                <Text style={styles.detailValue}>
                  {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'Not set'}
                </Text>
              </View>
            </View>

            <View style={styles.detailRow}>
              <MaterialCommunityIcons name="clock-outline" size={24} color="#2196F3" />
              <View style={styles.detailText}>
                <Text style={styles.detailLabel}>Estimated Time</Text>
                <Text style={styles.detailValue}>
                  {task.estimatedTime ? `${task.estimatedTime} hours` : 'Not specified'}
                </Text>
              </View>
            </View>

            <View style={styles.detailRow}>
              <MaterialCommunityIcons name="calendar-clock" size={24} color="#757575" />
              <View style={styles.detailText}>
                <Text style={styles.detailLabel}>Created</Text>
                <Text style={styles.detailValue}>
                  {new Date(task.createdAt).toLocaleString()}
                </Text>
              </View>
            </View>
          </View>
        </Surface>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  scrollView: {
    flex: 1,
  },
  card: {
    margin: 16,
    padding: 16,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  title: {
    flex: 1,
    fontSize: 24,
    fontWeight: "700",
    color: '#1A1A1A',
    marginRight: 16,
  },
  editButton: {
    margin: 0,
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: '#424242',
    marginBottom: 24,
  },
  divider: {
    marginVertical: 16,
    backgroundColor: '#E0E0E0',
  },
  detailsContainer: {
    gap: 20,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailText: {
    marginLeft: 16,
    flex: 1,
  },
  detailLabel: {
    fontSize: 14,
    color: '#757575',
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 16,
    color: '#1A1A1A',
    fontWeight: '500',
  },
});
