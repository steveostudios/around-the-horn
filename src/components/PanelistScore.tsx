import React from "react";
import styled from "@emotion/styled";
import { Panelist, Score } from "../helpers/types";
import IconAdd from "./../assets/icons/plus-solid.svg";
// import IconMinus from "./../assets/icons/minus-solid.svg";
import { ButtonClient } from "./ButtonClient";

interface Props {
  panelist: Panelist;
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

export const PanelistScore: React.FC<Props> = (props) => {
  const { panelist, score, disabled } = props;
  return (
    <Container key={panelist.id} disabled={disabled || false}>
      <img
        src={panelist.imgUrl || ""}
        alt={panelist.name}
        onClick={() => {
          props.onIncrement && props.onIncrement(panelist.id);
        }}
      />
      <Label>
        <div className="name">{panelist.name}</div>
        <div className="controller">
          <div></div>
          {/* <ButtonClient
            name="decrement"
            onClick={() => props.onDecrement && props.onDecrement(panelist.id)}
            disabled={props.disableDecrement}
          >
            <img src={IconMinus} alt="Decrement" />
          </ButtonClient> */}
          <div className="score">{score?.value || 0}</div>
          <ButtonClient
            name="increment"
            onClick={() => props.onIncrement && props.onIncrement(panelist.id)}
            disabled={props.disableIncrement}
          >
            <img src={IconAdd} alt="Increment" />
          </ButtonClient>
        </div>
      </Label>
    </Container>
  );
};

const Container = styled("div")((props: { disabled: boolean }) => ({
  display: "flex",
  "flex-direction": "column",
  alignItems: "center",
  // gap: "0.5rem",
  opacity: props.disabled ? 0.5 : 1,
  // padding: "0.25rem",
  fontSize: "1.25rem",
  backgroundColor: "var(--black)",
  borderRadius: "1rem",
  img: {
    maxHeight: "10rem",
    borderRadius: "calc(1rem - 0.25rem) calc(1rem - 0.25rem) 0 0",
    overflow: "hidden",
    // width: "100%",
    // height: "auto",

    // aspectRatio: "1/1",
  },
}));

const Label = styled("div")({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "space-between",
  // backgroundColor: props.bg,
  width: "100%",
  borderRadius: "0 0 calc(1rem - 0.25rem) calc(1rem - 0.25rem)",
  overflow: "hidden",
  fontWeight: 700,
  ".name": {
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "0.5rem 0",
  },
  ".controller": {
    width: "inherit",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0.5rem 0",
    backgroundColor: "#A92545",
    paddingRight: "1rem",
  },
});
