import React from "react";
import styled from "@emotion/styled";
import { Mode, Topic } from "../helpers/types";
import IconMoveUp from "./../assets/icons/up-solid-primary.svg";
import IconSave from "./../assets/icons/floppy-disk-solid-primary.svg";
import IconCancel from "./../assets/icons/xmark-solid-primary.svg";
import IconAdd from "./../assets/icons/plus-solid-primary.svg";
import IconDelete from "./../assets/icons/trash-solid-primary.svg";
import IconMoveDown from "./../assets/icons/down-solid-primary.svg";
import IconEdit from "./../assets/icons/pen-to-square-solid-primary.svg";
import IconEye from "./../assets/icons/eye-solid-primary.svg";
import IconEyeSlash from "./../assets/icons/eye-slash-solid-primary.svg";
import { configDataRef, playDataRef } from "../data/dataConfig";
import { v4 as uuidv4 } from "uuid";
import { Text } from "./Text";
import { Button } from "./Button";
import { updateDoc } from "@firebase/firestore";

interface Props {
  topics?: Topic[];
  currentTopicId?: string;
  currentMode?: Mode;
  currentTopics: string[];
}

export const TopicList: React.FC<Props> = (props) => {
  const { topics, currentTopicId } = props;
  const [isEdit, setIsEdit] = React.useState(false);

  const [editedTopics, setEditedTopics] = React.useState(topics);

  // set current topic
  const onSetCurrentTopic = (id: string | null) => {
    if (props.currentMode === Mode.INSTRUCTION) return;
    if (id !== null && !props.currentTopics.includes(id)) return;
    updateDoc(playDataRef, {
      currentTopicId: id,
    });
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
    updateDoc(configDataRef, {
      topics: editedTopics || [],
    });
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

  const onToggleTopicVisibility = (panelistId: string) => {
    const newCurrentTopics = props.currentTopics.includes(panelistId)
      ? props.currentTopics.filter((id) => id !== panelistId)
      : [...props.currentTopics, panelistId];
    updateDoc(playDataRef, {
      currentTopics: newCurrentTopics,
    });
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
            <Button name="edit" onClick={onEditTopics}>
              <img src={IconEdit} alt="Edit" />
            </Button>
          </div>
        </Controls>
      )}
      {isEdit && (
        <Controls>
          <div>
            <Button name="add" onClick={onAddTopic}>
              <img src={IconAdd} alt="Add Topic" />
            </Button>
          </div>
          <div>
            <Button name="save" onClick={onSaveEditTopics}>
              <img src={IconSave} alt="Save" />
            </Button>
            <Button name="cancel" onClick={onCancelEditTopics}>
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
                <Button
                  name="increment"
                  fitWidth
                  onClick={() => {
                    onToggleTopicVisibility(topic.id);
                  }}
                >
                  {props.currentTopics.includes(topic.id) ? (
                    <img src={IconEye} alt="visible" />
                  ) : (
                    <img src={IconEyeSlash} alt="hidden" />
                  )}
                </Button>
                <div
                  style={{
                    opacity: props.currentTopics.includes(topic.id) ? 1 : 0.25,
                    fontStyle: "italic",
                  }}
                >
                  {topic.slug}
                </div>
                <div
                  style={{
                    opacity: props.currentTopics.includes(topic.id) ? 1 : 0.25,
                  }}
                >
                  {topic.content}
                </div>
              </Row>
            ))}
        {isEdit &&
          editedTopics
            ?.sort((a, b) => a.order - b.order)
            .map((topic) => (
              <Row key={topic.id}>
                {topic.order}
                <Button
                  name="up"
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
                  name="down"
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
                <div className="main">
                  <Text
                    id={topic.id}
                    label="Slug"
                    value={topic.slug}
                    onChange={(value) => onEditSlug(topic.id, value)}
                  />
                  <Text
                    id={topic.id}
                    label="Content"
                    value={topic.content}
                    onChange={(value) => onEditContent(topic.id, value)}
                  />
                </div>
                <Button name="delete" onClick={() => onDeleteTopic(topic.id)}>
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
  gap: "1rem",
  width: "100%",
});

const List = styled("div")({
  display: "flex",
  flexDirection: "column",
  button: {
    padding: "0.5rem",
  },
  backgroundColor: "var(--color-controlpanel-bgo)",
  color: "var(--white)",
  borderRadius: "0.25rem",
  overflow: "hidden",
});

const Row = styled("div")({
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  padding: "1rem",
  gap: "0.5rem",
  borderLeft: "4px solid transparent",
  ".main": {
    flex: 1,
    display: "flex",
    flexDirection: "row",
    gap: "0.25rem",
  },
  "&:nth-child(even)": {
    backgroundColor: "var(--color-controlpanel-bgo)",
  },
  "&.selected": {
    borderLeft: "4px solid var(--color-primary)",
    backgroundColor: "var(--color-secondary)",
  },
  button: {
    width: "3rem",
    padding: "0.5rem",
  },
  input: {
    flex: 1,
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
