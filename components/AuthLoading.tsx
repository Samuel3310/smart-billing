import { ActivityIndicator, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AuthLoading() {
  return (
    <SafeAreaView className="auth-safe-area">
      <View className="flex-1 items-center justify-center px-5">
        <View className="mb-5 size-14 items-center justify-center rounded-2xl bg-accent">
          <Text className="text-2xl font-sans-extrabold text-background">
            R
          </Text>
        </View>
        <ActivityIndicator color="#081126" />
      </View>
    </SafeAreaView>
  );
}
