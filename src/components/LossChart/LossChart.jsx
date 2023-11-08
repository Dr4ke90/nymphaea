import React from "react";
import { PieChart, Pie, Tooltip } from "recharts";



const LossChart = () => {

  return (
    <div className="chart-box">
      <input type="text" value="Pierderi" disabled />
      <PieChart width={210} height={210}>
        <Pie
          dataKey="value"
        //   data={data}
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

export default LossChart;
