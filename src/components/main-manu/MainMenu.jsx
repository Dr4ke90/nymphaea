import React from "react";
import "./MainMenu.css";
import CustomButton from "../Button/CustomButton";
import Stack from "@mui/material/Stack";

export default function MainMenu() {
  const MAIN_MENU = [
    "dashboard",
    "casa",
    "angajati",
    "servicii",
    "stocuri",
    "clienti",
    "programari",
    "incasari",
    "cheltuieli",
    'comenzi',
    'notificari'
  ];

  return (
    <div className="main-menu">
      <Stack spacing={1} direction="column">
        {MAIN_MENU.map((name) => {
          return <CustomButton key={name} className={name} name={name}/>;
        })}
      </Stack>
    </div>
  );
}
