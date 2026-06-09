import { isClerkAPIResponseError, useAuth, useSignUp } from "@clerk/expo";
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

export default function SignUp() {
  const { signUp, fetchStatus } = useSignUp();
  const { isSignedIn } = useAuth();
  const router = useRouter();
  const [emailAddress, setEmailAddress] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [code, setCode] = React.useState("");
  const [localError, setLocalError] = React.useState("");
  const isSubmitting = fetchStatus === "fetching";
  const isVerifying =
    signUp?.status === "missing_requirements" &&
    signUp.unverifiedFields.includes("email_address") &&
    signUp.missingFields.length === 0;

  const emailError =
    emailAddress.length > 0 && !emailPattern.test(emailAddress)
      ? "Enter a valid email address."
      : "";
  const passwordError =
    password.length > 0 && password.length < 8
      ? "Use at least 8 characters."
      : "";
  const canSubmit =
    emailPattern.test(emailAddress) && password.length >= 8 && !isSubmitting;
  const canVerify = code.trim().length >= 4 && !isSubmitting;

  const finishSignUp = async () => {
    await signUp.finalize({
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

    if (!emailPattern.test(emailAddress)) {
      setLocalError("Enter a valid email address.");
      return;
    }

    if (password.length < 8) {
      setLocalError("Password must be at least 8 characters.");
      return;
    }

    try {
      const { error } = await signUp.password({
        emailAddress: emailAddress.trim(),
        password,
      });

      if (error) {
        setLocalError(getClerkError(error));
        return;
      }

      await signUp.verifications.sendEmailCode();
    } catch (error) {
      setLocalError(getClerkError(error));
    }
  };

  const handleVerify = async () => {
    setLocalError("");

    try {
      await signUp.verifications.verifyEmailCode({
        code: code.trim(),
      });

      if (signUp.status === "complete") {
        await finishSignUp();
      } else {
        setLocalError("That code did not complete sign up. Please try again.");
      }
    } catch (error) {
      setLocalError(getClerkError(error));
    }
  };

  if (isSignedIn || signUp?.status === "complete") {
    return <Redirect href="/(tabs)" />;
  }

  const renderError = localError;

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
              {isVerifying ? "Verify your email" : "Create your account"}
            </Text>
            <Text className="auth-subtitle">
              {isVerifying
                ? "Enter the code we sent so your subscription data stays protected."
                : "Start tracking renewals, spend, and subscription changes in one place."}
            </Text>
          </View>

          <View className="auth-card">
            <View className="auth-form">
              {isVerifying ? (
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
                    <Text className="auth-helper">
                      Sent to {emailAddress.trim()}
                    </Text>
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
                      <Text className="auth-button-text">Verify account</Text>
                    )}
                  </Pressable>

                  <Pressable
                    className="auth-secondary-button"
                    disabled={isSubmitting}
                    onPress={() => signUp.verifications.sendEmailCode()}
                  >
                    <Text className="auth-secondary-button-text">
                      Send a new code
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
                      placeholder="Create a password"
                      placeholderTextColor="rgba(0, 0, 0, 0.45)"
                      textContentType="newPassword"
                      autoComplete="new-password"
                      secureTextEntry
                    />
                    {passwordError ? (
                      <Text className="auth-error">{passwordError}</Text>
                    ) : (
                      <Text className="auth-helper">
                        At least 8 characters.
                      </Text>
                    )}
                  </View>

                  {renderError ? (
                    <Text className="auth-error">{renderError}</Text>
                  ) : null}

                  <Pressable
                    className={clsx(
                      "auth-button",
                      !canSubmit && "auth-button-disabled",
                    )}
                    disabled={!canSubmit}
                    onPress={handleSubmit}
                  >
                    {isSubmitting ? (
                      <ActivityIndicator color="#081126" />
                    ) : (
                      <Text className="auth-button-text">Create account</Text>
                    )}
                  </Pressable>

                  <View nativeID="clerk-captcha" />

                  <View className="auth-link-row">
                    <Text className="auth-link-copy">
                      Already have an account?
                    </Text>
                    <Link href="/sign-in" replace>
                      <Text className="auth-link">Sign in</Text>
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
