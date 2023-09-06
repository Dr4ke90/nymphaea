import React from "react";
import { Menu } from "antd";
import { FiBookOpen, FiEdit3, FiXSquare } from "react-icons/fi";
import { useLocation } from "react-router";

const ContextMenu = ({ item, removeItem, editItem }) => {
  const location = useLocation();

  const handleMaiMultButton = () => {};

  const handleEditItem = () => {
    if (item === null) return;
    let tip_update = "Modificare date";
    editItem({
      ...item,
      tip_update: tip_update,
    });
  };

  const handleRemoveItem = () => {
    if (item === null) return;
    removeItem(item);
  };

  const renderMenu = () => {
    return (
      <Menu>
        <Menu.Item
          key="detalii"
          onClick={handleMaiMultButton}
          icon={<FiBookOpen />}
        >
          Mai mult
        </Menu.Item>

        <Menu.Item key="edit" onClick={handleEditItem} icon={<FiEdit3 />}>
          Edit
        </Menu.Item>
        {!location.pathname.includes('programari') && (
          <Menu.Item
            key="delete"
            onClick={handleRemoveItem}
            icon={<FiXSquare />}
          >
            Delete
          </Menu.Item>
        )}
      </Menu>
    );
  };

  return <>{renderMenu()}</>;
};

export default ContextMenu;
