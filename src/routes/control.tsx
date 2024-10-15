import React, { useEffect } from "react";
import {
  configDataRef,
  playDataRef,
  scoresDataRef,
  setMode,
} from "../data/dataConfig";
import { Page } from "../components/Page";
import { ConfigData, Mode, PlayData } from "../helpers/types";
import { getDoc, onSnapshot, updateDoc } from "@firebase/firestore";
import { TopicList } from "../components/TopicList";
import { Button } from "../components/Button";
import { Column, Header, Row } from "../layout";
import styled from "@emotion/styled";

interface Props {
  children?: React.ReactNode;
}

export const PageControl: React.FC<Props> = (props) => {
  const [configData, setConfigData] = React.useState<ConfigData>();
  const [playData, setPlayData] = React.useState<PlayData>();

  useEffect(() => {
    const unsubscribe = onSnapshot(playDataRef, (snap) => {
      if (snap.exists()) {
        console.log("Data changed", snap.data());
        const data = snap.data();
        setPlayData({
          currentTopicId: data.currentTopicId,
          currentMode: data.currentMode,
          scores: [],
        });
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const unsubscribe = onSnapshot(configDataRef, (snap) => {
      if (snap.exists()) {
        console.log("Data changed", snap.data());
        const data = snap.data();
        setConfigData({
          panelists: data.panelists,
          topics: data.topics,
        });
      }
    });

    return () => unsubscribe();
  }, []);

  const onReset = async () => {
    const scoresSnapshot = await getDoc(scoresDataRef);
    if (scoresSnapshot.exists()) {
      const data = scoresSnapshot.data();
      Object.keys(data).map((key) =>
        updateDoc(scoresDataRef, {
          [key]: 0,
        })
      );
    }
  };

  const onChangeMode = async (mode: string) => {
    await setMode(mode);
    console.log("Change mode");
  };

  return (
    <Page isAdmin>
      <ControlPanel>
        <Column>
          <Header label="Scores" />
          <Row>
            <Button name="reset" onClick={onReset}>
              Reset Scores
            </Button>
          </Row>
        </Column>
        <Column>
          <Header label="Modes" />
          <Row>
            <Button
              name="instruction_mode"
              onClick={() => onChangeMode(Mode.INSTRUCTION)}
              selected={playData?.currentMode === Mode.INSTRUCTION}
            >
              Instruction
            </Button>
            <Button
              name="play_mode"
              onClick={() => onChangeMode(Mode.PLAY)}
              selected={playData?.currentMode === Mode.PLAY}
            >
              Play
            </Button>
          </Row>
        </Column>
      </ControlPanel>

      <ControlPanel>
        <Column>
          <Header label="Topics" />
          <TopicList
            topics={configData?.topics}
            currentTopicId={playData?.currentTopicId}
          />
        </Column>
      </ControlPanel>
    </Page>
  );
};

const ControlPanel = styled("div")({
  // position: "absolute",
  // top: "0",
  width: "calc(100% - 4rem)",
  gap: "2rem",
  display: "flex",
  flexDirection: "row",
  padding: "1rem",
  backgroundColor: "var(--color-controlpanel-bgo)",
  borderRadius: "1rem",
  margin: "1rem",
});
