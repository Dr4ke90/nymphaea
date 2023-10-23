import { Dropdown } from "antd";
import React, { useEffect, useState } from "react";
import ContextMenu from "../context-menu/ContextMenu";
import { Views } from "react-big-calendar";

const EventComponent = ({ event, view }) => {
  const [item, setItem] = useState({});

  useEffect(() => {
    setItem(event);
  }, [event]);

  if (view === Views.MONTH) {
    return (
      <Dropdown
        overlay={
          <ContextMenu
            item={item}
            editItem={item.edit}
            cancelItem={item.cancel}
            finishItem={item.finish}
          />
        }
        trigger={["contextMenu"]}
      >
        <div>
          <span>{event.title}</span>
        </div>
      </Dropdown>
    );
  } else if (view === Views.DAY || view === Views.AGENDA) {
    return (
      <Dropdown
        overlay={
          <ContextMenu
            item={item}
            editItem={item.edit}
            cancelItem={item.cancel}
            finishItem={item.finish}
          />
        }
        trigger={["contextMenu"]}
      >
        <div>
          <span>{event.title}</span>
          <br />
          <span>{event.description}</span>
        </div>
      </Dropdown>
    );
  } else {
    return null;
  }
};

export default EventComponent;
