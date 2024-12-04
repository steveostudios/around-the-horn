import React from "react";
import Marks from "./../assets/marks.png";
import Corner from "./../assets/corner.png";
import styled from "@emotion/styled";

export const ScreenFooter: React.FC = () => {
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
  bottom: "3rem",
  alignItems: "center",
  height: "8rem",
  justifyContent: "center",

  ".marks": {
    height: "4rem",
    position: "absolute",
    bottom: "2rem",
  },

  ".corner": {
    position: "absolute",
    right: "2rem",
    height: "8rem",
  },
});
