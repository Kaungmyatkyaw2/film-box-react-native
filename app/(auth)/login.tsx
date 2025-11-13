import { images } from "@/constants/images";
import { useAuth } from "@/context/auth.context";
import { LoginFormSchema, LoginFormType } from "@/schema/auth.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, router } from "expo-router";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { Image, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const LoginScreen = () => {
  const { control, handleSubmit } = useForm({
    resolver: zodResolver(LoginFormSchema),
  });
  const { login } = useAuth();

  const onSubmit = async (formData: LoginFormType) => {
    try {
      const { email, password } = formData;
      const result = await login({ email, password });

      if (result.success) {
        router.push("/profile");
      }

      console.log({ result });
    } catch (error) {
      console.log({ error });
    }
  };

  return (
    <SafeAreaView className="flex-1 w-full min-h-screen flex items-center justify-center bg-primary relative">
      <Image
        source={images.bg}
        className="absolute w-full z-0 top-0"
        resizeMode="cover"
      />

      <View className="px-4 py-5 w-full">
        <View>
          <Text className="text-2xl font-bold text-white">
            Login to Film Box!
          </Text>
          <Text className="text-gray-500">
            Start exploring the world of films.
          </Text>
        </View>

        <View className="mt-10 space-y-4">
          <Controller
            control={control}
            rules={{ required: true }}
            name="email"
            render={({ field, fieldState }) => (
              <View className="mb-6">
                <Text className="text-white ml-1 mb-2 font-semibold">
                  Email
                </Text>
                <TextInput
                  onBlur={field.onBlur}
                  onChangeText={field.onChange}
                  value={field.value}
                  className="text-white bg-dark-200 rounded-lg border border-dark-100 px-4 py-4"
                  placeholderTextColor={"#9CA4AB"}
                  placeholder="johndoe@example.com"
                />
                {fieldState.error?.message && (
                  <Text className="text-red-500 text-sm pt-2 px-4">
                    {fieldState.error.message}
                  </Text>
                )}
              </View>
            )}
          />
          <Controller
            control={control}
            rules={{ required: true }}
            name="password"
            render={({ field, fieldState }) => (
              <View className="mb-8">
                <Text className="text-white ml-1 mb-2 font-semibold">
                  Password
                </Text>
                <TextInput
                  onBlur={field.onBlur}
                  onChangeText={field.onChange}
                  value={field.value}
                  className="text-white bg-dark-200 rounded-lg border border-dark-100 px-4 py-4"
                  placeholderTextColor={"#9CA4AB"}
                  placeholder="*******"
                />
                {fieldState.error?.message && (
                  <Text className="text-red-500 text-sm pt-2 px-4">
                    {fieldState.error.message}
                  </Text>
                )}
              </View>
            )}
          />
          <TouchableOpacity
            className="bg-accent w-full flex flex-row items-center justify-center gap-x-2 py-4 rounded-md"
            onPress={handleSubmit(onSubmit)}
          >
            <Text className="text-white text-lg">Sign in</Text>
          </TouchableOpacity>
        </View>

        <Text className="text-light-200 text-center  mt-7">
          Have not created an account yet?{" "}
          <Link href={"/signup"} className="underline">
            Register here.
          </Link>
        </Text>
      </View>
    </SafeAreaView>
  );
};

export default LoginScreen;
