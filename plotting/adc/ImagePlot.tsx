import React, { useEffect, useState } from "react";

import { useTheme } from "@mui/material/styles";

import { TouchcommReport } from "../utils";

import Plot from "react-plotly.js";

const PLOT_WIDTH = 550;

let numRows: number;
let numCols: number;
let plotWidth: number;
let plotHeight: number;
let plotMargins = {
  l: 0,
  r: 0,
  t: 0,
  b: 0
};

let heatZ: number[][];
let heatZMin: number;
let heatZMax: number;

const plotConfig = { displayModeBar: false };
const paperBgColor = "rgba(0, 0, 0, 0)";

const computePlot = (report: TouchcommReport) => {
  heatZ = report.image;

  if (heatZ === undefined) {
    return;
  }

  const minRow = heatZ.map((row: number[]) => {
    return Math.min.apply(Math, row);
  });
  heatZMin = Math.min.apply(Math, minRow);
  const maxRow = heatZ.map((row: number[]) => {
    return Math.max.apply(Math, row);
  });
  heatZMax = Math.max.apply(Math, maxRow);
};

export const ImagePlot = (props: any): JSX.Element | null => {
  const [initialized, setInitialized] = useState<boolean>(false);
  const [showPlot, setShowPlot] = useState<boolean>(false);
  const [heatData, setHeatData] = useState<any>([]);
  const [heatConfig, setHeatConfig] = useState<any>({});
  const [heatLayout, setHeatLayout] = useState<any>({});
  const [heatFrames, setHeatFrames] = useState<any>([]);

  const theme = useTheme();

  const storeHeatState = (figure: any) => {
    setHeatData(figure.data);
    setHeatConfig(figure.config);
    setHeatLayout(figure.layout);
    setHeatFrames(figure.frames);
  };

  const renderPlot = (report: TouchcommReport) => {
    computePlot(report);

    if (heatZ === undefined) {
      return;
    }

    setHeatLayout({
      width: plotWidth + plotMargins.l + plotMargins.r,
      height: plotHeight + plotMargins.t + plotMargins.b,
      margin: plotMargins,
      font: {
        color: theme.palette.text.primary
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
        zmin: props.zMin !== undefined ? props.zMin : heatZMin,
        zmax: props.zMax !== undefined ? props.zMax : heatZMax,
        type: "heatmap",
        showscale: props.showScale !== undefined ? props.showScale : true,
        colorscale: "Viridis",
        colorbar: {
          tickformat: "<-d",
          tickmode: "array",
          tickvals: [
            props.zMin !== undefined ? props.zMin : heatZMin,
            props.zMax !== undefined ? props.zMax : heatZMax
          ]
        }
      }
    ]);

    setShowPlot(true);
  };

  useEffect(() => {
    if (props.report === undefined) {
      return;
    }
    if (!initialized) {
      numRows = props.report.image.length;
      numCols = props.report.image[0].length;
      plotWidth = props.width !== undefined ? props.width : PLOT_WIDTH;
      plotHeight = Math.floor((plotWidth * numRows) / numCols);
      if (props.margins !== undefined) {
        plotMargins = props.margins;
      }
      setInitialized(true);
    }
    setHeatConfig(plotConfig);
    renderPlot(props.report);
  }, [props.report]);

  return showPlot ? (
    <Plot
      data={heatData}
      config={heatConfig}
      layout={heatLayout}
      frames={heatFrames}
      onInitialized={(figure) => storeHeatState(figure)}
      onUpdate={(figure) => storeHeatState(figure)}
    />
  ) : null;
};

export default ImagePlot;
