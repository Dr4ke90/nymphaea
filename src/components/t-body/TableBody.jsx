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
} from "react-icons/fa";

const Tbody = ({ tbody, removeItem, editItem, cancel, finish, start }) => {
  const [selectedRow, setSelectedRow] = useState(null);
  const location = useLocation();
  const [tableBody, setTableBody] = useState([]);

  useEffect(() => {
    if (tbody === null) return;

    if (tbody.produse) {
      setTableBody(tbody.produse);
    } else {
      setTableBody(tbody);
    }
  }, [tbody]);

  const handleSelectRow = (id) => {
    setSelectedRow(id);
  };

  const handleContextMenu = (e, id) => {
    e.preventDefault();
    setSelectedRow(id);
  };

  const handlePathname = (name) => {
    const pathname = location.pathname;
    if (pathname.includes(name)) {
      return true;
    }
  };

  const handleControllAppointments = (item) => {
    if (item.status === "Activ") {
      return cancel(item);
    }
    if (item.status === "Anulat" || item.status === "Terminat") {
      return removeItem(item);
    }
    if (item.status === "In curs") {
      return finish(item);
    }
  };

  const handleChangeButton = (item) => {
    if (item.status === "Activ") {
      return (
        <FaRegCalendarTimes
          size={27}
          onClick={() => handleControllAppointments(item)}
          title={handleChangeTitle(item)}
        />
      );
    }
    if (item.status === "Anulat" || item.status === "Terminat") {
      return (
        <FaTrashAlt
          size={27}
          onClick={() => handleControllAppointments(item)}
          title={handleChangeTitle(item)}
        />
      );
    }
    if (item.status === "In curs") {
      return (
        <FaFlag
          size={27}
          onClick={() => handleControllAppointments(item)}
          title={handleChangeTitle(item)}
        />
      );
    }
  };

  const handleChangeTitle = (item) => {
    if (item.status === "Activ") {
      return "Anuleaza";
    }
    if (item.status === "Anulat" || item.status === "Terminat") {
      return "Sterge";
    }
    if (item.status === "In curs") {
      return "Incaseaza";
    }
  };

  if (tableBody !== undefined && tableBody !== null) {
    return (
      <tbody>
        {tableBody.map((item, index) => (
          <Dropdown
            overlay={
              <ContextMenu
                item={item}
                editItem={editItem}
                removeItem={removeItem}
              />
            }
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
                  key !== "data_creat" &&
                  key !== "data_update" &&
                  key !== "ora_creat" &&
                  key !== "ora_update" &&
                  key !== "tip_update" &&
                  key !== "cnp" &&
                  key !== "fise" &&
                  key !== "inceput" &&
                  key !== "terminat" &&
                  key !== "programari" &&
                  key !== "tva" &&
                  key !== "valoare" &&
                  key !== "vendor" &&
                  key !== "numeClient" &&
                  key !== "totalP" &&
                  key !== "produse"
                ) {
                  return <td key={key}>{`${value}`}</td>;
                } else if (key === "programari" || key === "fise") {
                  return <td key={key}>{`${value.length}`}</td>;
                } else {
                  return null;
                }
              })}
              {handlePathname("programari") && (
                <td className="buttons-wrapper">
                  {handleChangeButton(item)}
                  {item.status === "Activ" ? (
                    <FaPlayCircle
                      size={27}
                      onClick={() => start(item)}
                      title="Incepe"
                    />
                  ) : (
                    <></>
                  )}
                </td>
              )}
              {handlePathname("facturi") &&
                (tbody.tip === "produse" || tbody.tip === "protocol") && (
                  <td className="trash-wreapper">
                    <FaTrashAlt size={24} onClick={() => removeItem(item.nr)} />
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
