import { useLocation } from "react-router-dom";
import React, { useEffect, useState } from "react";
import "./t-body.css";
import { Dropdown } from "antd";
import ContextMenu from "../context-menu/ContextMenu";
import {
  FaRegCalendarTimes,
  FaPlayCircle,
  FaTrashAlt,
  FaFlag,
  FaSlidersH,
} from "react-icons/fa";
import FormAppointment from "../../pages/programari/FormAppointments/FormAppointments";

const Tbody = ({
  tbody,
  removeItem,
  editItem,
  cancel,
  finish,
  start,
  openDetails,
  listOrder,
}) => {
  const [selectedRow, setSelectedRow] = useState(null);
  const location = useLocation();
  const [tableBody, setTableBody] = useState([]);
  const [currentItem, setCurrentItem] = useState({});

  useEffect(() => {
    const reversedTableBody = [...tbody].reverse();
    setTableBody(reversedTableBody);
  }, [tbody]);

  const handleSelectRow = (cod) => {
    setSelectedRow(cod);
  };

  const handleContextMenu = (e, cod) => {
    e.preventDefault();
    setSelectedRow(cod);
  };

  const [openFormAppointment, setOpenFormAppointment] = useState(false);

  const toggleOpenFormAppointment = (item) => {
    if (item) {
      setCurrentItem(item);
    }
    setOpenFormAppointment(!openFormAppointment);
  };

  const handleChangeButton = (item) => {
    if (item.status === "Activ") {
      return (
        <div
          className="active"
          style={{
            display: "flex",
            justifyContent: "space-around",
          }}
        >
          <FaRegCalendarTimes
            size={16}
            onClick={() => cancel(item)}
            title="Anuleaza"
            style={{ cursor: "pointer" }}
          />
          <FaPlayCircle
            size={16}
            onClick={() => start(item)}
            title="Incepe"
            style={{ cursor: "pointer" }}
          />
        </div>
      );
    }

    if (location.pathname.includes("cheltuieli")) {
      return (
        <div
          style={{
            display: "flex",
            justifyContent: "space-around",
          }}
        >
          <FaTrashAlt
            size={16}
            onClick={() => removeItem(item)}
            style={{ cursor: "pointer" }}
          />
        </div>
      );
    }

    if (item.status === "In curs") {
      return (
        <div
          style={{
            display: "flex",
            justifyContent: "space-around",
          }}
        >
          <FaFlag
            size={16}
            onClick={() => finish(item)}
            title="Finalizeaza"
            style={{ cursor: "pointer" }}
          />
        </div>
      );
    }

    if (item.status === "Anulat") {
      return (
        <div
          style={{
            display: "flex",
            justifyContent: "space-around",
          }}
        >
          <FaSlidersH
            size={16}
            style={{ cursor: "pointer" }}
            onClick={() => toggleOpenFormAppointment(item)}
          />
          {openFormAppointment && (
            <FormAppointment
              closeModal={toggleOpenFormAppointment}
              item={currentItem}
              setItem={setCurrentItem}
            />
          )}
        </div>
      );
    }

    if (item.status === "Terminat") {
      return <span>{`${item.inceput} / ${item.terminat}`}</span>;
    }
  };

  if (tableBody !== undefined && tableBody !== null) {
    return (
      <tbody>
        {tableBody?.map((item, index) => (
          <Dropdown
            overlay={
              <ContextMenu
                item={item}
                editItem={editItem}
                removeItem={removeItem}
                openDetails={openDetails}
              />
            }
            trigger={["contextMenu"]}
            key={item._id ? item._id : index}
          >
            <tr
              className={
                selectedRow === (item.cod ? item.cod : item.nr)
                  ? "selected"
                  : ""
              }
              onClick={() => handleSelectRow(item.cod ? item.cod : item.nr)}
              onContextMenu={(e) =>
                handleContextMenu(e, item.cod ? item.cod : item.nr)
              }
            >
              {listOrder?.map((key) => {
                if (
                  key === "produse" ||
                  key === "programari" ||
                  key === "fise"
                ) {
                  return (
                    <td key={key} id={key}>
                      {item[key].length}
                    </td>
                  );
                } else if (key === "#") {
                  return (
                    <td className="buttons-wrapper" key={key}>
                      {handleChangeButton(item)}
                    </td>
                  );
                } else {
                  return (
                    <td key={key} id={key}>
                      {item[key]}
                    </td>
                  );
                }
              })}
            </tr>
          </Dropdown>
        ))}
      </tbody>
    );
  }
};

export default Tbody;
