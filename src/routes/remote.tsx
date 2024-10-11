import React, { useEffect } from "react";

import { ConfigData, Panelist, PlayData, Score, Topic } from "../helpers/types";
import { getConfigData, playDataRef } from "../data/dataConfig";
import styled from "@emotion/styled/macro";
import { Page } from "../components/Page";
import { PanelistCard } from "../components/PanelistCard";
import { doc, increment, onSnapshot, updateDoc } from "@firebase/firestore";
import { col, db } from "../data/config";

interface Props {
  children?: React.ReactNode;
  currentTopicId: string;
  panelists: Panelist[];
  topics: Topic[];
  scores: Score[];
}

export const PageRemote: React.FC<Props> = (props) => {
  const [configData, setConfigData] = React.useState<ConfigData>();
  const [playData, setPlayData] = React.useState<PlayData>();
  const [points, setPoints] = React.useState(40);
  const [pointsAwarded, setPointsAwarded] = React.useState<Score[]>([]);

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

  // reset the points
  useEffect(() => {
    setPoints(40);
    setPointsAwarded([]);
  }, [playData?.currentTopicId, playData?.currentMode]);

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
    updateDoc(doc(db, col, "scores"), {
      [panelistId]: increment(1),
    });
  };

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
    updateDoc(doc(db, col, "scores"), {
      [panelistId]: increment(-1),
    });
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
  }, [props.currentTopicId]);

  if (!configData || !playData) {
    return <div>Loading...</div>;
  }

  return (
    <Page>
      <TopicContent>
        {
          configData.topics.find(
            (topic) => topic.id === playData.currentTopicId
          )?.content
        }
      </TopicContent>
      <PanelistGrid>
        {configData.panelists.map((panelist) => (
          <PanelistCard
            key={panelist.id}
            panelist={panelist}
            score={pointsAwarded.find((score) => score.id === panelist.id)}
            type="controller"
            onIncrement={onIncrement}
            onDecrement={onDecrement}
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
  fontSize: "1.5rem",
  fontWeight: "bold",
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
