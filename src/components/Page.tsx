import styled from "@emotion/styled/macro";
import React from "react";

interface Props {
  children?: React.ReactNode;
}

export const Page: React.FC<Props> = (props) => {
  return <Container>{props.children}</Container>;
};

const Container = styled("div")({
  display: "flex",
  flexDirection: "column",
  gap: "1rem",
  minHeight: "100vh",
});
