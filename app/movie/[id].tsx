import { icons } from "@/constants/icons";
import { fetchMovieDetails } from "@/services/api";
import { saveMovie, unsaveMovie } from "@/services/appwrite";
import useFetch from "@/services/use-fetch";
import { router } from "expo-router";
import { useLocalSearchParams } from "expo-router/build/hooks";
import { BookmarkPlus } from "lucide-react-native";
import React from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface MovieInfoProps {
  label: string;
  value?: string | number | null;
}

const MovieInfo = ({ label, value }: MovieInfoProps) => {
  return (
    <View className="flex-col items-start justify-center mt-5">
      <Text className="text-light-200 font-normal text-sm">{label}</Text>
      <Text className="text-light-100 font-bold text-sm mt-2">
        {value || "N/A"}
      </Text>
    </View>
  );
};

const MovieDetailScreen = () => {
  const { id } = useLocalSearchParams();

  const {
    data: movie,
    isInitialFetching,
    refetch,
  } = useFetch(() => fetchMovieDetails(id as string));

  const handleSave = async () => {
    try {
      if (movie?.isSaved) {
        await unsaveMovie(movie.id);
      } else {
        await saveMovie(movie as MovieDetails);
      }
      refetch();
    } catch (error) {
      console.log({ error });
    }
  };

  if (isInitialFetching)
    return (
      <SafeAreaView className="bg-primary flex-1">
        <ActivityIndicator />
      </SafeAreaView>
    );

  return (
    <View className="bg-primary flex-1">
      <ScrollView contentContainerStyle={{ paddingBottom: 80 }}>
        <View>
          <Image
            source={{
              uri: `https://image.tmdb.org/t/p/w500${movie?.poster_path}`,
            }}
            className="w-full h-[550px]"
            resizeMode="stretch"
          />
        </View>
        <View className="flex-col items-start justify-center mt-5 px-5">
          <View className="w-full flex flex-row items-center justify-between h-fit">
            <View>
              <Text className="text-white font-bold text-xl">
                {movie?.title}
              </Text>
              <View className="flex-row items-center gap-x-1 mt-2">
                <Text className="text-light-200 text-sm">
                  {movie?.release_date?.split("-")[0]}
                </Text>
                <Text className="text-light-200 text-sm">
                  {movie?.runtime}m
                </Text>
              </View>
            </View>
            <TouchableOpacity onPress={handleSave}>
              <BookmarkPlus
                className=""
                size={30}
                color={movie?.isSaved ? "#AB8BFF" : "white"}
              />
            </TouchableOpacity>
          </View>
          <View className="flex-row items-center bg-dark-100 px-2 py-1 rounded-md gap-x-1 mt-2">
            <Image source={icons.star} className="size-4" />
            <Text className="text-white font-bold text-sm">
              {Math.round(movie?.vote_average ?? 0)} / 10
            </Text>
            <Text className="text-light-200 text-sm">
              ({movie?.vote_count}) votes
            </Text>
          </View>
          <MovieInfo label="Overview" value={movie?.overview} />
          <MovieInfo
            label="Genres"
            value={movie?.genres.map((g) => g.name).join(", ") || "N/A"}
          />

          <View className="flex flex-row w-full gap-x-9">
            <MovieInfo
              label="Budget"
              value={`$${(movie?.budget as number) / 1_000_000} million`}
            />
            <MovieInfo
              label="Revenue"
              value={`$${(movie?.revenue as number) / 1_000_000} million`}
            />
          </View>
          <MovieInfo
            label="Production Companies"
            value={
              movie?.production_companies.map((c) => c.name).join(", ") || "N/A"
            }
          />
        </View>
      </ScrollView>
      <TouchableOpacity
        className="absolute bottom-5 left-0 right-0 mx-5 bg-accent rounded-lg py-3.5 flex flex-row items-center justify-center z-50"
        onPress={router.back}
      >
        <Image
          source={icons.arrow}
          className="size-5 mr-1 mt-0.5 rotate-180"
          tintColor={"#fff"}
        />
        <Text className="text-white font-semibold text-base ">Go back</Text>
      </TouchableOpacity>
    </View>
  );
};

export default MovieDetailScreen;
