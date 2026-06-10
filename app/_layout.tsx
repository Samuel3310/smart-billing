import "@/global.css";
import { ClerkProvider } from "@clerk/expo";
import { tokenCache } from "@clerk/expo/token-cache";
import { useFonts } from "expo-font";
import {
  SplashScreen,
  Stack,
  useGlobalSearchParams,
  usePathname,
} from "expo-router";
import { PostHogProvider, usePostHog } from "posthog-react-native";
import { useEffect, useMemo } from "react";

SplashScreen.preventAutoHideAsync();

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY ?? "";
const postHogApiKey = process.env.EXPO_PUBLIC_POSTHOG_API_KEY ?? "";
const postHogHost =
  process.env.EXPO_PUBLIC_POSTHOG_HOST ?? "https://us.i.posthog.com";

if (!publishableKey) {
  throw new Error("Add EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY to your .env file");
}

if (!postHogApiKey) {
  throw new Error("Add EXPO_PUBLIC_POSTHOG_API_KEY to your .env file");
}

function PostHogScreenTracker() {
  const posthog = usePostHog();
  const pathname = usePathname();
  const params = useGlobalSearchParams();
  const serializedParams = useMemo(() => JSON.stringify(params), [params]);

  useEffect(() => {
    posthog.screen(pathname, {
      pathname,
      params: JSON.parse(serializedParams),
    });
  }, [pathname, posthog, serializedParams]);

  return null;
}

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    "sans-regular": require("../assets/fonts/PlusJakartaSans-Regular.ttf"),
    "sans-medium": require("../assets/fonts/PlusJakartaSans-Medium.ttf"),
    "sans-semibold": require("../assets/fonts/PlusJakartaSans-SemiBold.ttf"),
    "sans-bold": require("../assets/fonts/PlusJakartaSans-Bold.ttf"),
    "sans-extrabold": require("../assets/fonts/PlusJakartaSans-ExtraBold.ttf"),
    "sans-light": require("../assets/fonts/PlusJakartaSans-Light.ttf"),
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }
  return (
    <PostHogProvider
      apiKey={postHogApiKey}
      options={{ host: postHogHost }}
      autocapture={{ captureScreens: false }}
    >
      <PostHogScreenTracker />
      <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
        <Stack initialRouteName="(auth)" screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="subscriptions/[id]" />
        </Stack>
      </ClerkProvider>
    </PostHogProvider>
  );
}
