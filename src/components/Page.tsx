import styled from "@emotion/styled/macro";
import React from "react";
import { Header } from "./Header";
import Background from "./../assets/bg.jpg";
import { Footer } from "./Footer";
import { ScreenFooter } from "./ScreenFooter";
interface Props {
  isScreen?: boolean;
  isAdmin?: boolean;
  children?: React.ReactNode;
}

export const Page: React.FC<Props> = (props) => {
  return (
    <Container isAdmin={props.isAdmin || false}>
      <Header />
      <Content>{props.children}</Content>
      {props.isScreen ? <ScreenFooter /> : <Footer />}
    </Container>
  );
};

const Container = styled("div")((props: { isAdmin: boolean }) => ({
  display: "flex",
  "flex-direction": "column",
  gap: "1rem",
  minHeight: "100svh",
  background: props.isAdmin
    ? "#1e1e1e"
    : "linear-gradient(135deg, rgba(38, 53, 91, 1) 0%, rgba(0, 212, 255, 1) 100%)",
  backgroundImage: props.isAdmin ? "none" : `url(${Background})`,
  backgroundSize: "cover",
}));

const Content = styled("div")({
  display: "flex",
  flexDirection: "column",
  gap: "1rem",
  width: "100%",
  // padding: "1rem",
  margin: "0 auto",
  maxWidth: "100%",
  position: "relative",
  zIndex: 1,
});
