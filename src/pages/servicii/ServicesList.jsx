import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router";
import TableDisplay from "../../components/table-display/TableDisplay";
import { Button } from "@mui/material";
import "./servicesList.css";
import FormServicii from "./FormServicii/FormServicii";
import { fetchAllServices } from "../../redux/slices/servicesSlice";

export default function ServicesList() {
  const thead = ["cod", "departament", "tip", "pret"];
  const servicii = useSelector((state) => state.servicii);
  const location = useLocation();
  const title =
    location.pathname.substring(1, 2).toUpperCase() +
    location.pathname.substring(1).slice(1);
  const [modal, setModal] = useState(false);


  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchAllServices());
  }, [dispatch]);

  let code = 0;
  if (servicii.length !== 0) {
    const nr = parseInt(servicii[servicii.length - 1].cod) + 1;
    const paddedNr = nr.toString().padStart(3, "0");
    code = paddedNr;
  } else {
    const nr = servicii.length + 1;
    const paddedNr = nr.toString().padStart(3, "0");
    code = paddedNr;
  }

  const toggleModal = () => {
    setModal(!modal);
  };

  return (
    <div className="services-page">
      <div className="title">
        <Button variant="outlined" onClick={toggleModal}>
          Adauga
        </Button>
        <h2>{title}</h2>
      </div>
      {modal && <FormServicii closeModal={toggleModal} cod={code} />}
      <TableDisplay thead={thead} tbody={servicii} removeItem={null} />
    </div>
  );
}
