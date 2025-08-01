import { useState } from "react";
import useInsights from "../../hooks/useInsights";
import { BRANDS } from "../../lib/consts.ts";
import { Button } from "../button/button.tsx";
import { Modal, type ModalProps } from "../modal/modal.tsx";
import styles from "./add-insight.module.css";

type AddInsightProps = ModalProps & {
  refetch: () => void;
};

export const AddInsight = (props: AddInsightProps) => {
  const [insight, setInsights] = useState({
    brand: BRANDS[0]?.id || "",
    text: "",
  });

  const addInsight = (event: React.FormEvent) => {
    event.preventDefault();
    console.log("Sending insight data..", insight);
    fetch("http://localhost:8080/insights/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(insight),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Response:", data);
        props.refetch();
        props.onClose();
      })
      .catch((err) => console.error("Fetch error:", err));
  };

  return (
    <Modal {...props}>
      <h1 className={styles.heading}>Add a new insight</h1>
      <form className={styles.form} onSubmit={addInsight}>
        <label className={styles.field}>
          <select
            className={styles["field-input"]}
            onChange={(e) =>
              setInsights((prev) => ({ ...prev, brand: e.target.value }))}
          >
            {BRANDS.map(({ id, name }) => (
              <option key={id} value={id}>{name}</option>
            ))}
          </select>
        </label>
        <label className={styles.field}>
          Insight
          <textarea
            className={styles["field-input"]}
            rows={5}
            placeholder="Something insightful..."
            onChange={(e) =>
              setInsights((prev) => ({ ...prev, text: e.target.value }))}
          >
          </textarea>
        </label>
        <Button className={styles.submit} type="submit" label="Add insight" />
      </form>
    </Modal>
  );
};
