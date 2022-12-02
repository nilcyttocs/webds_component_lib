import React, { useContext, useEffect, useState } from "react";

import TracePlot from "../touch_plots/TracePlot";

import { TouchcommTraceReport } from "@webds/service";

import { TraceDataContext } from "../local_exports";

const SLOW_X = 3;

let playbackData: TouchcommTraceReport[];

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

export const PlaybackTrace = (props: any): JSX.Element | null => {
  const [initialized, setInitialized] = useState<boolean>(false);
  const [report, setReport] = useState<TouchcommTraceReport>();

  playbackData = useContext(TraceDataContext);

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
      <TracePlot
        length={props.length}
        portrait={props.portrait}
        appInfo={props.appInfo}
        report={report}
      />
    </div>
  ) : null;
};

export default PlaybackTrace;
