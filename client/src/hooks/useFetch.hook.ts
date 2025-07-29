/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";

export const useFetch = <T = any>(endpoint: string) => {
  const [response, setResponse] = useState<T>();
  const [error, setError] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async (endpoint: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/${endpoint}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setResponse(data);
    } catch (err) {
      console.error("Fetch error:", err);
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData(endpoint);
  }, []);

  return {
    response,
    error,
    isLoading,
  };
};
