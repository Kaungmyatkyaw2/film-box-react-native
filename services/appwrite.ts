import { Account, Client, Databases, ID, Query } from "react-native-appwrite";

const DATABASE_ID = process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID!;
const TABLE_ID = process.env.EXPO_PUBLIC_APPWRITE_TABLE_ID!;

const client = new Client()
  .setEndpoint("https://cloud.appwrite.io/v1")
  .setProject(process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!);

const database = new Databases(client);

export const account = new Account(client);

export const updateSearchCount = async (query: string, movie: Movie) => {
  try {
    const result = await database.listDocuments(DATABASE_ID, TABLE_ID, [
      Query.equal("searchTerm", query),
    ]);

    if (result.documents.length > 0) {
      const existingMovie = result.documents[0];

      await database.updateDocument(DATABASE_ID, TABLE_ID, existingMovie.$id, {
        count: existingMovie.count + 1,
      });
    } else {
      await database.createDocument(DATABASE_ID, TABLE_ID, ID.unique(), {
        searchTerm: query,
        movie_id: movie.id,
        count: 1,
        title: movie.title,
        poster_url: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
      });
    }
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const getTrendingMovies = async (): Promise<
  TrendingMovie[] | undefined
> => {
  try {
    const result = await database.listDocuments(DATABASE_ID, TABLE_ID, [
      Query.limit(5),
      Query.orderDesc("count"),
    ]);

    return result.documents as unknown as TrendingMovie[];
  } catch (error) {
    console.log(error);
    return undefined;
  }
};

export const saveMovie = async (movie: MovieDetails) => {
  try {
    const currentUser = await account.get();

    if (!currentUser) {
      throw new Error("You don't have access to perform this action.");
    }

    const createdSaved = await database.createDocument(
      DATABASE_ID,
      "saved",
      ID.unique(),
      {
        movie_id: movie.id,
        title: movie.title,
        poster_url: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
        user_id: currentUser.$id,
      }
    );

    return createdSaved;
  } catch (error) {
    console.error("Error while saving movie: ", error);
    throw error;
  }
};

export const unsaveMovie = async (movieId: number) => {
  try {
    const currentUser = await account.get();

    if (!currentUser) {
      throw new Error("You don't have access to perform this action.");
    }

    const savedMovies = await database.listDocuments(DATABASE_ID, "saved", [
      Query.and([
        Query.equal("movie_id", movieId),
        Query.equal("user_id", currentUser.$id),
      ]),
    ]);

    if (savedMovies.documents.length === 0) {
      throw new Error("Movie not found in saved list.");
    }

    const result = await database.deleteDocument(
      DATABASE_ID,
      "saved",
      savedMovies.documents[0].$id
    );

    return result;
  } catch (error) {
    console.error("Error while unsaving movie: ", error);
    throw error;
  }
};

export const checkIsMovieSaved = async (movieId: string) => {
  try {
    const currentUser = await account.get();

    if (!currentUser) {
      return false;
    }

    const createdSaved = await database.listDocuments(DATABASE_ID, "saved", [
      Query.and([
        Query.equal("movie_id", Number(movieId)),
        Query.equal("user_id", currentUser.$id),
      ]),
    ]);

    if (createdSaved.total < 1) {
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error while fetching saved movie: ", error);
    throw error;
  }
};

export const getMySavedMovies = async (): Promise<SavedMovie[] | undefined> => {
  try {
    const currentUser = await account.get();

    if (!currentUser) {
      throw new Error("You don't have access to perform this action.");
    }

    const result = await database.listDocuments(DATABASE_ID, "saved", [
      Query.equal("user_id", currentUser.$id),
    ]);

    return result.documents as unknown as SavedMovie[];
  } catch (error) {
    console.error("Error while fetching saved movies: ", error);
    throw error;
  }
};
