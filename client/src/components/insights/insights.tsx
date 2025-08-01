import { Trash2Icon } from "lucide-react";
import { cx } from "../../lib/cx.ts";
import styles from "./insights.module.css";
import type { Insight } from "../../schemas/insight.ts";
import useInsights from "../../hooks/useInsights";

type InsightsProps = {
  insights: Insight[];
  refetch: () => void;
  className?: string;
};

export const Insights = ({ insights, refetch, className }: InsightsProps) => {
  //  const { insights, refetch, error } = useInsights()

  const deleteInsight = (id) => {
    fetch("http://localhost:8080/insights/delete/" + id, {
      method: "DELETE",
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Successully deleted", data);
        refetch();
      })
      .catch((err) => console.log("Error in deleting", err));
  };

  return (
    <div className={cx(className)}>
      <h1 className={styles.heading}>Insights</h1>
      <div className={styles.list}>
        {insights?.length
          ? (
            insights.map(({ id, text, createdAt, brand }) => (
              <div className={styles.insight} key={id}>
                <div className={styles["insight-meta"]}>
                  <span>{brand}</span>
                  <div className={styles["insight-meta-details"]}>
                    <span>{createdAt.toString()}</span>
                    <Trash2Icon
                      className={styles["insight-delete"]}
                      onClick={(e) =>
                        deleteInsight(id)}
                    />
                  </div>
                </div>
                <p className={styles["insight-content"]}>{text}</p>
              </div>
            ))
          )
          : <p>We have no insight!</p>}
      </div>
    </div>
  );
};
