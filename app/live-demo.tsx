import { demoProfileData, useProfile } from "@/contexts/ProfileContext";
import { useRouter } from "expo-router";
import React, { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";

export default function LiveDemoEntry() {
  const router = useRouter();
  const { updateProfileData } = useProfile();

  useEffect(() => {
    updateProfileData(demoProfileData);
    const timer = setTimeout(() => {
      router.replace("/(tabs)");
    }, 0);
    return () => clearTimeout(timer);
  }, [router, updateProfileData]);

  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#FFFFFF",
      }}
    >
      <ActivityIndicator size="large" color="#8B5CF6" />
    </View>
  );
}
