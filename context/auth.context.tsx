import { account } from "@/services/appwrite";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an Auth Provider");
  }

  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    checkUserStatus();
  }, []);

  const checkUserStatus = async () => {
    try {
      const userData: User = await account.get();
      setUser(userData);
    } catch (error) {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (payload: {
    email: string;
    password: string;
    name: string;
  }) => {
    try {
      const { email, name, password } = payload;

      const response = await account.create("unique()", email, password, name);

      await login({ email, password });
      return { success: true, data: response };
    } catch (error) {
      console.error("Error while registering: ", error);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "An unkown error ocured",
      };
    }
  };

  const login = async (payload: { email: string; password: string }) => {
    try {
      const { email, password } = payload;
      const response = await account.createEmailPasswordSession(
        email,
        password
      );

      const userData: User = await account.get();

      setUser(userData);

      return { success: true, data: response };
    } catch (error) {
      console.error("Error while signing in: ", error);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "An unkown error ocured",
      };
    }
  };

  const logout = async (): Promise<AuthResponse> => {
    try {
      await account.deleteSession("current");
      setUser(null);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "An unknown error occurred",
      };
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    register,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
