import React, { useContext, useEffect, useState } from "react";

import PositionPlot from "../touch_plots/PositionPlot";

import { TouchcommTouchReport } from "@webds/service";

import { TouchDataContext } from "../local_exports";

const SLOW_X = 3;

let playbackData: TouchcommTouchReport[];

let running: boolean;

let frameIndex: number;

let requestID: number | undefined;

let animationCounter: number;

const stopAnimation = () => {
  if (requestID) {
    cancelAnimationFrame(requestID);
    requestID = undefined;
  }
};

export const PlaybackPosition = (props: any): JSX.Element | null => {
  const [initialized, setInitialized] = useState<boolean>(false);
  const [report, setReport] = useState<TouchcommTouchReport>();

  playbackData = useContext(TouchDataContext);

  const animatePlot = () => {
    requestID = requestAnimationFrame(animatePlot);

    if (running) {
      if (animationCounter === SLOW_X) {
        animationCounter = 1;
        props.setFrameIndex(frameIndex);
        setReport(playbackData[frameIndex]);
        if (frameIndex + 1 >= props.numFrames) {
          props.setRun(false);
        } else {
          frameIndex += 1;
        }
      }
      animationCounter++;
    }
  };

  useEffect(() => {
    if (!running) {
      frameIndex = props.frameIndex;
      setReport(playbackData[frameIndex]);
    }
  }, [props.frameIndex]);

  useEffect(() => {
    if (props.passive) {
      return;
    }
    if (frameIndex + 1 >= props.numFrames) {
      frameIndex = 0;
    }
    running = props.run;
  }, [props.passive, props.run, props.numFrames]);

  useEffect(() => {
    const initialize = () => {
      animationCounter = 1;
      requestID = requestAnimationFrame(animatePlot);
      setInitialized(true);
    };

    if (props.passive) {
      if (!initialized) {
        setInitialized(true);
      }
      return;
    }

    if (!initialized) {
      initialize();
    } else {
      stopAnimation();
      props.setRun(false);
      props.setFrameIndex(0);
      animationCounter = 1;
      requestID = requestAnimationFrame(animatePlot);
    }

    return () => {
      stopAnimation();
    };
  }, [playbackData]);

  return initialized ? (
    <div>
      <PositionPlot
        length={props.length}
        portrait={props.portrait}
        appInfo={props.appInfo}
        report={report}
      />
    </div>
  ) : null;
};

export default PlaybackPosition;
