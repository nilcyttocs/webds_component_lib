import React, { useContext, useState, useEffect } from "react";

import { useTheme } from "@mui/material/styles";

import Plot from "react-plotly.js";

import { ContextData, Context, requestAPI } from "../local_exports";

const SSE_CLOSED = 2;

const REPORT_DELTA = 18;

const REPORT_FPS = 120;
const RENDER_FPS = 15;
const RENDER_INTERVAL = 1000 / RENDER_FPS;

const heatLMargin = 0;
const heatRMargin = 0;
const heatTMargin = 0;
const heatBMargin = 0;

let plotWidth: number;
let plotHeight: number;

let heatZ: number[][] | undefined;
let heatZMin: number;
let heatZMax: number;

let numRows = 0;
let numCols = 0;

let tThen: number;

const plotConfig = { displayModeBar: false };
const paperBgColor = "rgba(0, 0, 0, 0)";

let fontColor = "";
let requestID: number | undefined;

let eventSource: EventSource | undefined = undefined;
let eventData: any = undefined;
let eventError = false;

const eventHandler = (event: any) => {
  const data = JSON.parse(event.data);
  if (!data || !data.report) {
    return;
  }
  if (data.report[0] === "delta") {
    eventData = data.report[1];
  } else {
    return;
  }

  if (eventData.image === undefined) {
    return;
  }
};

const removeEvent = () => {
  if (eventSource && eventSource.readyState !== SSE_CLOSED) {
    eventSource.removeEventListener("report", eventHandler, false);
    eventSource.close();
    eventSource = undefined;
  }
};

const errorHandler = (error: any) => {
  eventError = true;
  removeEvent();
  console.error(`Error on GET /webds/report\n${error}`);
};

const addEvent = () => {
  if (eventSource) {
    return;
  }
  eventError = false;
  eventSource = new window.EventSource("http://localhost:8888/webds/report");
  eventSource.addEventListener("report", eventHandler, false);
  eventSource.addEventListener("error", errorHandler, false);
};

const setReport = async (
  disable: number[],
  enable: number[]
): Promise<void> => {
  const dataToSend = { enable, disable, fps: REPORT_FPS };
  try {
    await requestAPI<any>("report", {
      body: JSON.stringify(dataToSend),
      method: "POST"
    });
    addEvent();
  } catch (error) {
    console.error("Error - POST /webds/report");
    return Promise.reject("Failed to enable/disable report types");
  }
  return Promise.resolve();
};

const stopAnimation = () => {
  if (requestID) {
    cancelAnimationFrame(requestID);
    requestID = undefined;
  }
};

const computePlot = () => {
  if (eventData === undefined || eventData.image === undefined) {
    heatZ = undefined;
    return;
  }

  heatZ = eventData.image;

  const minRow = heatZ!.map((row: number[]) => {
    return Math.min.apply(Math, row);
  });
  heatZMin = Math.min.apply(Math, minRow);
  const maxRow = heatZ!.map((row: number[]) => {
    return Math.max.apply(Math, row);
  });
  heatZMax = Math.max.apply(Math, maxRow);
};

export const DeltaImage = (props: any): JSX.Element => {
  const [showPlot, setShowPlot] = useState<boolean>(false);
  const [heatData, setHeatData] = useState<any>([]);
  const [heatConfig, setHeatConfig] = useState<any>({});
  const [heatLayout, setHeatLayout] = useState<any>({});
  const [heatFrames, setHeatFrames] = useState<any>([]);

  const contextData: ContextData = useContext(Context);

  const theme = useTheme();

  const storeHeatState = (figure: any) => {
    setHeatData(figure.data);
    setHeatConfig(figure.config);
    setHeatLayout(figure.layout);
    setHeatFrames(figure.frames);
  };

  const renderPlot = () => {
    computePlot();

    if (heatZ === undefined) {
      return;
    }

    setHeatLayout({
      width: plotWidth,
      height: plotHeight,
      margin: {
        l: heatLMargin,
        r: heatRMargin,
        t: heatTMargin,
        b: heatBMargin
      },
      font: {
        color: fontColor
      },
      paper_bgcolor: paperBgColor,
      xaxis: {
        ticks: "",
        showticklabels: false
      },
      yaxis: {
        ticks: "",
        showticklabels: false
      }
    });

    setHeatData([
      {
        z: heatZ,
        zmin: props.zMin ? props.zMin : heatZMin,
        zmax: props.zMax ? props.zMax : heatZMax,
        type: "heatmap",
        showscale: props.showScale !== undefined ? props.showScale : true,
        colorscale: "Viridis",
        colorbar: {
          tickformat: "<-d",
          tickmode: "array",
          tickvals: [
            props.zMin ? props.zMin : heatZMin,
            props.zMax ? props.zMax : heatZMax
          ]
        }
      }
    ]);
  };

  const animatePlot = () => {
    if (eventError) {
      return;
    }

    requestID = requestAnimationFrame(animatePlot);

    const tNow = window.performance.now();
    const elapsed = tNow - tThen;

    if (elapsed <= RENDER_INTERVAL) {
      return;
    }

    tThen = tNow - (elapsed % RENDER_INTERVAL);

    renderPlot();
    if (heatZ === undefined) {
      return;
    }

    setShowPlot(true);
    if (props.setPlotReady !== undefined) {
      props.setPlotReady(true);
    }
  };

  const startAnimation = () => {
    eventData = undefined;
    tThen = window.performance.now();
    requestID = requestAnimationFrame(animatePlot);
  };

  const newPlot = async () => {
    setHeatConfig(plotConfig);
    try {
      await setReport([], [REPORT_DELTA]);
    } catch (error) {
      console.error(error);
      return;
    }
    startAnimation();
  };

  useEffect(() => {
    fontColor = theme.palette.text.primary;
  }, [theme]);

  useEffect(() => {
    const pause = () => {
      removeEvent();
    };
    const resume = async () => {
      try {
        await setReport([], [REPORT_DELTA]);
      } catch (error) {
        console.error(error);
        return;
      }
    };
    if (props.pauseResume === "pause") {
      pause();
    } else if (props.pauseResume === "resume") {
      resume();
    }
  }, [props.pauseResume]);

  useEffect(() => {
    newPlot();
    return () => {
      stopAnimation();
      removeEvent();
    };
  }, []);

  useEffect(() => {
    plotWidth = props.plotWidth;
    numRows = contextData.numRows;
    numCols = contextData.numCols;
    plotHeight = Math.floor((plotWidth * numRows) / numCols);
  }, [props.plotWidth, contextData.numRows, contextData.numCols]);

  return (
    <div
      style={{
        width: plotWidth + "px",
        height: plotHeight + "px"
      }}
    >
      {showPlot && (
        <Plot
          data={heatData}
          config={heatConfig}
          layout={heatLayout}
          frames={heatFrames}
          onInitialized={(figure) => storeHeatState(figure)}
          onUpdate={(figure) => storeHeatState(figure)}
        />
      )}
    </div>
  );
};

export default DeltaImage;
