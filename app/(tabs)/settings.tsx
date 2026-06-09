import ImageBase from "@/constants/image";
import { useClerk, useUser } from "@clerk/expo";
import dayjs from "dayjs";
import { useRouter } from "expo-router";
import { styled } from "nativewind";
import React from "react";
import {
  ActivityIndicator,
  Image,
  Pressable,
  Text,
  View,
} from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";

const SafeAreaView = styled(RNSafeAreaView);
const Settings = () => {
  const { signOut } = useClerk();
  const { user } = useUser();
  const router = useRouter();
  const [isSigningOut, setIsSigningOut] = React.useState(false);
  const displayName = user?.fullName || user?.username || "User";
  const emailAddress = user?.primaryEmailAddress?.emailAddress || "No email";
  const joinedDate = user?.createdAt
    ? dayjs(user.createdAt).format("DD.MM.YYYY")
    : "--";

  const handleLogout = async () => {
    setIsSigningOut(true);

    try {
      await signOut();
      router.replace("/(auth)/sign-in");
    } finally {
      setIsSigningOut(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 p-5 bg-background">
      <View className="settings-screen">
        <View className="settings-content">
          <View className="settings-profile-card">
            <Image
              source={user?.imageUrl ? { uri: user.imageUrl } : ImageBase.avatar}
              className="settings-avatar"
            />
            <View className="settings-profile-copy">
              <Text className="settings-name" numberOfLines={1}>
                {displayName}
              </Text>
              <Text className="settings-email" numberOfLines={1}>
                {emailAddress}
              </Text>
            </View>
          </View>

          <View className="settings-account-card">
            <Text className="settings-section-title">Account</Text>

            <View className="settings-row">
              <Text className="settings-label">Account ID</Text>
              <Text
                className="settings-value"
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {user?.id || "--"}
              </Text>
            </View>

            <View className="settings-row">
              <Text className="settings-label">Joined</Text>
              <Text className="settings-value">{joinedDate}</Text>
            </View>
          </View>
        </View>

        <Pressable
          className="settings-logout"
          disabled={isSigningOut}
          onPress={handleLogout}
        >
          {isSigningOut ? (
            <ActivityIndicator color="#fff9e3" />
          ) : (
            <Text className="settings-logout-text">Log out</Text>
          )}
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

export default Settings;
