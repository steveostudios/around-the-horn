import React, { useEffect } from "react";
import styled from "@emotion/styled";

import { ConfigData, Mode, PlayData, Score } from "../helpers/types";
import {
  getConfigData,
  moderatorScoresDataRef,
  playDataRef,
  scoresDataRef,
} from "../data/dataConfig";
import { Page } from "../components/Page";
import { PanelistCard } from "../components/PanelistCard";
import { onSnapshot } from "@firebase/firestore";
import { CurrentTopicBar } from "../components/CurrentTopicBar";
import { TopicsBar } from "../components/TopicsBar";
import QRCode from "qrcode";
import { HOST, POINTS } from "../helpers/env";

export const PageScreen: React.FC = () => {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  const [configData, setConfigData] = React.useState<ConfigData>();
  const [playData, setPlayData] = React.useState<PlayData>();
  const [scores, setScores] = React.useState<Score[]>([]);
  const [moderatorScores, setModeratorScores] = React.useState<Score[]>([]);

  // fetch config data
  useEffect(() => {
    (async () => {
      const configData = await getConfigData();
      setConfigData({
        panelists: configData.panelists,
        topics: configData.topics,
      });
    })();
  }, []);

  // stream play data
  useEffect(() => {
    const unsubscribe = onSnapshot(playDataRef, (snap) => {
      if (snap.exists()) {
        const data = snap.data();
        setPlayData({
          currentTopicId: data.currentTopicId,
          currentMode: data.currentMode,
          currentScoreType: data.currentScoreType,
        });
      }
    });

    return () => unsubscribe();
  }, []);

  // stream scores data
  useEffect(() => {
    const unsubscribe = onSnapshot(scoresDataRef, (snap) => {
      if (snap.exists()) {
        const data = snap.data();
        const list = Object.keys(data).map((key) => ({
          id: key,
          value: data[key],
        }));

        setScores(list);
      }
    });

    return () => unsubscribe();
  }, []);

  // stream moderator scores data
  useEffect(() => {
    const unsubscribe = onSnapshot(moderatorScoresDataRef, (snap) => {
      if (snap.exists()) {
        const data = snap.data();
        const list = Object.keys(data).map((key) => ({
          id: key,
          value: data[key],
        }));

        setModeratorScores(list);
      }
    });

    return () => unsubscribe();
  }, []);

  // generate QR code
  useEffect(() => {
    if (!canvasRef.current) {
      return;
    }

    QRCode.toCanvas(canvasRef.current, HOST, {
      width: 200,
    });
  }, [playData]);

  if (!configData || !playData) {
    return <Page>Loading...</Page>;
  }

  if (playData.currentMode === Mode.INSTRUCTION) {
    return (
      <Page>
        <Instructions>
          <p>Scan this code to play.</p>
        </Instructions>
        <QRCodeCanvas ref={canvasRef} />
        <Instructions>
          <p>
            For each topic you will be given {POINTS} points to give out or take
            away. If a particular panelist deserves points, dish them out. If
            not, retract them. You will be given a new set of {POINTS} points
            each topic. Your points to give out do not roll over.
          </p>
        </Instructions>
      </Page>
    );
  }

  return (
    <Page>
      <div>{playData.currentScoreType} Score</div>
      <PanelistGrid>
        {configData.panelists.map((panelist) => (
          <PanelistCard
            key={panelist.id}
            panelist={panelist}
            score={
              playData.currentScoreType === "moderator"
                ? moderatorScores.find((score) => score.id === panelist.id)
                : scores.find((score) => score.id === panelist.id) || {
                    id: panelist.id,
                    value: 0,
                  }
            }
            type="viewer"
          />
        ))}
      </PanelistGrid>

      <CurrentTopicBar
        topic={configData.topics.find(
          (topic) => topic.id === playData.currentTopicId
        )}
      />

      <TopicsBar
        topics={configData.topics}
        currentTopicId={playData.currentTopicId}
      />
    </Page>
  );
};

const PanelistGrid = styled("div")({
  display: "flex",
  flexFlow: "row wrap",
  alignItems: "center",
  justifyContent: "center",
  alignSelf: "center",
  gap: "1rem",
  maxWidth: "100%",
  "> div": {
    flex: "1 1 256px",
  },
});

const Instructions = styled("div")({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "1rem",
  padding: "1rem",
  justifyContent: "center",
  fontSize: "1.5rem",
  fontWeight: "bold",
});

const QRCodeCanvas = styled("canvas")({
  margin: "0 auto",
  width: "200px",
  height: "200px",
});
