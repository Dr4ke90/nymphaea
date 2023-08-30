import React from "react";
import Tbody from "../t-body/TableBody";
import Thead from "../t-head/TableHead";
import "./table-display.css";
import { useState, useEffect } from "react";
import Table from "../Table/Table";

const TableDisplay = ({ thead, tbody, removeItem }) => {
  const [filteredItems, setFilteredItems] = useState(null);

  useEffect(() => {
    setFilteredItems(tbody);
  }, [tbody]);

  const handleSearchChange = (event) => {
    const { name, value } = event.target;
    const lowercaseValue = value.toLowerCase();
    let filteredResults = [];

    if (name === "creat" || name === "predator" || name === "primitor") {
      filteredResults = tbody.filter((item) => {
        const itemValues = Object.values(item[name]);
        return itemValues.some((itemValue) =>
          itemValue.toLowerCase().includes(lowercaseValue)
        );
      });
    } else {
      filteredResults = tbody.filter((item) => {
        const itemValue = item[name];
        if (typeof itemValue === "number") {
          const stringValue = itemValue.toString().toLowerCase();
          return stringValue.includes(lowercaseValue);
        } else if (typeof itemValue === "string") {
          return itemValue.toLowerCase().includes(lowercaseValue);
        }
        return false;
      });
    }
    setFilteredItems(filteredResults);
  };

  return (
    <div className="table-display-container">
      <Table className="table-display">
        <Thead thead={thead} handleChange={handleSearchChange} />
        <Tbody tbody={filteredItems} removeItem={removeItem} />
      </Table>
    </div>
  );
};

export default TableDisplay;
