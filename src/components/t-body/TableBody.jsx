import { useLocation } from "react-router-dom";
import React, { useState } from "react";
import "./t-body.css";
import { Dropdown } from "antd";
import ContextMenu from "../context-menu/ContextMenu";
import { FiXOctagon } from "react-icons/fi";

const Tbody = ({ tbody, removeItem }) => {
  const [selectedRow, setSelectedRow] = useState(null);
  const location = useLocation();
  const pathName = location.pathname.includes("create");
  const pathDetalii = location.pathname.includes("detalii");

  const handleSelectRow = (id) => {
    if (!pathName && !pathDetalii) setSelectedRow(id);
  };

  const handleContextMenu = (e, id) => {
    e.preventDefault();
    if (!pathName && !pathDetalii) setSelectedRow(id);
  };

  const handlePathname = () => {
    const pathname = location.pathname;
    if (!pathname.includes("angajati")) {
      return false;
    }
  };

  if (tbody !== undefined && tbody !== null) {
    return (
      <tbody>
        {tbody.map((item, index) => (
          <Dropdown
            overlay={<ContextMenu item={item} removeItem={removeItem} />}
            trigger={["contextMenu"]}
            key={item._id ? item._id : index}
          >
            <tr
              className={selectedRow === item._id ? "selected" : ""}
              onClick={() => handleSelectRow(item._id)}
              onContextMenu={(e) => handleContextMenu(e, item._id)}
            >
              {Object.entries(item).map(([key, value]) => {
                if (
                  key !== "_id" &&
                  key !== "adresa" &&
                  key !== "data_nasterii" &&
                  key !== "programari"
                ) {
                  return <td key={key}>{`${value}`}</td>;
                } else if (key === "programari") {
                  return <td key={key}>{`${value.length}`}</td>;
                } else {
                  return null;
                }
              })}
              {handlePathname() && (
                <td className="icon">
                  <FiXOctagon onClick={() => removeItem(item.nr)} />
                </td>
              )}
            </tr>
          </Dropdown>
        ))}
      </tbody>
    );
  }
};

export default Tbody;
