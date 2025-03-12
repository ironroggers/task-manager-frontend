import React, { useEffect, useState, createContext } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { Button } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import LoginScreen from "./Authentication/login.screen";
import SignupScreen from "./Authentication/signup.screen";
import HomeScreen from "./Authentication/home.screen";
import TaskListScreen from "./Tasks/task-list.screen";
import CreateTaskFormScreen from "./Tasks/create-task-form.screen";
import TaskDetailsScreen from "./Tasks/task-details.screen";
import {PaperProvider} from "react-native-paper";

const Stack = createStackNavigator();
export const AuthContext = createContext();

export default function App() {
  const [userToken, setUserToken] = useState(null);

  useEffect(() => {
    const checkToken = async () => {
      const token = await AsyncStorage.getItem("userToken");
      setUserToken(token);
    };
    checkToken();
  }, []);

  const logout = async () => {
    await AsyncStorage.removeItem("userToken");
    setUserToken(null);
  };

  return (
    <AuthContext.Provider value={{ userToken, setUserToken }}>
      <PaperProvider>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerStyle: { backgroundColor: "#007AFF" },
            headerTintColor: "#FFF",
            headerTitleAlign: "center",
            headerBackTitleVisible: false,
          }}
        >
          {userToken ? (
            <>
              <Stack.Screen
                name="Home"
                component={HomeScreen}
                options={{
                  title: "Home",
                  headerRight: () => (
                    <Button title="Logout" onPress={logout} color="#FFF" />
                  ),
                }}
              />
              <Stack.Screen
                name="TaskList"
                component={TaskListScreen}
                options={{ title: "Tasks", headerBackTitle: "Back" }}
              />
              <Stack.Screen
                name="CreateTaskForm"
                component={CreateTaskFormScreen}
                options={({ route }) => ({
                  title: route.params?.task ? "Edit Task" : "Create Task",
                  headerBackTitle: "Back",
                })}
              />
              <Stack.Screen
                name="TaskDetails"
                component={TaskDetailsScreen}
                options={{ title: "Task Details", headerBackTitle: "Back" }}
              />
            </>
          ) : (
            <>
              <Stack.Screen
                name="Login"
                component={LoginScreen}
                options={{ title: "Login", headerShown: false }}
              />
              <Stack.Screen
                name="Signup"
                component={SignupScreen}
                options={{ title: "Sign Up", headerBackTitle: "Back" }}
              />
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
        </PaperProvider>
    </AuthContext.Provider>
  );
}
