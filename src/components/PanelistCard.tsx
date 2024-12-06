import React from "react";
import styled from "@emotion/styled";
import { Panelist, Score } from "../helpers/types";

interface Props {
  panelist: Panelist;
  color: { text: string; bg: string };
  score?: Score;
  percent?: string;
  scoreType: "points" | "percent";
  type: "controller" | "viewer";
  onIncrement?: (panelistId: string) => void;
  onDecrement?: (panelistId: string) => void;
  disableIncrement?: boolean;
  disableDecrement?: boolean;
  disabled?: boolean;
}

export const PanelistCard: React.FC<Props> = (props) => {
  const { panelist, score, type, disabled } = props;

  return (
    <Container key={panelist.id} disabled={disabled || false} type={type}>
      <img
        src={panelist.imgUrl || ""}
        alt={panelist.name}
        onClick={() => {
          props.onIncrement && props.onIncrement(panelist.id);
        }}
      />
      <Label {...props.color}>
        <div className="name">{panelist.name}</div>

        {type === "viewer" && props.scoreType !== "percent" && (
          <div className="score">{score?.value || 0}</div>
        )}
        {type === "viewer" && props.scoreType === "percent" && (
          <div className="score">{props.percent}%</div>
        )}
      </Label>
    </Container>
  );
};

const Container = styled("div")(
  (props: { disabled: boolean; type: "viewer" | "controller" }) => ({
    display: "flex",
    "flex-direction": "column",
    alignItems: "center",
    opacity: props.disabled ? 0.5 : 1,
    padding: "0.25rem",
    fontSize: "2rem",
    fontWeight: "bold",
    borderRadius: "1rem",
    img: {
      borderRadius: "calc(1rem - 0.25rem) calc(1rem - 0.25rem) 0 0",
      overflow: "hidden",
      width: "100%",
      height: "auto",
      aspectRatio: "1/1",
    },
  })
);

const Label = styled("div")((props: { text: string; bg: string }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  backgroundColor: props.bg,
  width: "100%",
  height: "3rem",
  borderRadius: "0 0 calc(1rem - 0.25rem) calc(1rem - 0.25rem)",
  margin: "0 0.5rem",
  overflow: "hidden",
  ".name": {
    display: "flex",
    alignItems: "center",
    height: "100%",
    padding: "0 1rem",
    color: props.text,
    fontSize: "1.5rem",
  },
  ".score": {
    display: "flex",
    alignItems: "center",
    height: "100%",
    padding: "0 1rem",
    backgroundColor: "rgba(0,0,0,0.5)",
    color: "#fff",
  },
}));
