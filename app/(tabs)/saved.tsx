import SavedCard from "@/components/saved-card";
import UnauthorizedScreen from "@/components/unauthorized-screen";
import { images } from "@/constants/images";
import { useAuth } from "@/context/auth.context";
import { getMySavedMovies } from "@/services/appwrite";
import useFetch from "@/services/use-fetch";
import { Link } from "expo-router";
import { ActivityIndicator, Image, ScrollView, Text, View } from "react-native";

const SavedScreen = () => {
  const { user } = useAuth();
  const { loading, data, error } = useFetch(() => getMySavedMovies(), true);

  if (!user) {
    return <UnauthorizedScreen />;
  }

  return (
    <View className="flex-1 bg-primary">
      <Image
        source={images.bg}
        className="absolute w-full z-0"
        resizeMode="cover"
      />

      <ScrollView
        className="flex-1 px-5"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 10 }}
      >
        {loading ? (
          <ActivityIndicator
            size="large"
            color="#0000ff"
            className="mt-10 self-center"
          />
        ) : error ? (
          <Text className="text-center w-full text-red-500 py-7">
            Error: {error?.message}
          </Text>
        ) : (
          <View className="mt-10">
            <Text className="text-2xl text-white font-bold mt-5 mb-9">
              Your Saved Movies
            </Text>

            {/* Simple grid without FlatList */}
            <View className="flex-row flex-wrap justify-start gap-5">
              {data?.map((item) => (
                <SavedCard key={item.movie_id.toString()} {...item} />
              ))}
            </View>

            <Text className="text-light-200 text-center mt-14">
              Run out of new movies?{" "}
              <Link href={"/"} className="underline">
                Explore here.
              </Link>
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default SavedScreen;
