import { isClerkAPIResponseError, useAuth, useSignIn } from "@clerk/expo";
import AuthLoading from "@/components/AuthLoading";
import { clsx } from "clsx";
import { Link, Redirect, useRouter, type Href } from "expo-router";
import { styled } from "nativewind";
import React from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";

const SafeAreaView = styled(RNSafeAreaView);

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const getClerkError = (error: unknown) => {
  if (isClerkAPIResponseError(error)) {
    return error.errors[0]?.longMessage || error.errors[0]?.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Something went wrong. Please try again.";
};

export default function SignIn() {
  const { isLoaded, isSignedIn } = useAuth();
  const { signIn, fetchStatus } = useSignIn();
  const router = useRouter();
  const [emailAddress, setEmailAddress] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [code, setCode] = React.useState("");
  const [localError, setLocalError] = React.useState("");
  const [isLocallySubmitting, setIsLocallySubmitting] = React.useState(false);
  const isSubmitting = fetchStatus === "fetching" || isLocallySubmitting;
  const isMfa = signIn?.status === "needs_client_trust";
  const normalizedEmail = emailAddress.trim();

  const emailError =
    normalizedEmail.length > 0 && !emailPattern.test(normalizedEmail)
      ? "Enter a valid email address."
      : "";
  const passwordError =
    password.length > 0 && password.length < 8
      ? "Password must be at least 8 characters."
      : "";
  const canVerify = code.trim().length >= 4 && !isSubmitting;

  const navigateHome = async () => {
    await signIn.finalize({
      navigate: ({ session, decorateUrl }) => {
        if (session?.currentTask) {
          setLocalError("Finish the required account task to continue.");
          return;
        }

        const url = decorateUrl("/(tabs)");
        if (url.startsWith("http")) {
          window.location.href = url;
        } else {
          router.replace(url as Href);
        }
      },
    });
  };

  const handleSubmit = async () => {
    setLocalError("");

    if (!emailPattern.test(normalizedEmail)) {
      setLocalError("Enter a valid email address.");
      return;
    }

    if (password.length < 8) {
      setLocalError("Password must be at least 8 characters.");
      return;
    }

    setIsLocallySubmitting(true);

    try {
      const { error } = await signIn.password({
        emailAddress: normalizedEmail,
        password,
      });

      if (error) {
        setLocalError(getClerkError(error));
        return;
      }

      if (signIn.status === "complete") {
        await navigateHome();
      } else if (signIn.status === "needs_client_trust") {
        const emailCodeFactor = signIn.supportedSecondFactors.find(
          (factor) => factor.strategy === "email_code",
        );

        if (emailCodeFactor) {
          await signIn.mfa.sendEmailCode();
        } else {
          setLocalError(
            "This account requires a verification method that is not enabled here.",
          );
        }
      } else if (signIn.status === "needs_second_factor") {
        setLocalError("Complete your second factor to continue.");
      } else {
        setLocalError(
          "We need a little more information before signing you in.",
        );
      }
    } catch (error) {
      setLocalError(getClerkError(error));
    } finally {
      setIsLocallySubmitting(false);
    }
  };

  const handleVerify = async () => {
    setLocalError("");

    try {
      await signIn.mfa.verifyEmailCode({ code: code.trim() });

      if (signIn.status === "complete") {
        await navigateHome();
      } else {
        setLocalError("That code did not complete sign in. Please try again.");
      }
    } catch (error) {
      setLocalError(getClerkError(error));
    }
  };

  const renderError = localError;

  if (!isLoaded) {
    return <AuthLoading />;
  }

  if (isLoaded && isSignedIn) {
    return <Redirect href="/(tabs)" />;
  }

  return (
    <SafeAreaView className="flex-1 p-5 bg-background">
      <KeyboardAvoidingView
        behavior={Platform.select({ ios: "padding", android: undefined })}
        className="auth-screen"
      >
        <ScrollView
          className="auth-scroll"
          contentContainerClassName="auth-content"
          keyboardShouldPersistTaps="handled"
        >
          <View className="auth-brand-block">
            <View className="auth-logo-wrap">
              <View className="auth-logo-mark">
                <Text className="auth-logo-mark-text">R</Text>
              </View>
              <View>
                <Text className="auth-wordmark">Recurly</Text>
                <Text className="auth-wordmark-sub">Smart billing</Text>
              </View>
            </View>

            <Text className="auth-title">
              {isMfa ? "Check your inbox" : "Welcome back"}
            </Text>
            <Text className="auth-subtitle">
              {isMfa
                ? "Enter the verification code we sent to your email."
                : "Sign in to continue managing your subscriptions."}
            </Text>
          </View>

          <View className="auth-card">
            <View className="auth-form">
              {isMfa ? (
                <>
                  <View className="auth-field">
                    <Text className="auth-label">Verification code</Text>
                    <TextInput
                      className={clsx(
                        "auth-input",
                        renderError && "auth-input-error",
                      )}
                      value={code}
                      onChangeText={setCode}
                      placeholder="Enter your code"
                      placeholderTextColor="rgba(0, 0, 0, 0.45)"
                      keyboardType="number-pad"
                      autoCapitalize="none"
                      autoCorrect={false}
                    />
                  </View>

                  {renderError ? (
                    <Text className="auth-error">{renderError}</Text>
                  ) : null}

                  <Pressable
                    className={clsx(
                      "auth-button",
                      !canVerify && "auth-button-disabled",
                    )}
                    disabled={!canVerify}
                    onPress={handleVerify}
                  >
                    {isSubmitting ? (
                      <ActivityIndicator color="#081126" />
                    ) : (
                      <Text className="auth-button-text">Verify</Text>
                    )}
                  </Pressable>

                  <Pressable
                    className="auth-secondary-button"
                    disabled={isSubmitting}
                    onPress={() => signIn.mfa.sendEmailCode()}
                  >
                    <Text className="auth-secondary-button-text">
                      Send a new code
                    </Text>
                  </Pressable>

                  <Pressable
                    className="auth-secondary-button"
                    disabled={isSubmitting}
                    onPress={() => signIn.reset()}
                  >
                    <Text className="auth-secondary-button-text">
                      Start over
                    </Text>
                  </Pressable>
                </>
              ) : (
                <>
                  <View className="auth-field">
                    <Text className="auth-label">Email</Text>
                    <TextInput
                      className={clsx(
                        "auth-input",
                        emailError && "auth-input-error",
                      )}
                      value={emailAddress}
                      onChangeText={setEmailAddress}
                      placeholder="Enter your email"
                      placeholderTextColor="rgba(0, 0, 0, 0.45)"
                      keyboardType="email-address"
                      textContentType="emailAddress"
                      autoComplete="email"
                      autoCapitalize="none"
                      autoCorrect={false}
                    />
                    {emailError ? (
                      <Text className="auth-error">{emailError}</Text>
                    ) : null}
                  </View>

                  <View className="auth-field">
                    <Text className="auth-label">Password</Text>
                    <TextInput
                      className={clsx(
                        "auth-input",
                        passwordError && "auth-input-error",
                      )}
                      value={password}
                      onChangeText={setPassword}
                      placeholder="Enter your password"
                      placeholderTextColor="rgba(0, 0, 0, 0.45)"
                      textContentType="password"
                      autoComplete="current-password"
                      secureTextEntry
                    />
                    {passwordError ? (
                      <Text className="auth-error">{passwordError}</Text>
                    ) : null}
                  </View>

                  {renderError ? (
                    <Text className="auth-error">{renderError}</Text>
                  ) : null}

                  <Pressable
                    className={clsx(
                      "auth-button",
                      isSubmitting && "auth-button-disabled",
                    )}
                    disabled={isSubmitting}
                    onPress={handleSubmit}
                  >
                    {isSubmitting ? (
                      <ActivityIndicator color="#081126" />
                    ) : (
                      <Text className="auth-button-text">Sign in</Text>
                    )}
                  </Pressable>

                  <View className="auth-link-row">
                    <Text className="auth-link-copy">New to Recurly?</Text>
                    <Link href="/sign-up" replace>
                      <Text className="auth-link">Create an account</Text>
                    </Link>
                  </View>
                </>
              )}
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
