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
  padding: 0,
  margin: 0,
  display: "flex",
  flexDirection: "row",
  backgroundColor: "rgba(0, 0, 0, 0.5)",
  height: "60px",
  gap: "4px",
  fontSize: "1.75rem",
  fontWeight: "bold",
  marginLeft: "-2rem",
  alignItems: "center",
  textTransform: "uppercase",
  justifyContent: "center",
});
