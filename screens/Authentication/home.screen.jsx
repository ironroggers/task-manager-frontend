import React, { useContext } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AuthContext } from "../App";
import useAuthenticatedUser from "../../hooks/useAuthenticatedUser";
import { LinearGradient } from "expo-linear-gradient";

export default function HomeScreen({ navigation }) {
  const { setUserToken } = useContext(AuthContext);
  const { user } = useAuthenticatedUser();
  console.log("Logging the current user", user);

  const handleLogout = async () => {
    await AsyncStorage.removeItem("userToken");
    setUserToken(null);
  };

  const handleGoToTask = async () => {
    navigation.navigate("TaskList");
  };

  return (
    <LinearGradient colors={["#007AFF", "#0051A2"]} style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.greeting}>
          Welcome, {user?.name || "User"} 👋
        </Text>
        <Text style={styles.subText}>Manage your tasks efficiently</Text>

        <TouchableOpacity style={styles.buttonPrimary} onPress={handleGoToTask}>
          <Text style={styles.buttonText}>View Tasks</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.buttonSecondary} onPress={handleLogout}>
          <Text style={styles.buttonText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 25,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  greeting: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
  },
  subText: {
    fontSize: 16,
    color: "#666",
    marginBottom: 20,
  },
  buttonPrimary: {
    backgroundColor: "#007AFF",
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
    width: "100%",
    alignItems: "center",
    marginBottom: 10,
    shadowColor: "#007AFF",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  buttonSecondary: {
    backgroundColor: "#DC3545",
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
    width: "100%",
    alignItems: "center",
    shadowColor: "#DC3545",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});

