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

const Tbody = ({
  tbody,
  removeItem,
  editItem,
  cancel,
  finish,
  start,
  listOrder,
}) => {
  const [selectedRow, setSelectedRow] = useState(null);
  const location = useLocation();
  const [tableBody, setTableBody] = useState([]);

  useEffect(() => {
    setTableBody(tbody);
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
          size={16}
          onClick={() => handleControllAppointments(item)}
          title={handleChangeTitle(item)}
        />
      );
    }
    if (item.status === "Anulat" || item.status === "Terminat") {
      return (
        <FaTrashAlt
          size={16}
          onClick={() => handleControllAppointments(item)}
          title={handleChangeTitle(item)}
        />
      );
    }
    if (item.status === "In curs") {
      return (
        <FaFlag
          size={16}
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

  console.log(tableBody);

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
                      {item.status === "Activ" ? (
                        <FaPlayCircle
                          size={16}
                          onClick={() => start(item)}
                          title="Incepe"
                        />
                      ) : (
                        <></>
                      )}
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
