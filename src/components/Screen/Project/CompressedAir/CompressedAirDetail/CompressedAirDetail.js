import React from "react";
import { LuChevronLeft } from "react-icons/lu";
import { useIntl } from "react-intl";
import { useNavigate, useParams } from "react-router-dom";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  compressedAirDiagramData,
  compressedAirDetailData,
} from "../../../../Data/Data";
import "./CompressedAirDetail.scss";

function CustomTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    const val = Number(payload[0].value).toFixed(1).replace(".", ",");
    return (
      <div className="DAT_AirDetail_Tooltip">
        <span className="DAT_AirDetail_Tooltip_Time">{label}</span>
        <span className="DAT_AirDetail_Tooltip_Val">
          {val} <strong>Nm³/h</strong>
        </span>
      </div>
    );
  }
  return null;
}

export default function CompressedAirDetail() {
  const lang = useIntl();
  const navigate = useNavigate();
  const { nodeId } = useParams();

  const findNode = (nodes, targetId) => {
    for (const node of nodes) {
      if (String(node.id) === String(targetId) || node.data?.title === targetId) {
        return node;
      }
      if (node.children?.length) {
        const found = findNode(node.children, targetId);
        if (found) return found;
      }
    }
    return null;
  };

  const currentNode = findNode(compressedAirDiagramData, nodeId);
  const detail =
    compressedAirDetailData[Number(nodeId)] ||
    compressedAirDetailData[nodeId] ||
    (currentNode ? compressedAirDetailData[currentNode.id] : null) ||
    compressedAirDetailData[1];

  const chartData = detail?.chart || [];
  const detailName =
    currentNode?.data?.title ||
    detail?.title?.replace(/^Giám sát chi tiết Khí nén\s*/i, "") ||
    "";
  const descKeyMap = {
    "Áp suất đường ống": "air_desc_pipe_pressure",
    "Áp suất đường ống xưởng": "air_desc_workshop_pipe_pressure",
    "Lưu lượng tức thời": "air_desc_instant_flow",
    "Lưu lượng phân xưởng": "air_desc_workshop_flow",
    "Thể tích tích lũy": "air_desc_accumulated_volume",
  };

  return (
    <div className="DAT_AirDetail">
      {/* Header */}
      <div className="DAT_AirDetail_Header">
        <button
          type="button"
          className="DAT_AirDetail_Header_BackBtn"
          onClick={() => navigate(-1)}
        >
          <LuChevronLeft />
        </button>
        <h2 className="DAT_AirDetail_Header_Title">
          {lang.formatMessage({ id: "air_detail_fallback_title" }, { title: detailName })}
        </h2>
      </div>

      {/* 3 Thẻ chỉ số */}
      <div className="DAT_AirDetail_StatCards">
        <div className="DAT_AirDetail_StatCards_Card">
          <span className="DAT_AirDetail_StatCards_Card_Label">{lang.formatMessage({ id: "air_detail_pressure" })}</span>
          <div className="DAT_AirDetail_StatCards_Card_ValueGroup">
            <span className="DAT_AirDetail_StatCards_Card_ValueGroup_Value">{detail?.pressure?.value}</span>
            <span className="DAT_AirDetail_StatCards_Card_ValueGroup_Unit">{detail?.pressure?.unit}</span>
          </div>
          <span className="DAT_AirDetail_StatCards_Card_Sub">{lang.formatMessage({ id: descKeyMap[detail?.pressure?.desc] || "air_desc_pipe_pressure" })}</span>
        </div>

        <div className="DAT_AirDetail_StatCards_Card">
          <span className="DAT_AirDetail_StatCards_Card_Label">{lang.formatMessage({ id: "air_detail_flow" })}</span>
          <div className="DAT_AirDetail_StatCards_Card_ValueGroup">
            <span className="DAT_AirDetail_StatCards_Card_ValueGroup_Value">{detail?.flowRate?.value}</span>
            <span className="DAT_AirDetail_StatCards_Card_ValueGroup_Unit">{detail?.flowRate?.unit}</span>
          </div>
          <span className="DAT_AirDetail_StatCards_Card_Sub">{lang.formatMessage({ id: descKeyMap[detail?.flowRate?.desc] || "air_desc_instant_flow" })}</span>
        </div>

        <div className="DAT_AirDetail_StatCards_Card">
          <span className="DAT_AirDetail_StatCards_Card_Label">{lang.formatMessage({ id: "air_detail_total_volume" })}</span>
          <div className="DAT_AirDetail_StatCards_Card_ValueGroup">
            <span className="DAT_AirDetail_StatCards_Card_ValueGroup_Value">{detail?.totalVolume?.value}</span>
            <span className="DAT_AirDetail_StatCards_Card_ValueGroup_Unit">{detail?.totalVolume?.unit}</span>
          </div>
          <span className="DAT_AirDetail_StatCards_Card_Sub">{lang.formatMessage({ id: descKeyMap[detail?.totalVolume?.desc] || "air_desc_accumulated_volume" })}</span>
        </div>
      </div>

      {/* Khung Đồ Thị Recharts */}
      <div className="DAT_AirDetail_ChartCard">
        <div className="DAT_AirDetail_ChartCard_Header">
          <h3 className="DAT_AirDetail_ChartCard_Header_Title">{lang.formatMessage({ id: "air_detail_chart_title" })}</h3>
          <p className="DAT_AirDetail_ChartCard_Header_Sub">{lang.formatMessage({ id: "air_detail_chart_subtitle" })}</p>
        </div>

        <div className="DAT_AirDetail_ChartCard_Wrap">
          <ResponsiveContainer width="100%" height={260}>
            <LineChart
              data={chartData}
              margin={{ top: 15, right: 30, left: 0, bottom: 20 }}
            >
              <defs>
                <filter id="airLineGlow" x="-20%" y="-20%" width="140%" height="140%">
                  <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="rgba(245, 158, 11, 1)" floodOpacity="0.8" />
                </filter>
              </defs>

              <CartesianGrid
                strokeDasharray="4 4"
                stroke="rgba(255, 255, 255, 0.08)"
                vertical={false}
              />

              <YAxis
                domain={[0, 180]}
                ticks={[0, 45, 90, 135, 180]}
                stroke="rgba(255, 255, 255, 0.2)"
                tick={{ fill: "rgba(148, 163, 184, 1)", fontSize: 11, fontFamily: "monospace" }}
                axisLine={{ stroke: "rgba(255, 255, 255, 0.2)" }}
                tickLine={{ stroke: "rgba(255, 255, 255, 0.2)" }}
                label={{
                  value: "Nm³/h",
                  position: "insideLeft",
                  angle: -90,
                  offset: 10,
                  fill: "rgba(148, 163, 184, 1)",
                  fontSize: 11,
                }}
              />

              <XAxis
                dataKey="time"
                stroke="rgba(255, 255, 255, 0.2)"
                tick={{ fill: "rgba(148, 163, 184, 1)", fontSize: 11, fontFamily: "monospace" }}
                axisLine={{ stroke: "rgba(255, 255, 255, 0.2)" }}
                tickLine={false}
                dy={10}
                label={{
                  value: lang.formatMessage({ id: "project_monitor_time" }),
                  position: "insideBottom",
                  offset: -12,
                  fill: "rgba(148, 163, 184, 1)",
                  fontSize: 11,
                }}
              />

              <Tooltip
                content={<CustomTooltip />}
                cursor={{
                  stroke: "rgba(255, 255, 255, 0.6)",
                  strokeWidth: 1.5,
                }}
              />

              <Line
                type="monotone"
                dataKey="value"
                stroke="rgba(245, 158, 11, 1)"
                strokeWidth={3.5}
                dot={{
                  r: 4.5,
                  fill: "rgba(245, 158, 11, 1)",
                  stroke: "rgba(255, 255, 255, 1)",
                  strokeWidth: 2,
                }}
                activeDot={{
                  r: 7,
                  fill: "rgba(255, 255, 255, 1)",
                  stroke: "rgba(245, 158, 11, 1)",
                  strokeWidth: 3,
                }}
                filter="url(#airLineGlow)"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
