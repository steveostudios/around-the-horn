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
