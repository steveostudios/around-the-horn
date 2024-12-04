import React from "react";
import Marks from "./../assets/marks.png";
import Corner from "./../assets/corner.png";
import styled from "@emotion/styled";

export const Footer: React.FC = () => {
  return (
    <Container>
      <img className="marks" src={Marks} alt="logo" />
      <img className="corner" src={Corner} alt="logo" />
    </Container>
  );
};

const Container = styled("div")({
  display: "flex",
  flexDirection: "row",
  gap: "1rem",
  position: "relative",
  bottom: "2rem",
  alignItems: "center",
  height: "4rem",
  justifyContent: "center",

  ".marks": {
    maxWidth: "50%",
    maxHeight: "2rem",
    position: "absolute",
    bottom: "1rem",
  },

  ".corner": {
    position: "absolute",
    right: "1rem",
    height: "4rem",
  },
});
