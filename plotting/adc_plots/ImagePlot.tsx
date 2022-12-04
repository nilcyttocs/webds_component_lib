import React, { useEffect, useState } from "react";

import { useTheme } from "@mui/material/styles";

import { TouchcommADCReport } from "@webds/service";

import Plot from "react-plotly.js";

const PLOT_LENGTH = 550;

let plotWidthHeight = { w: 0, h: 0 };

let plotMargins = {
  l: 0,
  r: 0,
  t: 0,
  b: 0
};

let heatZ: number[][] | undefined;
let heatZMin: number | undefined;
let heatZMax: number | undefined;

let swap: boolean;

const plotConfig = { displayModeBar: false };
const paperBgColor = "rgba(0, 0, 0, 0)";

const transpose = (matrix: number[][]): number[][] => {
  return matrix[0].map((col, i) => matrix.map((row) => row[i]));
};

const computePlot = (props: any, report: TouchcommADCReport) => {
  heatZ = report.image;

  if (heatZ === undefined) {
    return;
  }

  if (swap) {
    heatZ = transpose(heatZ);
  }

  if (props.flip?.h) {
    if (swap) {
      heatZ = heatZ.map((item) => item.reverse());
    } else {
      heatZ = heatZ.reverse();
    }
  }

  if (props.flip?.v) {
    if (swap) {
      heatZ = heatZ.reverse();
    } else {
      heatZ = heatZ.map((item) => item.reverse());
    }
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
    computePlot(props, report);

    if (heatZ === undefined) {
      return;
    }

    setHeatLayout({
      width: plotWidthHeight.w + plotMargins.l + plotMargins.r,
      height: plotWidthHeight.h + plotMargins.t + plotMargins.b,
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
      const numRows = props.report.image.length;
      const numCols = props.report.image[0].length;
      if (numCols > numRows) {
        plotWidthHeight.w =
          props.length !== undefined ? props.length : PLOT_LENGTH;
        plotWidthHeight.h = Math.floor((plotWidthHeight.w * numRows) / numCols);
      } else {
        plotWidthHeight.h =
          props.length !== undefined ? props.length : PLOT_LENGTH;
        plotWidthHeight.w = Math.floor((plotWidthHeight.h * numCols) / numRows);
      }
      swap = props.portrait && plotWidthHeight.w > plotWidthHeight.h;
      if (swap) {
        plotWidthHeight = { w: plotWidthHeight.h, h: plotWidthHeight.w };
      }
      plotMargins = props.margins !== undefined ? props.margins : plotMargins;
      setHeatConfig(plotConfig);
      setInitialized(true);
    }
    renderPlot(props.report);
    return () => {
      heatZ = undefined;
      heatZMin = undefined;
      heatZMax = undefined;
    };
  }, [props.report, props.flip]);

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
