import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {jwtDecode} from "jwt-decode";

const useAuthenticatedUser = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const token = await AsyncStorage.getItem("userToken");
        if (token) {
          // Decode JWT token to get user details
          console.log("Logging the authToken", token);
          const decodedUser = jwtDecode(token);
          console.log("Logging the decoded User", decodedUser);
          setUser({
            userId: decodedUser?.userId,
            name: decodedUser?.name || decodedUser?.username || 'User', // Add name from token
          });
        } else {
          console.log("Logging the authToken", token);
          setUser(null);
        }
      } catch (error) {
        console.error("Error checking auth status:", error);
      }
    };

    checkUser();
  }, []);

  return { user };
};

export default useAuthenticatedUser;
