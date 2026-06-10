import { icons } from "@/constants/icons";
import { theme } from "@/constants/theme";
import { clsx } from "clsx";
import dayjs from "dayjs";
import { usePostHog } from "posthog-react-native";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  useWindowDimensions,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type Frequency = "Monthly" | "Yearly";

type CreateSubscriptionModalProps = {
  visible: boolean;
  onClose: () => void;
  onCreate: (subscription: Subscription) => void;
};

const categories = [
  "Entertainment",
  "AI Tools",
  "Developer Tools",
  "Design",
  "Productivity",
  "Cloud",
  "Music",
  "Other",
] as const;

const categoryColors: Record<(typeof categories)[number], string> = {
  Entertainment: "#f6c8d8",
  "AI Tools": "#b8d4e3",
  "Developer Tools": "#e8def8",
  Design: "#b8e8d0",
  Productivity: "#f5c542",
  Cloud: "#b9def8",
  Music: "#c7e7b8",
  Other: "#f6eecf",
};

const frequencies: Frequency[] = ["Monthly", "Yearly"];

const getSubscriptionId = (name: string) => {
  const slug = name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  return `${slug || "subscription"}-${Date.now()}`;
};

const CreateSubscriptionModal = ({
  visible,
  onClose,
  onCreate,
}: CreateSubscriptionModalProps) => {
  const insets = useSafeAreaInsets();
  const { height } = useWindowDimensions();
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [frequency, setFrequency] = useState<Frequency>("Monthly");
  const [category, setCategory] =
    useState<(typeof categories)[number]>("Entertainment");
  const [error, setError] = useState("");

  const parsedPrice = Number(price);
  const canSubmit = name.trim().length > 0 && parsedPrice > 0;
  const bodyMaxHeight = height - theme.spacing[18] - insets.top - insets.bottom;
  const posthog = usePostHog();

  const resetForm = () => {
    setName("");
    setPrice("");
    setFrequency("Monthly");
    setCategory("Entertainment");
    setError("");
  };

  const handleSubmit = () => {
    const normalizedName = name.trim();
    const normalizedPrice = Number(price);

    if (!normalizedName) {
      setError("Enter a subscription name.");
      return;
    }

    if (!Number.isFinite(normalizedPrice) || normalizedPrice <= 0) {
      setError("Enter a positive price.");
      return;
    }

    const startDate = dayjs();
    const renewalDate =
      frequency === "Monthly"
        ? startDate.add(1, "month")
        : startDate.add(1, "year");

    onCreate({
      id: getSubscriptionId(normalizedName),
      icon: icons.wallet,
      name: normalizedName,
      price: normalizedPrice,
      currency: "USD",
      frequency,
      billing: frequency,
      category,
      status: "active",
      startDate: startDate.toISOString(),
      renewalDate: renewalDate.toISOString(),
      color: categoryColors[category],
    });

    posthog.capture("subscription_created", {
      subscription_name: normalizedName,
      subscription_price: normalizedPrice,
      subscription_frequency: frequency,
      subscription_category: category,
    });
    resetForm();
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      presentationStyle="overFullScreen"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <View className="modal-overlay" style={{ zIndex: 1000, elevation: 1000 }}>
        <KeyboardAvoidingView
          className="flex-1 justify-end"
          behavior={Platform.select({ ios: "padding", android: undefined })}
        >
          <View
            className="modal-container"
            style={{
              height,
              maxHeight: height,
              marginTop: 0,
              paddingTop: insets.top,
              paddingBottom: Math.max(insets.bottom, theme.spacing[5]),
              borderTopLeftRadius: 0,
              borderTopRightRadius: 0,
            }}
          >
            <View className="modal-header">
              <Text className="modal-title">New Subscription</Text>
              <Pressable className="modal-close" onPress={onClose}>
                <Text className="modal-close-text">x</Text>
              </Pressable>
            </View>

            <ScrollView
              contentContainerClassName="modal-body"
              style={{ maxHeight: bodyMaxHeight }}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              <View className="auth-field">
                <Text className="auth-label">Name</Text>
                <TextInput
                  className={clsx(
                    "auth-input",
                    error && !name.trim() && "auth-input-error",
                  )}
                  value={name}
                  onChangeText={(value) => {
                    setName(value);
                    setError("");
                  }}
                  placeholder="Netflix"
                  placeholderTextColor="rgba(0, 0, 0, 0.45)"
                  style={{ color: theme.colors.primary }}
                />
              </View>

              <View className="auth-field">
                <Text className="auth-label">Price</Text>
                <TextInput
                  className={clsx(
                    "auth-input",
                    error && !(Number(price) > 0) && "auth-input-error",
                  )}
                  value={price}
                  onChangeText={(value) => {
                    setPrice(value);
                    setError("");
                  }}
                  placeholder="12.99"
                  placeholderTextColor="rgba(0, 0, 0, 0.45)"
                  keyboardType="decimal-pad"
                  style={{ color: theme.colors.primary }}
                />
              </View>

              <View className="auth-field">
                <Text className="auth-label">Frequency</Text>
                <View className="picker-row">
                  {frequencies.map((option) => {
                    const isActive = frequency === option;

                    return (
                      <Pressable
                        key={option}
                        className={clsx(
                          "picker-option",
                          isActive && "picker-option-active",
                        )}
                        onPress={() => setFrequency(option)}
                      >
                        <Text
                          className={clsx(
                            "picker-option-text",
                            isActive && "picker-option-text-active",
                          )}
                        >
                          {option}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>
              </View>

              <View className="auth-field">
                <Text className="auth-label">Category</Text>
                <View className="category-scroll">
                  {categories.map((option) => {
                    const isActive = category === option;

                    return (
                      <Pressable
                        key={option}
                        className={clsx(
                          "category-chip",
                          isActive && "category-chip-active",
                        )}
                        onPress={() => setCategory(option)}
                      >
                        <Text
                          className={clsx(
                            "category-chip-text",
                            isActive && "category-chip-text-active",
                          )}
                        >
                          {option}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>
              </View>

              {error ? <Text className="auth-error">{error}</Text> : null}

              <Pressable
                className={clsx(
                  "auth-button",
                  !canSubmit && "auth-button-disabled",
                )}
                onPress={handleSubmit}
              >
                <Text className="auth-button-text">Create subscription</Text>
              </Pressable>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
};

export default CreateSubscriptionModal;
