import React from "react";
import styled from "@emotion/styled";
import { ScoreType } from "../helpers/types";

interface Props {
  currentScoreType: ScoreType;
}

export const ScoreTypeBar: React.FC<Props> = (props) => {
  return (
    <Container>
      {props.currentScoreType === ScoreType.AUDIENCE
        ? "Audience Percentage"
        : props.currentScoreType === ScoreType.MODERATOR
        ? "Moderator Points"
        : ""}
    </Container>
  );
};

const Container = styled("div")({
  position: "absolute",
  top: "-7rem",
  left: "9rem",
  padding: "1rem",
  margin: 0,
  display: "flex",
  flexDirection: "row",
  backgroundColor: "rgba(0, 0, 0, 0.5)",
  borderRadius: "1rem",
  gap: "4px",
  fontSize: "1.25rem",
  fontWeight: "bold",
  marginLeft: "-2rem",
  alignItems: "center",
  textTransform: "uppercase",
  justifyContent: "center",
});
