import { Link } from "expo-router";
import React from "react";
import { Image, Text, TouchableOpacity } from "react-native";

const SavedCard = ({ movie_id, poster_url, title }: SavedMovie) => {
  return (
    <Link href={`/movie/${movie_id}`} asChild>
      <TouchableOpacity className="w-[30%]">
        <Image
          source={{ uri: poster_url }}
          className="w-full h-48 rounded-lg"
          resizeMode="cover"
        />

        <Text
          className="text-sm font-bold mt-2 text-light-200"
          numberOfLines={2}
        >
          {title}
        </Text>
      </TouchableOpacity>
    </Link>
  );
};

export default SavedCard;
