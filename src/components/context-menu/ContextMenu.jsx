import React from "react";
import { Menu } from "antd";
import { FiBookOpen, FiEdit3 } from "react-icons/fi";

const ContextMenu = ({ item, editItem, cancelItem, finishItem }) => {


  const handleEditItem = () => {
    if (item === null) return;
    editItem(item)
  };

  const handleAnuleaza = () => {
    if (item === null) return;
    cancelItem(item)
  };

  const handleFinish = () => {
    if (item === null) return;
    finishItem(item)
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

        <Menu.Item key="cancel" onClick={handleAnuleaza} icon={<FiEdit3 />}>
          Anuleaza
        </Menu.Item>

        <Menu.Item key="finish" onClick={handleFinish} icon={<FiEdit3 />}>
          Termina
        </Menu.Item>
      </Menu>
    );
  };

  return <>{renderMenu()}</>;
};

export default ContextMenu;
