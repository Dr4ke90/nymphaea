import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router";
import TableDisplay from "../../components/table-display/TableDisplay";
import { Button } from "@mui/material";
import "./customers.css";
import FromCustomer from "./FormClienti/FormCustomer";
import {
  deleteCustomer,
  fetchAllCustomers,
} from "../../redux/slices/customersSlice";

export default function Customers() {
  const thead = ["cod", "nume", "prenume", "telefon", "Data Nasterii", "fise"];
  const customers = useSelector((state) => state.clienti);
  const location = useLocation();
  const title =
    location.pathname.substring(1, 2).toUpperCase() +
    location.pathname.substring(1).slice(1);

  const [modal, setModal] = useState(false);
  const [receivedCustomer, setReceivedCustomer] = useState(null);

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchAllCustomers());
  }, [dispatch]);

  let code = 0;
  if (customers.length !== 0) {
    const nr = parseInt(customers[customers.length - 1].cod) + 1;
    const paddedNr = nr.toString().padStart(3, "0");
    code = paddedNr;
  } else {
    const nr = customers.length + 1;
    const paddedNr = nr.toString().padStart(3, "0");
    code = paddedNr;
  }

  const toggeleModal = () => {
    setModal(!modal);
  };

  const handleDeleteCustomer = (item) => {
    const confirm = window.confirm(
      `Esti sigur ca vrei sa stergi Clientul ${item.cod}`
    );
    if (!confirm) return;
    dispatch(deleteCustomer(item));
  };

  const handleEditCustomer = (item) => {
    setReceivedCustomer(item);
    setModal(true);
  };

  return (
    <div className="customers-page">
      <div className="title">
        <Button variant="outlined" onClick={toggeleModal}>
          Adauga
        </Button>
        <h2>{title}</h2>
      </div>
      {modal && (
        <FromCustomer
          closeModal={toggeleModal}
          cod={code}
          item={receivedCustomer}
          setItem={setReceivedCustomer}
        />
      )}
      <TableDisplay
        thead={thead}
        tbody={customers}
        removeItem={handleDeleteCustomer}
        editItem={handleEditCustomer}
      />
    </div>
  );
}
