import React, { useContext, useRef } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  Dimensions, 
  TouchableOpacity, 
  StatusBar, 
  SafeAreaView,
  Animated 
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import SwipeButton from 'rn-swipe-button';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AuthContext } from "../App";
import useAuthenticatedUser from "../../hooks/useAuthenticatedUser";

const { width, height } = Dimensions.get('window');

export default function HomeScreen({ navigation }) {
  const { user } = useAuthenticatedUser();
  const { setUserToken } = useContext(AuthContext);
  const swipeButtonRef = useRef(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useFocusEffect(
    React.useCallback(() => {
      // Fade in animation
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }).start();

      StatusBar.setHidden(true);
      navigation.setOptions({
        headerShown: false,
        tabBarStyle: { display: 'none' }
      });
    }, [navigation, fadeAnim])
  );

  const handleSwipeSuccess = () => {
    if (swipeButtonRef.current) {
      swipeButtonRef.current.reset();
    }
    setTimeout(() => {
      if (swipeButtonRef.current) {
        swipeButtonRef.current.reset();
      }
      navigation.navigate("TaskList");
    }, 400);
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("userToken");
      setUserToken(null);
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar hidden />
      <Image 
        source={require("../../assets/welcome.jpeg")} 
        style={styles.backgroundImage} 
        blurRadius={3}
      />
      <LinearGradient 
        colors={["rgba(0,0,0,0.3)", "rgba(0,0,0,0.8)"]} 
        style={styles.gradient}
      >
        <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <Text style={styles.greetingText}>
                {new Date().getHours() < 12 
                  ? "Good morning" 
                  : new Date().getHours() < 18 
                    ? "Good afternoon" 
                    : "Good evening"}
              </Text>
              <Text style={styles.nameText}>{user?.name || "User"} 👋</Text>
            </View>
            <TouchableOpacity 
              style={styles.logoutButton} 
              onPress={handleLogout}
              activeOpacity={0.8}
            >
              <Ionicons name="log-out-outline" size={24} color="#fff" />
            </TouchableOpacity>
          </View>

          <View style={styles.card}>
            <View style={styles.cardContent}>
              <View style={styles.iconContainer}>
                <Ionicons name="list" size={32} color="#007AFF" />
              </View>
              <Text style={styles.taskText}>Your tasks are waiting</Text>
              <Text style={styles.descriptionText}>
                Start managing your daily tasks and boost your productivity
              </Text>
            </View>

            <View style={styles.swipeButtonWrapper}>
              <SwipeButton
                ref={swipeButtonRef}
                title="Swipe to Start →"
                onSwipeSuccess={handleSwipeSuccess}
                shouldResetAfterSuccess={true}
                resetAfterSuccessAnimDuration={200}
                railBackgroundColor="rgba(0, 122, 255, 0.08)"
                railBorderColor="rgba(0, 122, 255, 0.2)"
                railFillBackgroundColor="#007AFF"
                railFillBorderColor="#007AFF"
                titleColor="#007AFF"
                titleStyles={styles.swipeButtonText}
                thumbIconBackgroundColor="#007AFF"
                thumbIconBorderColor="#007AFF"
                thumbIconComponent={SwipeThumb}
                thumbIconWidth={64}
                height={64}
                containerStyles={styles.swipeButtonContainer}
              />
            </View>
          </View>
        </Animated.View>
      </LinearGradient>
    </SafeAreaView>
  );
}

const SwipeThumb = () => (
  <View style={styles.thumbIcon}>
    <Ionicons name="chevron-forward" size={28} color="#fff" />
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  backgroundImage: {
    position: 'absolute',
    width: width,
    height: height,
    resizeMode: 'cover',
  },
  gradient: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 24,
    paddingTop: 40,
  },
  headerLeft: {
    flex: 1,
  },
  greetingText: {
    fontSize: 20,
    color: '#fff',
    opacity: 0.9,
    fontWeight: '500',
    marginBottom: 8,
  },
  nameText: {
    fontSize: 34,
    color: '#fff',
    fontWeight: 'bold',
  },
  logoutButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.97)',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 30,
    paddingTop: 36,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -10,
    },
    shadowOpacity: 0.1,
    shadowRadius: 24,
    elevation: 20,
  },
  cardContent: {
    alignItems: 'center',
    marginBottom: 30,
  },
  iconContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  taskText: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 12,
    textAlign: 'center',
  },
  descriptionText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  swipeButtonWrapper: {
    width: '100%',
    paddingHorizontal: 10,
  },
  swipeButtonContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 32,
    borderWidth: 1,
    borderColor: 'rgba(0, 122, 255, 0.2)',
    shadowColor: "#007AFF",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  swipeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  thumbIcon: {
    width: '100%',
    height: '100%',
    backgroundColor: '#007AFF',
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
});