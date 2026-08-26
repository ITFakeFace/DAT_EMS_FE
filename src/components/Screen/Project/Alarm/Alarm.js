import React from "react";
import { useIntl } from "react-intl";
import "./Alarm.scss";
import { LuChevronLeft } from "react-icons/lu";
import { useNavigate } from "react-router-dom";
export default function Alarm() {
  const lang = useIntl();
  const navigate = useNavigate();

  return (
    <div className="DAT_Alarm">
      <div className="DAT_Alarm_Header">
        <button
          className="DAT_Alarm_Header_BackBtn"
          onClick={() => navigate("/dashboard")}
        >
          <LuChevronLeft />
        </button>
        <div className={`DAT_Alarm_Header_Name`}>
          {lang.formatMessage({ id: "alarm_report_header" })}
        </div>
      </div>
      <div className="DAT_Alarm_Body">
        <div className="DAT_Alarm_Body_ND">
          <div className="DAT_Alarm_Body_ND_Header">
            <div className="DAT_Alarm_Body_ND_Header_Word">
              <p>{lang.formatMessage({ id: "alarm_report_title" })}</p>
              <span>{lang.formatMessage({ id: "alarm_report_subtitle" })}</span>
            </div>
            <div className="DAT_Alarm_Body_ND_Header_Button">
              <button className="DAT_Alarm_Body_ND_Header_Button_Pdf">
                {lang.formatMessage({ id: "alarm_report_pdf" })}
              </button>
              <button className="DAT_Alarm_Body_ND_Header_Button_Excel">
                {lang.formatMessage({ id: "alarm_report_excel" })}
              </button>
            </div>
          </div>
          <div className="DAT_Alarm_Body_ND_Main">
            <div className="DAT_Alarm_Body_ND_Main_Total">
              <p>{lang.formatMessage({ id: "alarm_report_total_energy" })}</p>
              <span>103,9 kWh</span>
            </div>
            <div className="DAT_Alarm_Body_ND_Main_Consume">
              <p>{lang.formatMessage({ id: "alarm_report_total_cost" })}</p>
              <span>256.1 M VNĐ</span>
            </div>
            <div className="DAT_Alarm_Body_ND_Main_CO2">
              <p>{lang.formatMessage({ id: "alarm_report_co2" })}</p>
              <span>831,0 t</span>
            </div>
            <div className="DAT_Alarm_Body_ND_Main_Fail">
              <p>{lang.formatMessage({ id: "alarm_report_device_fail" })}</p>
              <span>5 / 57</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
