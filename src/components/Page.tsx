import styled from "@emotion/styled/macro";
import React from "react";
import { Header } from "./Header";

interface Props {
  isAdmin?: boolean;
  children?: React.ReactNode;
}

export const Page: React.FC<Props> = (props) => {
  return (
    <Container isAdmin={props.isAdmin || false}>
      <Header />
      {props.children}
    </Container>
  );
};

const Container = styled("div")((props: { isAdmin: boolean }) => ({
  display: "flex",
  "flex-direction": "column",
  gap: "1rem",
  minHeight: "100vh",
  background: props.isAdmin
    ? "#1e1e1e"
    : "linear-gradient(135deg, rgba(38, 53, 91, 1) 0%, rgba(0, 212, 255, 1) 100%)",
}));
