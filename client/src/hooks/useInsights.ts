import { useEffect, useState } from "react";
import type { Insight } from "../schemas/insight.ts";

const useInsights = () => {
  const [insights, setInsights] = useState<Insight>([]);
  const [error, setError] = useState(null);
  const fetchInsights = () => {
    fetch(`http://localhost:8080/insights`)
      .then((res) => {
        return res.json();
      })
      .then((data) => setInsights(data))
      .catch((err) => {
        setError(err);
        console.log("Error fetching insights!!");
      });
  };

  useEffect(() => {
    fetchInsights();
  }, []);
  return { insights, refetch: fetchInsights, error };
};

export default useInsights;
