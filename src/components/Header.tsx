import React from "react";
import Logo from "./../assets/logo.png";
import styled from "@emotion/styled";

export const Header: React.FC = () => {
  return (
    <Container>
      <BarPink />
      <BarBlue />
      <img src={Logo} alt="logo" />
    </Container>
  );
};

const Container = styled("div")({
  display: "flex",
  flexDirection: "column",
  gap: "1rem",
  position: "relative",
  zIndex: 0,
  height: "8rem",
  img: {
    position: "relative",
    // top: 0,
    // left: "50%",
    padding: "1rem",
    margin: "0 auto",
    maxWidth: "80%",
    maxHeight: "6rem",
  },
});

const BarPink = styled("div")({
  position: "absolute",
  top: "0.5rem",
  // zIndex: 1,
  height: "6rem",
  width: "100%",
  backgroundColor: "#C5203F",
  transform: "skewY(18deg)",
});

const BarBlue = styled("div")({
  position: "absolute",
  top: "0.5rem",
  // zIndex: 1,
  height: "6rem",
  width: "100%",
  backgroundColor: "#0064A8",
  transform: "skewY(-18deg)",
});
