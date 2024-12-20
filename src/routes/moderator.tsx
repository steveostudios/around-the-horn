import React, { useCallback, useEffect } from "react";
import { debounce } from "lodash";

import { ConfigData, PlayData, Score, ScoreType } from "../helpers/types";
import { getConfigData, playDataRef } from "../data/dataConfig";
import styled from "@emotion/styled/macro";
import { Page } from "../components/Page";
import { doc, increment, onSnapshot, updateDoc } from "@firebase/firestore";
import { col, db } from "../data/config";
import { MODERATOR_POINTS, MODERATOR_POINTS_DEBOUNCE } from "../helpers/env";
import { PanelistScore } from "../components/PanelistScore";
import { ScoreTypeBar } from "../components/ScoreTypeBar";

export const PageModerator: React.FC = () => {
  const [configData, setConfigData] = React.useState<ConfigData>();
  const [playData, setPlayData] = React.useState<PlayData>();
  const [points, setPoints] = React.useState(MODERATOR_POINTS);
  const [pointsAwarded, setPointsAwarded] = React.useState<Score[]>([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(playDataRef, (snap) => {
      if (snap.exists()) {
        console.log("Data changed", snap.data());
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

  // reset the points
  useEffect(() => {
    setPoints(MODERATOR_POINTS);
    setPointsAwarded([]);
  }, [playData?.currentTopicId, playData?.currentMode]);

  const collectAndSetScores = debounce(() => {
    updateDoc(doc(db, col, "moderatorScores"), {
      ...Object.entries(pushCounts).reduce(
        (acc, [key, value]) => ({
          ...acc,
          [key]: increment(value),
        }),
        {}
      ),
    });

    Object.keys(pushCounts).forEach((key) => {
      pushCounts[key] = 0;
    });
  }, MODERATOR_POINTS_DEBOUNCE);

  const pushCounts: { [key: string]: number } = {};

  const updatePushCounts = useCallback(
    (panelistId: string, incrementValue: number) => {
      if (!pushCounts[panelistId]) {
        pushCounts[panelistId] = 0;
      }
      pushCounts[panelistId] += incrementValue;
      collectAndSetScores();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const onIncrement = (panelistId: string) => {
    if (points <= 0) return;
    setPoints(points - 1);
    setPointsAwarded((prevPointsAwarded) => {
      const existingPanelist = prevPointsAwarded.find(
        (score) => score.id === panelistId
      );
      if (existingPanelist) {
        return prevPointsAwarded.map((score) =>
          score.id === panelistId ? { ...score, value: score.value + 1 } : score
        );
      } else {
        return [...prevPointsAwarded, { id: panelistId, value: 1 }];
      }
    });
    updatePushCounts(panelistId, 1);
  };

  const onDecrement = (panelistId: string) => {
    if (points >= MODERATOR_POINTS) return;
    if (
      (pointsAwarded.find((panelist) => panelist.id === panelistId)?.value ??
        0) <= 0
    ) {
      return;
    }
    setPoints(points + 1);
    setPointsAwarded((prevPointsAwarded) => {
      const existingPanelist = prevPointsAwarded.find(
        (score) => score.id === panelistId
      );
      if (existingPanelist) {
        return prevPointsAwarded.map((score) =>
          score.id === panelistId ? { ...score, value: score.value - 1 } : score
        );
      } else {
        return [...prevPointsAwarded, { id: panelistId, value: -1 }];
      }
    });
    updatePushCounts(panelistId, -1);
  };

  useEffect(() => {
    (async () => {
      const configData = await getConfigData();
      setConfigData({
        panelists: configData.panelists,
        topics: configData.topics,
      });
      console.log(configData);
    })();
  }, []);

  if (!configData || !playData) {
    return <div>Loading...</div>;
  }

  return (
    <Page>
      <ScoreTypeBar currentScoreType={ScoreType.MODERATOR} />
      <TopicContent>
        {playData.currentTopicId ? (
          configData.topics.find(
            (topic) => topic.id === playData.currentTopicId
          )?.content
        ) : playData.currentMode !== "play" ? (
          <Loading>Waiting for users to join</Loading>
        ) : (
          <Loading>Waiting for topic</Loading>
        )}
      </TopicContent>
      <PanelistGrid>
        {configData.panelists
          .filter((panelist) => playData.currentPanelists.includes(panelist.id))
          .sort((a, b) => a.order - b.order)
          .map((panelist) => (
            <PanelistScore
              key={panelist.id}
              panelist={panelist}
              scoreType="points"
              score={pointsAwarded.find((score) => score.id === panelist.id)}
              type="controller"
              onIncrement={onIncrement}
              disableIncrement={
                points <= 0 ||
                !playData.currentTopicId ||
                playData.currentMode !== "play"
              }
              onDecrement={onDecrement}
              disableDecrement={
                points >= MODERATOR_POINTS ||
                !playData.currentTopicId ||
                pointsAwarded.find((score) => score.id === panelist.id)
                  ?.value === 0 ||
                !pointsAwarded.find((score) => score.id === panelist.id) ||
                playData.currentMode !== "play"
              }
            />
          ))}
      </PanelistGrid>
      {playData.currentMode === "play" && playData.currentTopicId && (
        <PointsCard>
          <div className="instructions">
            Click on the panelist to award points.
          </div>
          {points} to award on this topic
        </PointsCard>
      )}
    </Page>
  );
};

const TopicContent = styled("div")({
  padding: "1rem",
  paddingBottom: "0",
  fontSize: "1.5rem",
  fontWeight: "bold",
  height: "6rem",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: "rgba(0,0,0,0.5)",
});
const PointsCard = styled("div")({
  position: "absolute",
  top: "calc(100% - 1rem)",
  padding: "0.5rem 0",
  backgroundColor: "#213E7F",
  boxShadow: "0 0.5rem 0.5rem rgba(0,0,0,0.65)",
  color: "#ffffff",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "0.5rem",
  justifyContent: "center",
  fontSize: "1.5rem",
  fontWeight: "bold",
  width: "100%",
  marginTop: "-8rem",
  paddingTop: "3rem",
  ".instructions": {
    textAlign: "center",
    fontWeight: "normal",
    fontSize: "1rem",
  },
});

const PanelistGrid = styled("div")({
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
  gap: "1rem",
  padding: "1rem 0",
  placeItems: "center",
  position: "relative",
  zIndex: 10,
  marginBottom: "6rem",
});

const Loading = styled("div")({});
