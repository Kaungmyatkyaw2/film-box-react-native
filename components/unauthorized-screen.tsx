import { icons } from "@/constants/icons";
import { Link } from "expo-router";
import React from "react";
import { Image, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const UnauthorizedScreen = () => {
  return (
    <SafeAreaView className="bg-primary flex-1 flex flex-col gap-4 items-center justify-center px-4">
      <Image source={icons.person} className="size-6" tintColor={"white"} />
      <Link href={"/login"} asChild>
        <TouchableOpacity className="flex w-full py-4 rounded-lg bg-accent">
          <Text className="text-center text-white text-lg font-bold">
            Sign in to your account
          </Text>
        </TouchableOpacity>
      </Link>
    </SafeAreaView>
  );
};

export default UnauthorizedScreen;
