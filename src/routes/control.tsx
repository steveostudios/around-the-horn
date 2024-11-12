import React, { useEffect } from "react";
import {
  configDataRef,
  moderatorScoresDataRef,
  playDataRef,
  scoresDataRef,
} from "../data/dataConfig";
import { Page } from "../components/Page";
import { ConfigData, Mode, PlayData, Score, ScoreType } from "../helpers/types";
import { getDoc, increment, onSnapshot, updateDoc } from "@firebase/firestore";
import { TopicList } from "../components/TopicList";
import { Button } from "../components/Button";
import { Column, Header, Row } from "../layout";
import styled from "@emotion/styled";
import IconDelete from "./../assets/icons/trash-solid-primary.svg";
import IconAdd from "./../assets/icons/plus-solid-primary.svg";
import IconMinus from "./../assets/icons/minus-solid-primary.svg";
import IconEye from "./../assets/icons/eye-solid-primary.svg";
import IconEyeSlash from "./../assets/icons/eye-slash-solid-primary.svg";
import { Text } from "../components/Text";

export const PageControl: React.FC = () => {
  const [configData, setConfigData] = React.useState<ConfigData>();
  const [playData, setPlayData] = React.useState<PlayData>();
  const [scores, setScores] = React.useState<Score[]>([]);
  const [moderatorScores, setModeratorScores] = React.useState<Score[]>([]);

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

  // stream config data
  useEffect(() => {
    const unsubscribe = onSnapshot(configDataRef, (snap) => {
      if (snap.exists()) {
        const data = snap.data();
        setConfigData({
          panelists: data.panelists,
          topics: data.topics,
        });
      }
    });

    return () => unsubscribe();
  }, []);

  // reset the points
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

  // reset the points
  const onResetModerator = async () => {
    const scoresSnapshot = await getDoc(moderatorScoresDataRef);
    if (scoresSnapshot.exists()) {
      const data = scoresSnapshot.data();
      Object.keys(data).map((key) =>
        updateDoc(moderatorScoresDataRef, {
          [key]: 0,
        })
      );
    }
  };

  const onIncrementModeratorScore = (panelistId: string) => {
    const score = scores.find((score) => score.id === panelistId);
    if (!score) {
      return;
    }

    updateDoc(moderatorScoresDataRef, {
      [panelistId]: increment(1),
    });
  };

  const onDecrementModeratorScore = (panelistId: string) => {
    const score = scores.find((score) => score.id === panelistId);
    if (!score) {
      return;
    }

    updateDoc(moderatorScoresDataRef, {
      [panelistId]: increment(1),
    });
  };

  const onSetModeratorScore = (panelistId: string, value: number) => {
    updateDoc(moderatorScoresDataRef, {
      [panelistId]: value,
    });
  };

  const onTogglePanelistVisibility = (panelistId: string) => {
    updateDoc(playDataRef, {
      currentPanelists: playData?.currentPanelists.includes(panelistId)
        ? playData?.currentPanelists.filter((id) => id !== panelistId)
        : [...(playData?.currentPanelists || []), panelistId],
    });
  };

  // change the mode
  const onChangeMode = async (mode: string) => {
    if (mode === Mode.INSTRUCTION) {
      updateDoc(playDataRef, {
        currentMode: mode,
        currentTopicId: null,
      });
      return;
    }
    updateDoc(playDataRef, {
      currentMode: mode,
    });
  };

  const onChangeScoreType = async (scoreType: string) => {
    updateDoc(playDataRef, {
      currentScoreType: scoreType,
    });
  };

  return (
    <Page isAdmin>
      <ControlPanel>
        <Column>
          <Header label="Audience Scores" />
          <Row>
            <Button
              name="showAudienceScores"
              onClick={() => {
                onChangeScoreType(ScoreType.AUDIENCE);
              }}
              selected={playData?.currentScoreType === ScoreType.AUDIENCE}
            >
              Show Audience Scores
            </Button>
            <Button name="reset" onClick={onReset} fitWidth>
              <img src={IconDelete} alt="Reset" />
            </Button>
          </Row>
          {configData?.panelists.map((panelist) => (
            <Row key={panelist.id}>
              <PanelistName
                style={{
                  opacity: playData?.currentPanelists.includes(panelist.id)
                    ? 1
                    : 0.25,
                }}
              >
                {panelist.name}
              </PanelistName>

              <Text
                id={panelist.id}
                label="score"
                value={(
                  scores.find((score) => score.id === panelist.id)?.value || 0
                ).toString()}
                readonly
              />
              <Text
                id={panelist.id}
                label="score"
                value={
                  (
                    ((scores.find((score) => score.id === panelist.id)?.value ||
                      0 ||
                      0) /
                      scores.reduce((acc, score) => acc + score.value, 0)) *
                      100 || 0
                  )
                    .toFixed(2)
                    .toString() + "%"
                }
                readonly
              />
            </Row>
          ))}
        </Column>
        <Column>
          <Header label="Moderator Scores" />
          <Row>
            <Button
              name="showModeratorScores"
              onClick={() => {
                onChangeScoreType(ScoreType.MODERATOR);
              }}
              selected={playData?.currentScoreType === ScoreType.MODERATOR}
            >
              Show Moderator Scores
            </Button>
            <Button name="reset" onClick={onResetModerator} fitWidth>
              <img src={IconDelete} alt="Reset" />
            </Button>
          </Row>
          {configData?.panelists.map((panelist) => (
            <Row key={panelist.id}>
              <PanelistName
                style={{
                  opacity: playData?.currentPanelists.includes(panelist.id)
                    ? 1
                    : 0.25,
                }}
              >
                {panelist.name}
              </PanelistName>

              <Text
                id={panelist.id}
                label="score"
                value={(
                  moderatorScores.find((score) => score.id === panelist.id)
                    ?.value || 0
                ).toString()}
                onChange={(value) =>
                  onSetModeratorScore(panelist.id, parseInt(value))
                }
              />

              <Button
                name="increment"
                fitWidth
                onClick={() => onIncrementModeratorScore(panelist.id)}
              >
                <img src={IconAdd} alt="Increment" />
              </Button>
              <Button
                name="decrement"
                fitWidth
                onClick={() => onDecrementModeratorScore(panelist.id)}
              >
                <img src={IconMinus} alt="Decrement" />
              </Button>
            </Row>
          ))}
        </Column>
      </ControlPanel>
      <ControlPanel>
        <Column>
          <Header label="Modes" />
          <Row>
            <Button
              name="instruction_mode"
              onClick={() => onChangeMode(Mode.INSTRUCTION)}
              selected={playData?.currentMode === Mode.INSTRUCTION}
            >
              Show Instruction
            </Button>
            <Button
              name="pause_mode"
              onClick={() => onChangeMode(Mode.PAUSE)}
              selected={playData?.currentMode === Mode.PAUSE}
            >
              Disabled Scoring
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
            currentMode={playData?.currentMode}
            currentTopics={playData?.currentTopics || []}
          />
        </Column>
      </ControlPanel>
      <ControlPanel>
        <Column>
          <Header label="Panelists" />
          {configData?.panelists.map((panelist) => (
            <Row key={panelist.id}>
              <Button
                name="increment"
                fitWidth
                onClick={() => onTogglePanelistVisibility(panelist.id)}
              >
                {playData?.currentPanelists.includes(panelist.id) ? (
                  <img src={IconEye} alt="visible" />
                ) : (
                  <img src={IconEyeSlash} alt="hidden" />
                )}
              </Button>
              <PanelistName
                style={{
                  opacity: playData?.currentPanelists.includes(panelist.id)
                    ? 1
                    : 0.25,
                }}
              >
                {panelist.name}
              </PanelistName>
            </Row>
          ))}
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

const PanelistName = styled("div")({
  flex: 1,
});
