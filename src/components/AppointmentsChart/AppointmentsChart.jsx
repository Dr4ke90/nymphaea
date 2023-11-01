import React from "react";
import { PieChart, Pie, Tooltip } from "recharts";

const AppointmentsChart = ({ appointments }) => {
  const totalActives = appointments.reduce((acc, app) => {
    return app.status.toLowerCase() === "activ" ? acc + 1 : acc;
  }, 0);

  const totalFinished = appointments.reduce((acc, app) => {
    return app.status.toLowerCase() === "terminat" ? acc + 1 : acc;
  }, 0);

  const totalCanceled = appointments.reduce((acc, app) => {
    return app.status.toLowerCase() === "anulat" ? acc + 1 : acc;
  }, 0);

  let totalGeneral = appointments.length;

  const data = [
    { name: "Activ", value: totalActives, fill: "#b0a8b9" },
    { name: "Terminat", value: totalFinished, fill: "#c34a36" },
    { name: "Anulat", value: totalCanceled, fill: "#845ec2" },
    { name: "Total", value: totalGeneral, fill: "#008f7a" },
  ];

  return (
    <div className="chart-box">
      <input type="text" value="Programari" disabled />
      <PieChart width={250} height={230}>
        <Pie
          dataKey="value"
          data={data}
          cx={100}
          cy={100}
          outerRadius={70}
          fill="#8884d8"
          label
        />
        <Tooltip />
      </PieChart>
    </div>
  );
};

export default AppointmentsChart;
