import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from "chart.js";
import { LuChevronLeft } from "react-icons/lu";
import { useIntl } from "react-intl";
import { electricDetailData } from "../../../../Data/Data";
import "./ElectricDetail.scss";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

export default function ElectricDetail() {
  const lang = useIntl();
  const navigate = useNavigate();
  const { nodeId } = useParams();
  const detail = electricDetailData[Number(nodeId)] || electricDetailData[nodeId] || electricDetailData[1];

  const chartData = {
    labels: detail.chart.map((item) => item.time),
    datasets: [
      {
        label: "kW",
        data: detail.chart.map((item) => item.kw),
        borderColor: "rgba(180, 85, 255, 1)",
        borderWidth: 2.5,
        backgroundColor: "rgba(0, 0, 0, 0)",
        tension: 0.4,
        pointBackgroundColor: "rgba(180, 85, 255, 1)",
        pointBorderColor: "rgba(255, 255, 255, 1)",
        pointBorderWidth: 1,
        pointRadius: 4,
        pointHoverRadius: 6,
        fill: false,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "rgba(10, 18, 42, 0.9)",
        titleColor: "rgba(147, 197, 253, 1)",
        bodyColor: "rgba(255, 255, 255, 1)",
        borderColor: "rgba(0, 130, 202, 0.5)",
        borderWidth: 1,
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: lang.formatMessage({ id: "project_monitor_time" }),
          color: "rgba(125, 143, 166, 1)",
          font: { size: 11 },
          padding: { top: 8 },
        },
        ticks: { color: "rgba(125, 143, 166, 1)", font: { size: 10 } },
        grid: { display: false },
      },
      y: {
        title: {
          display: true,
          text: "kW",
          color: "rgba(125, 143, 166, 1)",
          font: { size: 11 },
        },
        min: 0,
        max: 80,
        ticks: {
          stepSize: 20,
          color: "rgba(125, 143, 166, 1)",
          font: { size: 10 },
        },
        grid: {
          color: "rgba(255, 255, 255, 0.05)",
          drawBorder: false,
        },
      },
    },
  };

  return (
    <div className="DAT_ElectricDetail">
      {/* Header */}
      <div className="DAT_ElectricDetail_Header">
        <button
          type="button"
          className="DAT_ElectricDetail_Header_BackBtn"
          onClick={() => navigate(-1)}
        >
          <LuChevronLeft />
        </button>
        <h2 className="DAT_ElectricDetail_Header_Title">
          {lang.formatMessage({ id: "electric_detail_title" }, { title: detail.title.replace(/^Giám sát chi tiết Điện năng\s*/i, "") })}
        </h2>
      </div>

      {/* 4 Cards Grid */}
      <div className="DAT_ElectricDetail_Grid">
        {/* Card 1: Điện năng tiêu thụ */}
        <section className="DAT_ElectricDetail_Grid_Card">
          <h3 className="DAT_ElectricDetail_Grid_Card_TitleCyan">{lang.formatMessage({ id: "electric_detail_energy_title" })}</h3>

          <div className="DAT_ElectricDetail_Grid_Card_EnergySection">
            <span className="DAT_ElectricDetail_Grid_Card_EnergySection_Label">{lang.formatMessage({ id: "electric_detail_total" })}</span>
            <div className="DAT_ElectricDetail_Grid_Card_EnergySection_ValueRow">
              <strong className="DAT_ElectricDetail_Grid_Card_EnergySection_ValueRow_BigNum">{detail.energy.total}</strong>
              <span className="DAT_ElectricDetail_Grid_Card_EnergySection_ValueRow_Unit">kWh</span>
            </div>
          </div>

          <div className="DAT_ElectricDetail_Grid_Card_Divider" />

          <div className="DAT_ElectricDetail_Grid_Card_EnergySection">
            <span className="DAT_ElectricDetail_Grid_Card_EnergySection_Label">{lang.formatMessage({ id: "electric_detail_today" })}</span>
            <div className="DAT_ElectricDetail_Grid_Card_EnergySection_ValueRow">
              <strong className="DAT_ElectricDetail_Grid_Card_EnergySection_ValueRow_MidNum">{detail.energy.today}</strong>
              <span className="DAT_ElectricDetail_Grid_Card_EnergySection_ValueRow_Unit">kWh</span>
            </div>
          </div>

          <div className="DAT_ElectricDetail_Grid_Card_Divider" />

          <div className="DAT_ElectricDetail_Grid_Card_EnergySection">
            <span className="DAT_ElectricDetail_Grid_Card_EnergySection_Label">{lang.formatMessage({ id: "electric_detail_month" })}</span>
            <div className="DAT_ElectricDetail_Grid_Card_EnergySection_ValueRow">
              <strong className="DAT_ElectricDetail_Grid_Card_EnergySection_ValueRow_MidNum">{detail.energy.month}</strong>
              <span className="DAT_ElectricDetail_Grid_Card_EnergySection_ValueRow_Unit">kWh</span>
            </div>
          </div>
        </section>

        {/* Card 2: 3 Khối Công suất */}
        <div className="DAT_ElectricDetail_Grid_PowersCol">
          {detail.powers.map((p, idx) => (
            <section key={idx} className="DAT_ElectricDetail_Grid_PowersCol_PowerCard">
              <h3 className="DAT_ElectricDetail_Grid_PowersCol_PowerCard_TitleCyan">
                {lang.formatMessage({
                  id:
                    p.label === "Công suất tiêu thụ"
                      ? "electric_detail_consumed_power"
                      : p.label === "reactivePower"
                      ? "electric_detail_reactive_power"
                      : "electric_detail_apparent_power",
                })}
              </h3>
              <div className="DAT_ElectricDetail_Grid_PowersCol_PowerCard_ValueRow">
                <strong className="DAT_ElectricDetail_Grid_PowersCol_PowerCard_ValueRow_BigNum">{p.value}</strong>
                <span className="DAT_ElectricDetail_Grid_PowersCol_PowerCard_ValueRow_Unit">{p.unit}</span>
              </div>
            </section>
          ))}
        </div>

        {/* Card 3: ĐIỆN ÁP & DÒNG ĐIỆN 3 PHA */}
        <section className="DAT_ElectricDetail_Grid_PhaseCard">
          <h3>{lang.formatMessage({ id: "electric_detail_phase_title" })}</h3>
          <div className="DAT_ElectricDetail_Grid_PhaseCard_Header">
            <span>{lang.formatMessage({ id: "electric_detail_voltage" })}</span>
            <span>{lang.formatMessage({ id: "electric_detail_current" })}</span>
          </div>

          <div className="DAT_ElectricDetail_Grid_PhaseCard_List">
            {detail.phases.map((phase) => (
              <div key={phase.phase} className="DAT_ElectricDetail_Grid_PhaseCard_List_Item">
                <div className="DAT_ElectricDetail_Grid_PhaseCard_List_Item_BadgeCol">
                  <div className={`DAT_ElectricDetail_Grid_PhaseCard_List_Item_BadgeCol_Badge DAT_ElectricDetail_Grid_PhaseCard_List_Item_BadgeCol_Badge_${phase.color}`}>
                    {phase.phase}
                  </div>
                  <small>{phase.subLabel}</small>
                </div>

                <div className="DAT_ElectricDetail_Grid_PhaseCard_List_Item_MetricCol">
                  <div className="DAT_ElectricDetail_Grid_PhaseCard_List_Item_MetricCol_Val">
                    <strong>{phase.voltage}</strong>
                    <span>V</span>
                  </div>
                  <div className={`DAT_ElectricDetail_Grid_PhaseCard_List_Item_MetricCol_Bar DAT_ElectricDetail_Grid_PhaseCard_List_Item_MetricCol_Bar_${phase.color}`} />
                </div>

                <div className="DAT_ElectricDetail_Grid_PhaseCard_List_Item_MetricCol">
                  <div className="DAT_ElectricDetail_Grid_PhaseCard_List_Item_MetricCol_Val">
                    <strong>{phase.current}</strong>
                    <span>A</span>
                  </div>
                  <div className="DAT_ElectricDetail_Grid_PhaseCard_List_Item_MetricCol_Bar DAT_ElectricDetail_Grid_PhaseCard_List_Item_MetricCol_Bar_orange" />
                </div>
              </div>
            ))}
          </div>

          <div className="DAT_ElectricDetail_Grid_PhaseCard_Legend">
            <span className="dot dot-purple"></span>
            <label>{lang.formatMessage({ id: "electric_detail_voltage_legend" })}</label>
            <span className="dot dot-orange"></span>
            <label>{lang.formatMessage({ id: "electric_detail_current_legend" })}</label>
          </div>
        </section>

        {/* Card 4: CHẤT LƯỢNG ĐIỆN NĂNG */}
        <section className="DAT_ElectricDetail_Grid_PhaseCard">
          <h3>{lang.formatMessage({ id: "electric_detail_quality_title" })}</h3>
          <div className="DAT_ElectricDetail_Grid_PhaseCard_Header">
            <span>THDv (%)</span>
            <span>THDi (%)</span>
          </div>

          <div className="DAT_ElectricDetail_Grid_PhaseCard_List">
            {detail.quality.map((phase) => (
              <div key={phase.phase} className="DAT_ElectricDetail_Grid_PhaseCard_List_Item">
                <div className="DAT_ElectricDetail_Grid_PhaseCard_List_Item_BadgeCol">
                  <div className={`DAT_ElectricDetail_Grid_PhaseCard_List_Item_BadgeCol_Badge DAT_ElectricDetail_Grid_PhaseCard_List_Item_BadgeCol_Badge_${phase.color}`}>
                    {phase.phase}
                  </div>
                  <small>{phase.subLabel}</small>
                </div>

                <div className="DAT_ElectricDetail_Grid_PhaseCard_List_Item_MetricCol">
                  <div className="DAT_ElectricDetail_Grid_PhaseCard_List_Item_MetricCol_Val">
                    <strong>{phase.thdv}</strong>
                    <span>%</span>
                  </div>
                  <div className="DAT_ElectricDetail_Grid_PhaseCard_List_Item_MetricCol_Bar DAT_ElectricDetail_Grid_PhaseCard_List_Item_MetricCol_Bar_purple" />
                </div>

                <div className="DAT_ElectricDetail_Grid_PhaseCard_List_Item_MetricCol">
                  <div className="DAT_ElectricDetail_Grid_PhaseCard_List_Item_MetricCol_Val">
                    <strong>{phase.thdi}</strong>
                    <span>%</span>
                  </div>
                  <div className="DAT_ElectricDetail_Grid_PhaseCard_List_Item_MetricCol_Bar DAT_ElectricDetail_Grid_PhaseCard_List_Item_MetricCol_Bar_orange" />
                </div>
              </div>
            ))}
          </div>

          <div className="DAT_ElectricDetail_Grid_PhaseCard_Legend">
            <span className="dot dot-purple"></span>
            <label>THDv</label>
            <span className="dot dot-orange"></span>
            <label>THDi</label>
          </div>
        </section>
      </div>

      {/* Chart Section */}
      <section className="DAT_ElectricDetail_ChartCard">
        <h3 className="DAT_ElectricDetail_ChartCard_Title">{lang.formatMessage({ id: "electric_detail_chart_title" })}</h3>
        <p className="DAT_ElectricDetail_ChartCard_Sub">{lang.formatMessage({ id: "electric_detail_chart_subtitle" })}</p>
        <div className="DAT_ElectricDetail_ChartCard_Wrap">
          <Line data={chartData} options={chartOptions} />
        </div>
      </section>
    </div>
  );
}
