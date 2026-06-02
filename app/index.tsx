import { Link } from "expo-router";
import { Text, View } from "react-native";

export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
      className="bg-background"
    >
      <Text className="text-indigo-500 text-2xl font-bold bg-background">
        Edit Here we go app/index.tsx
      </Text>
      <Link href="/onboarding" className="text-blue-500 mt-4">
        Go to Onboarding
      </Link>
      <Link href="/(auth)/signUp" className="text-blue-500 mt-4">
        Go to sign in
      </Link>
      <Link href="/(auth)/sign-in" className="text-blue-500 mt-4">
        Go to sign in
      </Link>
    </View>
  );
}
