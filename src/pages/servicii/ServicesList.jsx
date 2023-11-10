import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router";
import TableDisplay from "../../components/table-display/TableDisplay";
import { Button } from "@mui/material";
import "./servicesList.css";
import FormServicii from "./FormServicii/FormServicii";
import {
  deleteService,
  fetchAllServices,
} from "../../redux/slices/servicesSlice";
import ModalServiceDetails from "../../components/ModalServiceDetails/ModalServiceDetails";

export default function ServicesList() {
  const thead = ["cod", "departament", "descriere", "pret"];
  const servicii = useSelector((state) => state.servicii);
  const location = useLocation();
  const title =
    location.pathname.substring(1, 2).toUpperCase() +
    location.pathname.substring(1).slice(1);
  const [receivedService, setReceivedService] = useState(null);

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchAllServices());
  }, [dispatch]);

  let code = 0;
  const nr = servicii.length + 1;
  const paddedNr = nr.toString().padStart(3, "0");
  code = "S" + paddedNr;

  const [modal, setModal] = useState(false);
  const toggleModal = () => {
    setModal(!modal);
  };

  const [openModalServiceDetails, setOpenModalSeviceDetails] = useState(false);
  const toggleModalDetails = () => {
    setOpenModalSeviceDetails(!openModalServiceDetails);
  };

  const handleDeleteService = (item) => {
    const confirm = window.confirm(
      `Esti sigur ca vrei sa stergi Serviciul ${item.cod}`
    );
    if (!confirm) return;
    dispatch(deleteService(item));
  };

  const handleEditService = (item) => {
    if (!item.hasOwnProperty("produseDeBaza")) {
      setReceivedService({
        ...item,
        produseDeBaza: [],
      });
    } else {
      setReceivedService(item);
    }
    setModal(true);
  };

  const handleOpenServiceDetails = (item) => {
    setReceivedService(item);
    toggleModalDetails();
  };

  return (
    <div className="services-page">
      <div className="title">
        <Button variant="contained" color="info" onClick={toggleModal}>
          Adauga
        </Button>
        <h2>{title}</h2>
      </div>
      {modal && (
        <FormServicii
          closeModal={toggleModal}
          cod={code}
          item={receivedService}
          setItem={setReceivedService}
        />
      )}
      <TableDisplay
        thead={thead}
        tbody={servicii}
        removeItem={handleDeleteService}
        editItem={handleEditService}
        listOrder={thead}
        openDetails={handleOpenServiceDetails}
      />

      {openModalServiceDetails && (
        <ModalServiceDetails
          service={receivedService}
          closeModal={toggleModalDetails}
        />
      )}
    </div>
  );
}
