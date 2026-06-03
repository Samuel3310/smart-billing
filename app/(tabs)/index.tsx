import { Link } from "expo-router";
import { styled } from "nativewind";
import { Text, View } from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";

const SafeAreaView = styled(RNSafeAreaView);

export default function Index() {
  return (
    <SafeAreaView className="flex-1 p-5 bg-background">
      <View className="flex-1 ">
        <Text className="text-5xl font-sans-extrabold ">Home</Text>
        <Link href="/onboarding" className="bg-primary  mt-4">
          Go to Onboarding
        </Link>
        <Link href="/(auth)/signUp" className="text-blue-500 mt-4">
          Go to sign in
        </Link>
        <Link href="/(auth)/sign-in" className="text-blue-500 mt-4">
          Go to sign in
        </Link>
      </View>
    </SafeAreaView>
  );
}
