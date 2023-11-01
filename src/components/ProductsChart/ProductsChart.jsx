import React from "react";
import { PieChart, Pie, Tooltip } from "recharts";

const ProductsChart = ({ produse }) => {
  const stoc1 = produse.reduce((acc, product) => {
    return product.stoc > 0 ? acc + 1 : acc;
  }, 0);

  const stoc0 = produse.reduce((acc, product) => {
    return product.stoc === 0 ? acc + 1 : acc;
  }, 0);

  const valoareStoc = produse.reduce((acc, produs) => {
    const valoareProdus = produs.stoc * produs.pret;
    return parseFloat(acc + valoareProdus).toFixed(2);
  }, 0);

  const data = [
    { name: "Total", value: produse.length, fill: "#8884d8" },
    { name: "Stoc 0", value: stoc0, fill: "#b83fae" },
    { name: "Stoc > 0", value: stoc1, fill: "#82ca9d" },
  ];

  return (
    <div className="chart-box">
      <input type="text" value={`Valoare produse : ${valoareStoc} RON`} disabled/>
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

export default ProductsChart;
