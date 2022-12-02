import React, { useEffect, useState } from "react";

import { useTheme } from "@mui/material/styles";

import { TouchcommADCReport } from "@webds/service";

import Plot from "react-plotly.js";

const PLOT_LENGTH = 550;

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

let swap: boolean;

const plotConfig = { displayModeBar: false };
const paperBgColor = "rgba(0, 0, 0, 0)";

const transpose = (matrix: number[][]): number[][] => {
  return matrix[0].map((col, i) => matrix.map((row) => row[i]));
};

const computePlot = (report: TouchcommADCReport) => {
  heatZ = report.image;

  if (heatZ === undefined) {
    return;
  }

  if (swap) {
    heatZ = transpose(heatZ);
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

  const renderPlot = (report: TouchcommADCReport) => {
    computePlot(report);

    if (heatZ === undefined) {
      return;
    }

    setHeatLayout({
      width: (swap ? plotHeight : plotWidth) + plotMargins.l + plotMargins.r,
      height: (swap ? plotWidth : plotHeight) + plotMargins.t + plotMargins.b,
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
      if (numCols > numRows) {
        plotWidth = props.length !== undefined ? props.length : PLOT_LENGTH;
        plotHeight = Math.floor((plotWidth * numRows) / numCols);
      } else {
        plotHeight = props.length !== undefined ? props.length : PLOT_LENGTH;
        plotWidth = Math.floor((plotHeight * numCols) / numRows);
      }
      swap = props.portrait && plotWidth > plotHeight;
      if (props.margins !== undefined) {
        plotMargins = props.margins;
      }
      setHeatConfig(plotConfig);
      setInitialized(true);
    }
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
