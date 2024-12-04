import React from "react";
import styled from "@emotion/styled";
import { Topic } from "../helpers/types";

interface Props {
  topic?: Topic;
}

export const CurrentTopicBar: React.FC<Props> = (props) => {
  const { topic } = props;

  return (
    <Container>
      <Header>Play-Ins</Header>
      <Content>{topic?.content || "No topic selected"}</Content>
    </Container>
  );
};

const Container = styled("div")({
  position: "relative",
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  gap: "1rem",

  color: "#ffffff",
  backgroundColor: "#0F1835",
  height: "60px",
  fontSize: "2rem",
});

const Header = styled("div")({
  height: "100%",
  position: "relative",
  zIndex: 1,
  padding: "0 3rem",
  margin: 0,
  marginLeft: "-2rem",
  marginRight: "-2rem",
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  clipPath: `polygon(2rem 0, 100% 0%, calc(100% - 2rem) 100%, 0% 100%)`,

  // clipPath: `polygon(0 0, 0 100%, calc(100% - 1rem) 100%, 100% 50%, calc(100% - 1rem) 0)`,
  color: "var(--white)",
  listStyleType: "none",
  textTransform: "uppercase",
  fontSize: "2rem",
  letterSpacing: "-0.1rem",
  fontWeight: "900",
  backgroundColor: "#C5203F",
  whiteSpace: "nowrap",
  // ":after": {
  //   content: "''",
  //   position: "absolute",
  //   right: "1rem",
  //   top: 0,
  //   width: "2rem",
  //   height: "100%",
  //   backgroundColor: "#ffffff",
  //   clipPath: `polygon(0 0, calc(100% - 1rem) 0, 100% 50%, calc(100% - 1rem) 100%, 0 100%, 1rem 50%)`,
  // },
});

const Content = styled("div")({
  padding: "0 1rem",
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "center",
  textAlign: "center",
  flex: 1,
  gap: "1rem",
});
