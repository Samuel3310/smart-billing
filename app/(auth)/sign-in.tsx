import { Link } from "expo-router";
import React from "react";
import { Text, View } from "react-native";

const SignIn = () => {
  return (
    <View>
      <Text>SignIn</Text>
      <Link href="/(auth)/signUp" className="text-blue-500 mt-4">
        Don't have an account? Sign Up
      </Link>
    </View>
  );
};

export default SignIn;
