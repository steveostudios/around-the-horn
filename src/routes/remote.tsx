import React, { useCallback, useEffect } from "react";
import { debounce } from "lodash";

import { ConfigData, PlayData, Score } from "../helpers/types";
import { getConfigData, playDataRef } from "../data/dataConfig";
import styled from "@emotion/styled/macro";
import { Page } from "../components/Page";
import { PanelistCard } from "../components/PanelistCard";
import { doc, increment, onSnapshot, updateDoc } from "@firebase/firestore";
import { col, db } from "../data/config";

export const PageRemote: React.FC = () => {
  const [configData, setConfigData] = React.useState<ConfigData>();
  const [playData, setPlayData] = React.useState<PlayData>();
  const [points, setPoints] = React.useState(40);
  const [pointsAwarded, setPointsAwarded] = React.useState<Score[]>([]);

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

  // reset the points when the topic changes
  useEffect(() => {
    setPoints(40);
    setPointsAwarded([]);
  }, [playData?.currentTopicId, playData?.currentMode]);

  // debounce the score updates
  const collectAndSetScores = debounce((panelistId: string, count: number) => {
    updateDoc(doc(db, col, "scores"), {
      [panelistId]: increment(count),
    });
    pushCounts[panelistId] = 0;
  }, 1000);

  const pushCounts: { [key: string]: number } = {};

  // update the push counts
  const updatePushCounts = useCallback(
    (panelistId: string, incrementValue: number) => {
      if (!pushCounts[panelistId]) {
        pushCounts[panelistId] = 0;
      }
      pushCounts[panelistId] += incrementValue;
      collectAndSetScores(panelistId, pushCounts[panelistId]);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  // increment the points awarded
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

  // decrement the points awarded
  const onDecrement = (panelistId: string) => {
    if (points >= 40) return;
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

  if (!configData || !playData) {
    return <div>Loading...</div>;
  }

  return (
    <Page>
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
        {configData.panelists.map((panelist) => (
          <PanelistCard
            key={panelist.id}
            panelist={panelist}
            disabled={
              playData.currentMode !== "play" || !playData.currentTopicId
            }
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
              points >= 40 ||
              !playData.currentTopicId ||
              pointsAwarded.find((score) => score.id === panelist.id)?.value ===
                0 ||
              !pointsAwarded.find((score) => score.id === panelist.id) ||
              playData.currentMode !== "play"
            }
          />
        ))}
      </PanelistGrid>
      <PointsHelper>{points} to award this topic</PointsHelper>
      <PointsHelper>
        Click on the panelist to award points. Click on the points to take them
        back.
      </PointsHelper>
    </Page>
  );
};

const TopicContent = styled("div")({
  padding: "1rem",
  margin: "1rem 0",
  fontSize: "1.5rem",
  fontWeight: "bold",
  height: "6rem",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: "var(--black)",
});

const PanelistGrid = styled("div")({
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
  gap: "1rem",
  padding: "1rem",
  placeItems: "center",
});

const PointsHelper = styled("div")({
  padding: "1rem",
  fontWeight: "bold",
});

const Loading = styled("div")({});
