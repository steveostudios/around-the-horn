import React from "react";
import styled from "@emotion/styled";
import { Panelist, Score } from "../helpers/types";
import { Button } from "./Button";
import IconAdd from "./../assets/icons/plus-solid.svg";
import IconMinus from "./../assets/icons/minus-solid.svg";

interface Props {
  panelist: Panelist;
  score?: Score;
  type: "controller" | "viewer";
  onIncrement?: (panelistId: string) => void;
  onDecrement?: (panelistId: string) => void;
}

export const PanelistCard: React.FC<Props> = (props) => {
  const { panelist, score, type } = props;

  return (
    <Container key={panelist.id}>
      <img
        src={panelist.imgUrl || ""}
        alt={panelist.name}
        onClick={() => {
          props.onIncrement && props.onIncrement(panelist.id);
        }}
      />
      <div>{panelist.name}</div>
      {type === "viewer" && <div className="score">{score?.value || 0}</div>}
      {type === "controller" && (
        <div className="controller">
          <Button
            onClick={() => props.onDecrement && props.onDecrement(panelist.id)}
          >
            <img src={IconMinus} alt="Decrement" />
          </Button>
          <span>{score?.value || 0}</span>
          <Button
            onClick={() => props.onIncrement && props.onIncrement(panelist.id)}
          >
            <img src={IconAdd} alt="Increment" />
          </Button>
        </div>
      )}
    </Container>
  );
};

const Container = styled("div")({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "0.5rem",
  padding: "0.25rem",
  fontSize: "1.25rem",
  backgroundColor: "var(--black)",
  border: "0.25rem solid var(--black) inset",
  borderRadius: "1rem",
  img: {
    borderRadius: "calc(1rem - 0.25rem) calc(1rem - 0.25rem) 0 0",
    overflow: "hidden",
    width: "100%",
    height: "auto",
    aspectRatio: "1/1",
  },
  ".controller": {
    gap: "0.5rem",
    display: "flex",
    flex: 1,
    alignItems: "center",
    justifyContent: "space-between",
    fontWeight: "bold",
    width: "calc(100% - 1rem)",
    padding: "0.5rem",
    backgroundColor: "#B80A43",
    borderRadius: "0 0 calc(1rem - 0.25rem) calc(1rem - 0.25rem)",
    // button: {
    //   width: "2rem",
    //   height: "2rem",
    //   fontSize: "1.5rem",
    //   backgroundColor: "var(--white)",
    //   borderRadius: "0.5rem",
    //   border: "none",
    //   cursor: "pointer",
    //   display: "flex",
    //   alignItems: "center",
    //   justifyContent: "center",
    // },
  },
  ".score": {
    gap: "0.5rem",
    display: "flex",
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "bold",
    width: "calc(100% - 1rem)",
    padding: "0.5rem",
    backgroundColor: "#B80A43",
    borderRadius: "0 0 calc(1rem - 0.25rem) calc(1rem - 0.25rem)",
  },
});