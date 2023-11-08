import React from "react";
import { PieChart, Pie, Tooltip } from "recharts";

const InventoryChart = ({ servicii, produse, echipament }) => {
  const totalServicii = servicii.length;

  const totalProduse = produse.length;

  const totalEchipament = echipament.length;

  const data = [
    { name: "Servicii", value: totalServicii, fill: "#d5cabd" },
    { name: "Produse", value: totalProduse, fill: "#4ffbdf" },
    { name: "Echipament", value: totalEchipament, fill: "#4b4453" },
  ];

  return (
    <div className="chart-box">
      <input type="text" value="Stocuri" disabled />
      <PieChart width={210} height={210}>
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

export default InventoryChart;
