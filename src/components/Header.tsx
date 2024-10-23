import React from "react";
import HeaderImg from "./../assets/header.png";
import styled from "@emotion/styled";

export const Header: React.FC = () => {
  return (
    <Container>
      <img src={HeaderImg} alt="logo" />
    </Container>
  );
};

const Container = styled("div")({
  display: "flex",
  flexDirection: "column",
  gap: "1rem",
  img: {
    padding: "1rem",
    margin: "0 auto",
    maxWidth: "80%",
    maxHeight: "6rem",
  },
});
