import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

const InvoicesChart = ({ invoices }) => {
  console.log(invoices);

  const totalInventar = invoices.reduce((acc, invoice) => {
    return invoice.tip.toLowerCase() === "inventar"
      ? acc + parseFloat(invoice.total)
      : acc;
  }, 0);

  const totalProtocol = invoices.reduce((acc, invoice) => {
    return invoice.tip.toLowerCase() === "protocol"
      ? acc + parseFloat(invoice.total)
      : acc;
  }, 0);

  const totalUtilitati = invoices.reduce((acc, invoice) => {
    return invoice.tip.toLowerCase() === "utilitati"
      ? acc + parseFloat(invoice.total)
      : acc;
  }, 0);

  const totalChirie = invoices.reduce((acc, invoice) => {
    return invoice.tip.toLowerCase() === "chirie"
      ? acc + parseFloat(invoice.total)
      : acc;
  }, 0);

  const totalSalarii = invoices.reduce((acc, invoice) => {
    return invoice.tip.toLowerCase() === "salarii"
      ? acc + parseFloat(invoice.total)
      : acc;
  }, 0);

  const totalGeneral = invoices.reduce((acc, invoice) => {
    return acc + parseFloat(invoice.total);
  }, 0);

  const data = [
    { name: "Inventar", value: totalInventar, fill: "#69DDFF" },
    { name: "Protocol", value: totalProtocol, fill: "#DBBADD" },
    { name: "Utilități", value: totalUtilitati, fill: "#4661BB" },
    { name: "Chirie", value: totalChirie, fill: "#41A336" },
    { name: "Salarii", value: totalSalarii, fill: "#E8CB0D" },
  ];

  return (
    <div className="chart-box">
      <input type="text" value="Cheltuieli" disabled />
      <BarChart width={400} height={200} data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis domain={[0, totalGeneral]} />
        <Tooltip />
        <Bar dataKey="value" />
      </BarChart>
    </div>
  );
};

export default InvoicesChart;
