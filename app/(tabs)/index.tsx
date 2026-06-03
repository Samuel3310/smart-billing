import { Link } from "expo-router";

import { styled } from "nativewind";
import { Text, View } from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";

const SafeAreaView = styled(RNSafeAreaView);

export default function Index() {
  return (
    <SafeAreaView className="flex-1 p-5 bg-background">
      <View className="flex-1 ">
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
        <Link href="/subscriptions/spotify" className="text-blue-500 mt-4">
          Spotify Details
        </Link>
        <Link
          href={{
            pathname: "/subscriptions/[id]",
            params: { id: "spotify" },
          }}
          className="text-blue-500 mt-4"
        >
          Go to Subscription Details
        </Link>
      </View>
    </SafeAreaView>
  );
}
