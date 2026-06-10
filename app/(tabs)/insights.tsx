import { HOME_SUBSCRIPTIONS } from "@/constants/data";
import { icons } from "@/constants/icons";
import { formatCurrency, formatSubscriptionDateTime } from "@/lib/utils";
import dayjs from "dayjs";
import { styled } from "nativewind";
import React from "react";
import { Image, Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";

const SafeAreaView = styled(RNSafeAreaView);

const chartData = [
  { day: "Mon", value: 36 },
  { day: "Tue", value: 31 },
  { day: "Wed", value: 17 },
  { day: "Thr", value: 43, active: true },
  { day: "Fri", value: 35 },
  { day: "Sat", value: 15 },
  { day: "Sun", value: 18 },
];

const maxChartValue = 45;
const monthlyTotal = HOME_SUBSCRIPTIONS.reduce(
  (total, subscription) =>
    total + (subscription.billing === "Yearly" ? subscription.price / 12 : subscription.price),
  0,
);

const Insights = () => {
  return (
    <SafeAreaView className="flex-1 p-5 bg-background">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerClassName="insights-content"
      >
        <View className="insights-nav">
          <Pressable className="insights-circle-button">
            <Image source={icons.back} className="insights-nav-icon" />
          </Pressable>
          <Text className="insights-title">Monthly Insights</Text>
          <Pressable className="insights-circle-button">
            <Image source={icons.menu} className="insights-nav-icon" />
          </Pressable>
        </View>

        <View className="insights-section-head">
          <Text className="insights-section-title">Upcoming</Text>
          <Pressable className="insights-view-all">
            <Text className="insights-view-all-text">View all</Text>
          </Pressable>
        </View>

        <View className="insights-chart-card">
          <View className="insights-chart-grid">
            {[45, 35, 25, 5, 0].map((label) => (
              <View key={label} className="insights-grid-row">
                <Text className="insights-grid-label">{label}</Text>
                <View className="insights-grid-line" />
              </View>
            ))}
          </View>

          <View className="insights-bars">
            {chartData.map((item) => (
              <View key={item.day} className="insights-bar-column">
                <View className="insights-bar-track">
                  {item.active && (
                    <View className="insights-bar-badge">
                      <Text className="insights-bar-badge-text">$40</Text>
                    </View>
                  )}
                  <View
                    className={item.active ? "insights-bar-active" : "insights-bar"}
                    style={{ height: `${(item.value / maxChartValue) * 100}%` }}
                  />
                </View>
                <Text className="insights-bar-label">{item.day}</Text>
              </View>
            ))}
          </View>
        </View>

        <View className="insights-expense-card">
          <View>
            <Text className="insights-expense-title">Expenses</Text>
            <Text className="insights-expense-date">March 2026</Text>
          </View>
          <View className="items-end">
            <Text className="insights-expense-amount">
              -{formatCurrency(monthlyTotal)}
            </Text>
            <Text className="insights-expense-trend">+12%</Text>
          </View>
        </View>

        <View className="insights-section-head">
          <Text className="insights-section-title">History</Text>
          <Pressable className="insights-view-all">
            <Text className="insights-view-all-text">View all</Text>
          </Pressable>
        </View>

        <View className="insights-history-list">
          {HOME_SUBSCRIPTIONS.map((subscription, index) => (
            <View
              key={subscription.id}
              className="insights-history-card"
              style={{
                backgroundColor:
                  subscription.color ?? (index % 2 === 0 ? "#f5c542" : "#b8e8d0"),
              }}
            >
              <View className="insights-history-main">
                <View className="insights-history-icon-wrap">
                  <Image source={subscription.icon} className="insights-history-icon" />
                </View>
                <View className="min-w-0 flex-1">
                  <Text className="insights-history-name" numberOfLines={1}>
                    {subscription.name}
                  </Text>
                  <Text className="insights-history-date" numberOfLines={1}>
                    {subscription.renewalDate
                      ? formatSubscriptionDateTime(subscription.renewalDate)
                      : dayjs().format("MMM D, HH:mm")}
                  </Text>
                </View>
              </View>
              <View className="items-end">
                <Text className="insights-history-price">
                  {formatCurrency(subscription.price, subscription.currency)}
                </Text>
                <Text className="insights-history-billing">
                  per {subscription.billing.toLowerCase()}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Insights;
