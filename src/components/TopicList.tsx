import React from "react";
import styled from "@emotion/styled";
import { Topic } from "../helpers/types";
import IconMoveUp from "./../assets/icons/up-solid.svg";
import IconSave from "./../assets/icons/floppy-disk-solid.svg";
import IconCancel from "./../assets/icons/xmark-solid.svg";
import IconAdd from "./../assets/icons/plus-solid.svg";
import IconDelete from "./../assets/icons/trash-solid.svg";
import IconMoveDown from "./../assets/icons/down-solid.svg";
import IconEdit from "./../assets/icons/pen-to-square-solid.svg";
import { setCurrentTopic, updateTopics } from "../data/dataConfig";
import { v4 as uuidv4 } from "uuid";

interface Props {
  topics?: Topic[];
  currentTopicId?: string;
}

export const TopicList: React.FC<Props> = (props) => {
  const { topics, currentTopicId } = props;
  const [isEdit, setIsEdit] = React.useState(false);

  const [editedTopics, setEditedTopics] = React.useState(topics);

  // set current topic
  const onSetCurrentTopic = (id: string | null) => {
    console.log("Set current topic", id);
    setCurrentTopic(id);
  };

  // click edit topics
  const onEditTopics = () => {
    setIsEdit(true);
    setEditedTopics(topics);
  };

  // click cancel edit topics
  const onCancelEditTopics = () => {
    setIsEdit(false);
    setEditedTopics(topics);
  };

  // click save edit topics
  const onSaveEditTopics = () => {
    setIsEdit(false);
    updateTopics(editedTopics || []);
  };

  const onEditSlug = (id: string, value: string) => {
    setEditedTopics(
      editedTopics?.map((topic) => {
        if (topic.id === id) {
          return { ...topic, slug: value };
        }
        return topic;
      })
    );
  };

  const onEditContent = (id: string, value: string) => {
    setEditedTopics(
      editedTopics?.map((topic) => {
        if (topic.id === id) {
          return { ...topic, content: value };
        }
        return topic;
      })
    );
  };

  const onMoveTopic = (id: string, direction: "up" | "down") => {
    if (!editedTopics) {
      return;
    }
    console.log(id, direction);
    const currentIndex = editedTopics.findIndex((topic) => topic.id === id);
    if (currentIndex === -1) {
      return;
    }
    const newTopics = [...editedTopics];
    const currentTopic = newTopics[currentIndex];
    newTopics.splice(currentIndex, 1);
    newTopics.splice(
      direction === "up" ? currentIndex - 1 : currentIndex + 1,
      0,
      currentTopic
    );
    newTopics.forEach((topic, index) => {
      topic.order = index + 1;
    });

    setEditedTopics(newTopics);
  };

  const onAddTopic = () => {
    setEditedTopics([
      ...(editedTopics || []),
      {
        order: (editedTopics || []).length + 1,
        id: uuidv4(),
        slug: "",
        content: "",
      },
    ]);
  };

  const onDeleteTopic = (id: string) => {
    setEditedTopics(editedTopics?.filter((topic) => topic.id !== id));
  };

  if (!topics) {
    return null;
  }
  return (
    <Container>
      {!isEdit && (
        <Controls>
          <div></div>
          <div>
            <Button onClick={onEditTopics}>
              <img src={IconEdit} alt="Edit" />
            </Button>
          </div>
        </Controls>
      )}
      {isEdit && (
        <Controls>
          <div>
            <Button onClick={onAddTopic}>
              <img src={IconAdd} alt="Add Topic" />
            </Button>
          </div>
          <div>
            <Button onClick={onSaveEditTopics}>
              <img src={IconSave} alt="Save" />
            </Button>
            <Button onClick={onCancelEditTopics}>
              <img src={IconCancel} alt="Cancel" />
            </Button>
          </div>
        </Controls>
      )}

      <List>
        {!isEdit && (
          <Row
            className={!currentTopicId ? "selected" : ""}
            onClick={() => onSetCurrentTopic(null)}
          >
            No Question
          </Row>
        )}
        {!isEdit &&
          topics
            .sort((a, b) => a.order - b.order)
            .map((topic) => (
              <Row
                key={topic.id}
                className={topic.id === currentTopicId ? "selected" : ""}
                onClick={() => onSetCurrentTopic(topic.id)}
              >
                <div>{topic.slug}</div>
                <div>{topic.content}</div>
              </Row>
            ))}
        {isEdit &&
          editedTopics
            ?.sort((a, b) => a.order - b.order)
            .map((topic) => (
              <Row key={topic.id}>
                <Button
                  disabled={
                    editedTopics
                      .sort((a, b) => a.order - b.order)
                      .findIndex((t) => t.id === topic.id) === 0
                  }
                  onClick={() => onMoveTopic(topic.id, "up")}
                >
                  <img src={IconMoveUp} alt="Move up" />
                </Button>
                <Button
                  disabled={
                    editedTopics
                      .sort((a, b) => a.order - b.order)
                      .findIndex((t) => t.id === topic.id) ===
                    editedTopics.length - 1
                  }
                  onClick={() => onMoveTopic(topic.id, "down")}
                >
                  <img src={IconMoveDown} alt="Move down" />
                </Button>
                {topic.order}
                <div className="main">
                  <input
                    value={topic.slug}
                    onChange={(e) =>
                      onEditSlug(topic.id, e.currentTarget.value)
                    }
                  />
                  <input
                    value={topic.content}
                    onChange={(e) =>
                      onEditContent(topic.id, e.currentTarget.value)
                    }
                  />
                </div>
                <Button onClick={() => onDeleteTopic(topic.id)}>
                  <img src={IconDelete} alt="Delete" />
                </Button>
              </Row>
            ))}
      </List>
    </Container>
  );
};

const Container = styled("div")({
  display: "flex",
  flexDirection: "column",
  padding: "1rem",
  gap: "1rem",
});

const List = styled("div")({
  display: "flex",
  flexDirection: "column",
  button: {
    padding: "0.5rem",
  },
  backgroundColor: "var(--white)",
  color: "var(--black)",
  borderRadius: "0.25rem",
  overflow: "hidden",
});

const Row = styled("div")({
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  padding: "1rem",
  gap: "0.25rem",
  ".main": {
    flex: 1,
    display: "flex",
    flexDirection: "row",
    gap: "0.25rem",
  },
  "&:nth-child(even)": {
    backgroundColor: "#f0f0f0",
  },
  "&.selected": {
    backgroundColor: "var(--black)",
    color: "var(--white)",
  },
  input: {
    padding: "0.5rem",
    border: "1px solid var(--black)",
    borderRadius: "0.25rem",
    flex: 1,
    height: "1rem",
  },
  button: {
    padding: "0.5rem",
  },
});

const Controls = styled("div")({
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "1rem",
  "> div": {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: "0.5rem",
  },
});

const Button = styled("button")({
  border: "none",
  borderRadius: "0.25rem",
  padding: "0.5rem",
  cursor: "pointer",
  backgroundColor: "var(--white)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  img: {
    width: "1rem",
    height: "1rem",
  },
  "&:disabled": {
    opacity: 0.15,
    cursor: "not-allowed",
  },
});
