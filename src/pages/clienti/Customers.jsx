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
import ModalClientProfile from "../../components/ModalClientProfile/ModalClientProfile";

export default function Customers() {
  const thead = ["cod", "nume", "prenume", "telefon", "nascut", "fise"];
  const customers = useSelector((state) => state.clienti);
  const location = useLocation();
  const title =
    location.pathname.substring(1, 2).toUpperCase() +
    location.pathname.substring(1).slice(1);

  const [modal, setModal] = useState(false);
  const [modalDetails, setModalDetails] = useState(false);
  const [receivedCustomer, setReceivedCustomer] = useState(null);

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchAllCustomers());
  }, [dispatch]);

  let code = 0;
  const nr = customers.length + 1;
  const paddedNr = nr.toString().padStart(3, "0");
  code = "C" + paddedNr;

  const closeModal = () => {
    setModal(!modal);
  };

  const closeModalDetails = () => {
    setModalDetails(!modalDetails);
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

  const handleOpenDetails = (item) => {
    setReceivedCustomer(item);
    setModalDetails(true);
  };

  return (
    <div className="customers-page">
      <div className="title">
        <Button variant="contained" color="info" onClick={closeModal}>
          Adauga
        </Button>
        <h2>{title}</h2>
      </div>
      {modal && (
        <FromCustomer
          closeModal={closeModal}
          cod={code}
          item={receivedCustomer}
          setItem={setReceivedCustomer}
        />
      )}
      {modalDetails && (
        <ModalClientProfile
          client={receivedCustomer}
          closeModal={closeModalDetails}
        />
      )}
      <TableDisplay
        thead={thead}
        tbody={customers}
        removeItem={handleDeleteCustomer}
        editItem={handleEditCustomer}
        openDetails={handleOpenDetails}
        listOrder={thead}
      />
    </div>
  );
}
