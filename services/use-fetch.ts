import { useEffect, useState } from "react";

const useFetch = <T>(fetchFn: () => Promise<T>, autoFetch = true) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [isInitialFetching, setIsInitialFetching] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const result = await fetchFn();

      setData(result);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err : new Error("An error occured."));
      return [];
    } finally {
      setIsInitialFetching(false);
      setLoading(false);
    }
  };

  const reset = () => {
    setData(null);
    setLoading(false);
    setError(null);
  };

  useEffect(() => {
    if (autoFetch) {
      setIsInitialFetching(true);
      fetchData();
    }
  }, []);
  return { data, loading, error, refetch: fetchData, reset, isInitialFetching };
};

export default useFetch;
