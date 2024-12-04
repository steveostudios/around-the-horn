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
import { ScoreTypeBar } from "../components/ScoreTypeBar";

export const PageScreen: React.FC = () => {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  const [configData, setConfigData] = React.useState<ConfigData>();
  const [playData, setPlayData] = React.useState<PlayData>();
  const [scores, setScores] = React.useState<Score[]>([]);
  const [moderatorScores, setModeratorScores] = React.useState<Score[]>([]);

  const colors = [
    { text: "#000000", bg: "#509DDD" },
    { text: "#ffffff", bg: "#C5203F" },
    { text: "ffffff", bg: "#0064A8" },
    { text: "#000000", bg: "#8DC1C5" },
  ];

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
          currentPanelists: data.currentPanelists,
          currentTopics: data.currentTopics,
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
      width: playData?.currentMode === Mode.INSTRUCTION ? 400 : 130,
    });
  }, [playData]);

  if (!configData || !playData) {
    return <Page>Loading...</Page>;
  }

  if (playData.currentMode === Mode.INSTRUCTION) {
    return (
      <Page>
        <QRCodeCanvas ref={canvasRef} />
        <Instructions>
          <p>Scan to play.</p>
          <p>
            For each topic you will be given {POINTS} points to give to
            panelists.
            <br />
            Your points to give out do not roll over.
          </p>
        </Instructions>
      </Page>
    );
  }

  return (
    <Page isScreen>
      <ScoreTypeBar currentScoreType={playData.currentScoreType} />
      <SmallQRCode>
        <QRCodeCanvas ref={canvasRef} />
      </SmallQRCode>

      <PanelistGrid>
        {configData.panelists
          .filter((panelist) => playData.currentPanelists.includes(panelist.id))
          .map((panelist, i) => {
            const score =
              playData.currentScoreType === "moderator"
                ? moderatorScores.find((score) => score.id === panelist.id)
                : scores.find((score) => score.id === panelist.id) || {
                    id: panelist.id,
                    value: 0,
                  };

            const total = scores.reduce((acc, score) => acc + score.value, 0);
            const percent =
              total > 0
                ? (((score?.value || 0) / total) * 100).toFixed(2)
                : "0.00";
            return (
              <PanelistCard
                color={colors[i]}
                key={panelist.id}
                panelist={panelist}
                score={score}
                scoreType={
                  playData.currentScoreType === "moderator"
                    ? "points"
                    : "percent"
                }
                percent={percent}
                type="viewer"
              />
            );
          })}
      </PanelistGrid>
      <Bars>
        <CurrentTopicBar
          topic={configData.topics.find(
            (topic) => topic.id === playData.currentTopicId
          )}
        />
        <TopicsBar
          topics={configData.topics}
          currentTopicId={playData.currentTopicId}
          currentTopics={playData.currentTopics}
        />
      </Bars>
      <Spacer />
    </Page>
  );
};

const SmallQRCode = styled("div")({
  position: "absolute",
  top: "-9rem",
  right: "0rem",
});

const PanelistGrid = styled("div")({
  display: "flex",
  flexFlow: "row wrap",
  alignItems: "center",
  justifyContent: "center",
  alignSelf: "center",
  gap: "1rem",
  paddingTop: "2rem",
  paddingBottom: "2rem",
  flex: 1,
  maxWidth: "100%",
  width: "100%",
  "> div": {
    width: "360px",
    // flex: "1 1 260px",
  },
});

const Instructions = styled("div")({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "1rem",
  padding: "2rem",
  justifyContent: "center",
  fontSize: "1.5rem",
  fontWeight: "bold",
  backgroundColor: "var(--black)",
  color: "var(--white)",
  textAlign: "center",
  marginBottom: "4rem",
  p: {
    margin: 0,
    padding: 0,
  },
});

const QRCodeCanvas = styled("canvas")({
  margin: "0 auto",
  padding: "2rem",
  width: "400px",
  height: "400px",
});

const Spacer = styled("div")({
  height: "6rem",
});

const Bars = styled("div")({
  flex: 1,
  maxWidth: "100%",
  width: "100%",
  boxShadow: "0 2rem 2rem rgba(0,0,0,0.65)",
});
