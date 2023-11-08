import React from "react";
import { Menu } from "antd";
import { FiBookOpen, FiEdit3 } from "react-icons/fi";
import { GiCancel } from "react-icons/gi";
import { FaFlagCheckered } from "react-icons/fa";
import { useLocation } from "react-router";

const ContextMenu = ({ item, editItem, cancelItem, finishItem }) => {
  const location = useLocation();

  const handleEditItem = () => {
    if (item === null) return;
    editItem(item);
  };

  const handleAnuleaza = () => {
    if (item === null) return;
    cancelItem(item);
  };

  const handleFinish = () => {
    if (item === null) return;
    finishItem(item);
  };

  const renderMenu = () => {
    return (
      <Menu>
        <Menu.Item key="detalii" icon={<FiBookOpen />}>
          Mai mult
        </Menu.Item>

        {(!location.pathname.includes("incasari") && !location.pathname.includes("cheltuieli"))  && (
          <Menu.Item key="edit" onClick={handleEditItem} icon={<FiEdit3 />}>
            Edit
          </Menu.Item>
        )}

        {location.pathname.includes("programari") && (
          <div>
            <Menu.Item
              key="cancel"
              onClick={handleAnuleaza}
              icon={<GiCancel />}
            >
              Anuleaza
            </Menu.Item>

            <Menu.Item
              key="finish"
              onClick={handleFinish}
              icon={<FaFlagCheckered />}
            >
              Termina
            </Menu.Item>
          </div>
        )}
      </Menu>
    );
  };

  return <>{renderMenu()}</>;
};

export default ContextMenu;
