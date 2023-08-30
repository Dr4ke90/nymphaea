import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useLocation } from "react-router";
import TableDisplay from "../../components/table-display/TableDisplay";
import { Button } from "@mui/material";
import "./customers.css";
import FromCustomer from "./FormClienti/FormCustomer";

export default function Customers() {
  const thead = ["cod", "nume", "prenume", "telefon"];
  const employees = useSelector((state) => state.servicii);
  const location = useLocation();
  const title =
    location.pathname.substring(1, 2).toUpperCase() +
    location.pathname.substring(1).slice(1);

  const [modal, setModal] = useState(false);

  const toggeleModal = () => {
    setModal(!modal);
  };

  return (
    <div className="customers-page">
      <div className="title">
        <Button variant="outlined" onClick={toggeleModal}>
          Adauga
        </Button>
        <h2>{title}</h2>
      </div>
      {modal && <FromCustomer closeModal={toggeleModal} />}
      <TableDisplay thead={thead} tbody={employees} removeItem={null} />
    </div>
  );
}
