import React from "react";
import { Menu } from "antd";
import { FiBookOpen, FiEdit3 } from "react-icons/fi";

const ContextMenu = ({ item, editItem }) => {
  const handleEditItem = () => {
    if (item === null) return;
    editItem(item);
  };

  const renderMenu = () => {
    return (
      <Menu>
        <Menu.Item key="detalii" icon={<FiBookOpen />}>
          Mai mult
        </Menu.Item>

        <Menu.Item key="edit" onClick={handleEditItem} icon={<FiEdit3 />}>
          Edit
        </Menu.Item>
      </Menu>
    );
  };

  return <>{renderMenu()}</>;
};

export default ContextMenu;
