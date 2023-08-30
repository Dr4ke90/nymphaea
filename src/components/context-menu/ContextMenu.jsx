import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Menu } from "antd";
import { FiBookOpen, FiFileText, FiEdit3, FiXSquare } from "react-icons/fi";

const ContextMenu = ({ item, removeItem }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const path = location.pathname;

  const handleMaiMultButton = () => {};

  const handleEditItem = () => {
    const select = item;
    if (select === null) return;
    const route = `${location.pathname}/create-${location.pathname.substring(
      4
    )}`;
    navigate(route, { state: select });
  };

  const handleDisablePrint = () => {};

  const handleRemoveItem = () => {
    const confirm = window.confirm("Esti sigur ca vrei sa stergi echipamentul");
    if (!confirm) return;
    removeItem(item);
  };

  const renderMenu = () => {
    if (!path.includes("create") && !path.includes("detalii")) {
      return (
        <Menu>
          <Menu.Item
            key="detalii"
            onClick={handleMaiMultButton}
            icon={<FiBookOpen />}
          >
            Mai mult
          </Menu.Item>
          {!path.includes("echipament") ? (
            <Menu.Item key="edit" onClick={handleEditItem} icon={<FiEdit3 />}>
              Edit
            </Menu.Item>
          ) : (
            <></>
          )}
          <Menu.Item
            key="delete"
            onClick={handleRemoveItem}
            icon={<FiXSquare />}
          >
            Delete
          </Menu.Item>
        </Menu>
      );
    } else {
      return null;
    }
  };

  return <>{renderMenu()}</>;
};

export default ContextMenu;
