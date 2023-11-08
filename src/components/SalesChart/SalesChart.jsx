import React from "react";
import { PieChart, Pie, Tooltip } from "recharts";

const SalesChart = (props) => {


  const totalCard = props.sales.reduce((acc, sale) => {
    return sale.tipPlata.toLowerCase() === "card"
      ? acc + parseFloat(sale.totalDePlata)
      : acc;
  }, 0);

  const totalCash = props.sales.reduce((acc, sale) => {
    return sale.tipPlata.toLowerCase() === "cash"
      ? acc + parseFloat(sale.totalDePlata)
      : acc;
  }, 0);

  const totalGeneral = props.sales.reduce((acc, sale) => {
    return acc + parseFloat(sale.totalDePlata);
  }, 0);

  const data = [
    { name: "Card", value: totalCard, fill: "#8884d8" },
    { name: "Cash", value: totalCash, fill: "#82ca9d" },
    { name: "Total", value: totalGeneral, fill: "#ffc658" },
  ];

  return (
    <div className="chart-box">
      <input type="text" value="Incasari" disabled />
      <PieChart width={230} height={210}>
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


export default SalesChart;
