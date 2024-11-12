import React, { useEffect } from "react";
import styled from "@emotion/styled";
import { Topic } from "../helpers/types";

interface Props {
  topics?: Topic[];
  currentTopicId?: string;
  currentTopics: string[];
}

export const TopicsBar: React.FC<Props> = (props) => {
  const headerRef = React.useRef<HTMLDivElement>(null);
  const topicsRef = React.useRef<HTMLUListElement>(null);
  const currentTopicRef = React.useRef<HTMLLIElement>(null);
  const [scrollListOffset, setScrollListOffset] = React.useState<number>(999);

  const { topics, currentTopicId } = props;

  const headerWidth = headerRef.current?.offsetWidth || 0;

  useEffect(() => {
    if (!currentTopicRef.current) {
      setScrollListOffset(-32);
      return;
    }
    setScrollListOffset(currentTopicRef.current.offsetLeft);
  }, [currentTopicId, headerWidth, topics, setScrollListOffset]);

  if (!topics) {
    return null;
  }

  return (
    <Container>
      <Header ref={headerRef}>On Deck</Header>
      <ScrollList
        ref={topicsRef}
        style={{
          left: headerWidth - 60 - scrollListOffset,
        }}
      >
        {topics
          .filter((topic) => props.currentTopics.includes(topic.id))
          .map((topic) => (
            <li
              key={topic.id}
              ref={topic.id === currentTopicId ? currentTopicRef : null}
              className={topic.id === currentTopicId ? "current" : ""}
            >
              {topic.slug}
            </li>
          ))}
        <li></li>
      </ScrollList>
    </Container>
  );
};

const Container = styled("div")({
  padding: 0,
  margin: 0,
  display: "flex",
  flexDirection: "row",
  backgroundColor: "var(--white)",
  height: "60px",
  gap: "4px",
  position: "relative",
  overflow: "hidden",
});

const ScrollList = styled("ul")({
  position: "absolute",
  display: "flex",
  flexDirection: "row",
  gap: "4px",
  padding: 0,
  margin: 0,
  listStyleType: "none",
  overflowX: "auto",
  overflow: "visible",
  backgroundColor: "var(--white)",
  height: "100%",
  transition: "left 0.5s",
  li: {
    padding: "1rem 3rem",
    margin: 0,
    marginLeft: "-2rem",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    whiteSpace: "nowrap",
    // -webkit-clip-path: `polygon(0 0, 100% 0%, 80% 100%, 0% 100%)`,
    clipPath: `polygon(2rem 0, 100% 0%, calc(100% - 2rem) 100%, 0% 100%)`,

    listStyleType: "none",
    fontSize: "2rem",
    backgroundColor: "var(--black)",

    "&.current": {
      backgroundColor: "var(--color-red)",
      fontWeight: "bold",
    },
    "&:last-of-type": {
      width: "9999px",
    },
    transition: "background-color 0.5s",
  },
});

const Header = styled("div")({
  height: "100%",
  position: "absolute",
  zIndex: 1,
  padding: "0 3rem",
  margin: 0,
  marginLeft: "-2rem",
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  clipPath: `polygon(2rem 0, 100% 0%, calc(100% - 2rem) 100%, 0% 100%)`,

  listStyleType: "none",
  textTransform: "uppercase",
  fontSize: "2rem",
  fontWeight: "bold",
  backgroundColor: "var(--black)",
});
