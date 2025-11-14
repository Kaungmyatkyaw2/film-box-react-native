import UnauthorizedScreen from "@/components/unauthorized-screen";
import { images } from "@/constants/images";
import { useAuth } from "@/context/auth.context";
import { BookmarkIcon, MessageCircle, Power } from "lucide-react-native";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const ProfileScreen = () => {
  const { user, logout } = useAuth();

  if (!user) {
    return <UnauthorizedScreen />;
  }

  const handleOnLogoutPress = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Error while signing out: ", error);
    }
  };

  return (
    <SafeAreaView className="bg-primary flex-1 relative">
      <Image
        source={images.bg}
        className="absolute w-full z-0 top-0"
        resizeMode="cover"
      />

      <TouchableOpacity
        className="absolute top-12 right-6 rounded-full bg-accent/40 size-12 flex items-center justify-center"
        onPress={handleOnLogoutPress}
      >
        <Power className=" size-6 " color={"white"} />
      </TouchableOpacity>

      <View className="h-fit px-4 py-2 pb-9 mt-9 border-white flex flex-col items-center justify-center gap-5">
        <Image
          source={images.profilePlaceholder}
          className="size-24 rounded-full object-cover"
          resizeMode="cover"
        />
        <View>
          <Text className="text-center text-xl font-bold text-white">
            {user?.name}
          </Text>
          <Text className="text-light-200">{user?.email}</Text>
        </View>
      </View>

      <View className="px-4 flex flex-row gap-4 w-full">
        <View className="bg-dark-100 px-4 py-7 rounded-lg w-1/2 border">
          <BookmarkIcon className="size-5" color={"#3b82f6"} />
          <Text className="text-5xl text-white font-bold my-6">10</Text>
          <Text className="font-semibold text-light-300">Saved Movies</Text>
        </View>
        <View className="bg-dark-100 px-4 py-7 rounded-lg w-1/2 border">
          <MessageCircle className="size-5" color={"#10b981"} />
          <Text className="text-5xl text-white font-bold my-6">5</Text>
          <Text className="font-semibold text-light-300">Review Movies</Text>
        </View>
      </View>
      <View className="mt-9 px-4 flex flex-col gap-8">
        <TouchableOpacity className="flex w-full py-4 rounded-lg bg-accent">
          <Text className="text-center text-white text-lg font-bold">
            View My Watchlist
          </Text>
        </TouchableOpacity>
        <TouchableOpacity className="flex w-full py-4 rounded-lg border border-accent">
          <Text className="text-center text-accent text-lg font-bold">
            My Reviews
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default ProfileScreen;
