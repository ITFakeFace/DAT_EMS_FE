import { useState } from "react";
import { useIntl } from "react-intl";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Filler,
  Tooltip as ChartTooltip,
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { Line, Bar } from "react-chartjs-2";
import { FaBolt, FaDroplet, FaFireFlameCurved } from "react-icons/fa6";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Filler,
  ChartTooltip,
);

const trendConfig = {
  electric: {
    instantUnit: "kW",
    accumulatedUnit: "kWh",
    color: "rgba(59, 130, 246, 0.8)",
    solidColor: "rgb(59, 130, 246)",
    instantStepSize: 20,
    instantMax: 80,
    accumulatedStepSize: 5000,
    instantData: [32, 30, 34, 20, 42, 69, 72, 59, 65, 63, 38, 21, 15],
    accumulatedData: [12800, 16400, 14200, 18800, 15300, 19600, 16100],
  },
  water: {
    instantUnit: "m³/h",
    accumulatedUnit: "m³",
    color: "rgba(34, 211, 238, 0.8)",
    solidColor: "rgb(34, 211, 238)",
    instantStepSize: 20,
    instantMax: 100,
    accumulatedStepSize: 60,
    instantData: [45, 42, 48, 38, 55, 72, 78, 69, 76, 70, 58, 49, 43],
    accumulatedData: [165, 210, 175, 240, 195, 190, 225],
  },
  gas: {
    instantUnit: "Nm³/h",
    accumulatedUnit: "Nm³",
    color: "rgba(245, 158, 11, 0.8)",
    solidColor: "rgb(245, 158, 11)",
    instantStepSize: 50,
    instantMax: 200,
    accumulatedStepSize: 1000,
    instantData: [
      110, 105, 112, 95, 130, 165, 170, 150, 160, 155, 135, 120, 108,
    ],
    accumulatedData: [4200, 4600, 4400, 4900, 4700, 5100, 5100],
  },
};

const instantLabels = [
  "00:00",
  "02:00",
  "04:00",
  "06:00",
  "08:00",
  "10:00",
  "12:00",
  "14:00",
  "16:00",
  "18:00",
  "20:00",
  "22:00",
  "24:00",
];

const accumulatedLabels = [
  "15/08",
  "16/08",
  "17/08",
  "18/08",
  "19/08",
  "20/08",
  "21/08",
];

const formatAccumulatedValue = (value) => {
  if (value < 1000) return value;

  const result = value / 1000;

  return `${Number.isInteger(result) ? result : result.toFixed(1)}k`;
};

const barHoverBackground = {
  id: "barHoverBackground",

  beforeDatasetsDraw(chart) {
    const activeElements = chart.getActiveElements();

    if (!activeElements.length) return;

    const { ctx, chartArea, scales } = chart;
    const index = activeElements[0].index;
    const xScale = scales.x;

    const center = xScale.getPixelForTick(index);
    const previous = index > 0 ? xScale.getPixelForTick(index - 1) : null;
    const next =
      index < xScale.ticks.length - 1
        ? xScale.getPixelForTick(index + 1)
        : null;

    const left =
      previous !== null
        ? (previous + center) / 2
        : center - (next - center) / 2;

    const right =
      next !== null ? (center + next) / 2 : center + (center - previous) / 2;

    ctx.save();
    ctx.fillStyle = "rgba(226, 232, 240, 0.18)";
    ctx.fillRect(
      left,
      chartArea.top,
      right - left,
      chartArea.bottom - chartArea.top,
    );
    ctx.restore();
  },
};

export default function DashboardTrendCard() {
  const lang = useIntl();
  const [trendType, setTrendType] = useState("electric");

  const currentTrend = trendConfig[trendType];
  const accumulatedValues = currentTrend.accumulatedData;
  const lastIndex = accumulatedValues.length - 1;

  const previousValue = accumulatedValues[lastIndex - 1];
  const currentValue = accumulatedValues[lastIndex];

  const isIncrease = currentValue > previousValue;
  const isDecrease = currentValue < previousValue;

  const changePercent =
    previousValue !== 0
      ? ((currentValue - previousValue) / previousValue) * 100
      : 0;

  const percent = Math.abs(changePercent).toFixed(2);

  const compareText = isIncrease
    ? lang.formatMessage({ id: "dashboard_trend_increase" }, { percent })
    : isDecrease
      ? lang.formatMessage({ id: "dashboard_trend_decrease" }, { percent })
      : null;

  const compareColor = isIncrease
    ? "rgb(16, 185, 129)"
    : isDecrease
      ? "rgb(239, 68, 68)"
      : currentTrend.solidColor;

  const instantTrendData = {
    labels: instantLabels,
    datasets: [
      {
        data: currentTrend.instantData,
        borderColor: currentTrend.solidColor,
        borderWidth: 2,
        pointRadius: 0,
        pointHoverRadius: 4,
        tension: 0.4,
        fill: true,
        backgroundColor: (context) => {
          const { ctx, chartArea } = context.chart;

          if (!chartArea) return currentTrend.color;

          const gradient = ctx.createLinearGradient(
            0,
            chartArea.top,
            0,
            chartArea.bottom,
          );

          gradient.addColorStop(0, currentTrend.color);
          gradient.addColorStop(1, "rgba(0, 0, 0, 0)");

          return gradient;
        },
      },
    ],
  };

  const instantTrendOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: "index",
      intersect: false,
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: "rgb(15, 26, 48)",
        borderColor: "rgb(28, 45, 77)",
        borderWidth: 1,
        titleColor: "rgb(148, 163, 184)",
        bodyColor: "rgb(241, 245, 249)",
        displayColors: false,
        callbacks: {
          label: (context) => `${context.raw} ${currentTrend.instantUnit}`,
        },
      },
    },
    scales: {
      x: {
        border: {
          display: false,
        },
        grid: {
          display: false,
        },
        ticks: {
          color: "rgb(100, 116, 139)",
          font: {
            size: 9,
          },
          callback: function (value, index) {
            return index % 2 === 0 ? this.getLabelForValue(value) : "";
          },
        },
        title: {
          display: true,
          text: lang.formatMessage({
            id: "dashboard_trend_time",
          }),
          color: "rgb(100, 116, 139)",
          font: {
            size: 9,
          },
          padding: {
            top: 12,
          },
        },
      },
      y: {
        beginAtZero: true,
        min: 0,
        max: currentTrend.instantMax,
        border: {
          display: false,
        },
        ticks: {
          stepSize: currentTrend.instantStepSize,
          color: "rgb(100, 116, 139)",
          font: {
            size: 9,
          },
        },
        grid: {
          color: "rgba(148, 163, 184, 0.12)",
          drawTicks: false,
        },
        title: {
          display: true,
          text: currentTrend.instantUnit,
          color: "rgb(203, 213, 225)",
          font: {
            size: 9,
            weight: "bold",
          },
        },
      },
    },
  };

  const accumulatedTrendData = {
    labels: accumulatedLabels,
    datasets: [
      {
        data: accumulatedValues,
        backgroundColor: accumulatedValues.map((_, index) => {
          if (index !== lastIndex) return currentTrend.color;
          if (isIncrease) return "rgba(16, 185, 129, 0.9)";
          if (isDecrease) return "rgba(239, 68, 68, 0.9)";

          return currentTrend.color;
        }),
        borderWidth: 0,
        borderRadius: 4,
        borderSkipped: false,
        maxBarThickness: 40,
        categoryPercentage: 0.7,
        barPercentage: 0.65,
      },
    ],
  };

  const accumulatedTrendOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: "index",
      intersect: false,
    },
    layout: {
      padding: {
        top: 14,
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      datalabels: {
        anchor: "end",
        align: "end",
        offset: 2,
        formatter: (value) => formatAccumulatedValue(value),
        color: (context) => {
          if (context.dataIndex !== lastIndex) {
            return currentTrend.solidColor;
          }

          if (isIncrease) return "rgb(16, 185, 129)";
          if (isDecrease) return "rgb(239, 68, 68)";

          return currentTrend.solidColor;
        },
        font: {
          size: 9,
          weight: "700",
        },
      },
      tooltip: {
        backgroundColor: "rgb(15, 26, 48)",
        borderColor: "rgb(28, 45, 77)",
        borderWidth: 1,
        cornerRadius: 8,
        padding: 10,
        titleColor: "rgb(203, 213, 225)",
        bodyColor: "rgb(241, 245, 249)",
        displayColors: false,
        titleFont: {
          size: 11,
          weight: "600",
        },
        bodyFont: {
          size: 12,
          weight: "700",
        },
        callbacks: {
          title: (items) => items[0].label,
          label: (context) =>
            `${formatAccumulatedValue(context.raw)} ${currentTrend.accumulatedUnit}`,
        },
      },
    },
    scales: {
      x: {
        border: {
          display: false,
        },
        grid: {
          display: false,
        },
        ticks: {
          color: "rgb(100, 116, 139)",
          font: {
            size: 9,
          },
        },
        title: {
          display: true,
          text: lang.formatMessage({
            id: "dashboard_trend_date",
          }),
          color: "rgb(100, 116, 139)",
          font: {
            size: 9,
          },
          padding: {
            top: 10,
          },
        },
      },
      y: {
        beginAtZero: true,
        border: {
          display: false,
        },
        ticks: {
          stepSize: currentTrend.accumulatedStepSize,
          color: "rgb(100, 116, 139)",
          font: {
            size: 9,
          },
          callback: (value) => formatAccumulatedValue(value),
        },
        grid: {
          color: "rgba(148, 163, 184, 0.12)",
          drawTicks: false,
        },
        title: {
          display: true,
          text: currentTrend.accumulatedUnit,
          color: "rgb(203, 213, 225)",
          font: {
            size: 9,
            weight: "bold",
          },
        },
      },
    },
  };

  return (
    <div className="DAT_DashBoard_TrendCard">
      <div className="DAT_DashBoard_TrendCard_Charts">
        <div className="DAT_DashBoard_TrendCard_Charts_Instant">
          <div className="DAT_DashBoard_TrendCard_Charts_Instant_Header">
            <span className="DAT_DashBoard_TrendCard_Charts_Instant_Header_Title">
              {lang.formatMessage({
                id: "dashboard_trend_instant",
              })}
            </span>

            <span className="DAT_DashBoard_TrendCard_Charts_Instant_Header_Unit">
              ({currentTrend.instantUnit})
            </span>
          </div>

          <div className="DAT_DashBoard_TrendCard_Charts_Instant_Content">
            <Line data={instantTrendData} options={instantTrendOptions} />
          </div>
        </div>

        <div className="DAT_DashBoard_TrendCard_Charts_Line" />

        <div className="DAT_DashBoard_TrendCard_Charts_Accumulated">
          <div className="DAT_DashBoard_TrendCard_Charts_Accumulated_Header">
            <div className="DAT_DashBoard_TrendCard_Charts_Accumulated_Header_Title">
              <span>
                {lang.formatMessage({
                  id: "dashboard_trend_accumulated",
                })}
              </span>

              <span className="DAT_DashBoard_TrendCard_Charts_Accumulated_Header_Title_Unit">
                ({currentTrend.accumulatedUnit})
              </span>
            </div>

            {compareText && (
              <span
                className="DAT_DashBoard_TrendCard_Charts_Accumulated_Header_Compare"
                style={{ color: compareColor }}
              >
                {compareText}
              </span>
            )}
          </div>

          <div className="DAT_DashBoard_TrendCard_Charts_Accumulated_Content">
            <Bar
              data={accumulatedTrendData}
              options={accumulatedTrendOptions}
              plugins={[ChartDataLabels, barHoverBackground]}
            />
          </div>
        </div>
      </div>

      <div className="DAT_DashBoard_TrendCard_Line" />

      <div className="DAT_DashBoard_TrendCard_Switch">
        <button
          type="button"
          className={`DAT_DashBoard_TrendCard_Switch_Item DAT_DashBoard_TrendCard_Switch_Item_Electric ${
            trendType === "electric"
              ? "DAT_DashBoard_TrendCard_Switch_Item_Active"
              : ""
          }`}
          onClick={() => setTrendType("electric")}
        >
          <FaBolt />
          {lang.formatMessage({
            id: "dashboard_trend_electric",
          })}
        </button>

        <button
          type="button"
          className={`DAT_DashBoard_TrendCard_Switch_Item DAT_DashBoard_TrendCard_Switch_Item_Water ${
            trendType === "water"
              ? "DAT_DashBoard_TrendCard_Switch_Item_Active"
              : ""
          }`}
          onClick={() => setTrendType("water")}
        >
          <FaDroplet />
          {lang.formatMessage({
            id: "dashboard_trend_water",
          })}
        </button>

        <button
          type="button"
          className={`DAT_DashBoard_TrendCard_Switch_Item DAT_DashBoard_TrendCard_Switch_Item_Gas ${
            trendType === "gas"
              ? "DAT_DashBoard_TrendCard_Switch_Item_Active"
              : ""
          }`}
          onClick={() => setTrendType("gas")}
        >
          <FaFireFlameCurved />
          {lang.formatMessage({
            id: "dashboard_trend_gas",
          })}
        </button>
      </div>
    </div>
  );
}
