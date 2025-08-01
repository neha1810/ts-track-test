import { useEffect, useState } from "react";
import { Header } from "../components/header/header.tsx";
import { Insights } from "../components/insights/insights.tsx";
import styles from "./app.module.css";
import type { Insight } from "../schemas/insight.ts";
import useInsights from "../hooks/useInsights";

export const App = () => {
  const { insights, refetch, error } = useInsights();

  useEffect(() => {
    refetch();
  }, []);

  return (
    <main className={styles.main}>
      <Header refetch={refetch} />
      <Insights insights={insights} refetch={refetch} />
    </main>
  );
};
