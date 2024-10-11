import styled from "@emotion/styled";
import { v4 as uuidv4 } from "uuid";
import React, { useEffect } from "react";
import {
  configDataRef,
  playDataRef,
  resetScores,
  scoresDataRef,
  setCurrentTopic,
  setMode,
  subPlayData,
  updateTopics,
} from "../data/dataConfig";
import { Page } from "../components/Page";
import { ConfigData, Mode, PlayData } from "../helpers/types";
import {
  collection,
  getDoc,
  getDocs,
  onSnapshot,
  updateDoc,
} from "@firebase/firestore";
import { TopicList } from "../components/TopicList";
import { col, db } from "../data/config";
import { Button } from "../components/Button";

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
          // scores: Object.keys(data.scores).map((key) => ({
          //   id: key,
          //   value: data.scores[key],
          // })),
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
    <Page>
      <div>
        Scores
        <div>
          <Button onClick={onReset}>Reset Scores</Button>
        </div>
      </div>

      <div>
        Modes
        <div>
          <Button
            onClick={() => onChangeMode(Mode.INSTRUCTION)}
            disabled={playData?.currentMode === Mode.INSTRUCTION}
          >
            Instruction
          </Button>
          <Button
            onClick={() => onChangeMode(Mode.PLAY)}
            disabled={playData?.currentMode === Mode.PLAY}
          >
            Play
          </Button>
        </div>
      </div>
      <TopicList
        topics={configData?.topics}
        currentTopicId={playData?.currentTopicId}
      />
    </Page>
  );
};
