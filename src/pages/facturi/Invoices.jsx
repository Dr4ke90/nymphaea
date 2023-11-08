import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router";
import TableDisplay from "../../components/table-display/TableDisplay";
import { Button } from "@mui/material";
import "./invoices.css";
import FormFactura from "./FormFacturi/FormFacturi";
import { fetchAllInvoices } from "../../redux/slices/invoicesSlice";
import { fetchAllInventory } from "../../redux/slices/inventorySlice";
import { fetchAllEquipment } from "../../redux/slices/echipamentSlice";

export default function Invoices() {
  const thead = ["cod", "tip", "data", "serie", "numar", "total", "produse"];
  const inventory = useSelector((state) => state.stocuri);
  const equipment = useSelector((state) => state.echipament);
  const invoices = useSelector((state) => state.facturi);
  const location = useLocation();
  const title =
    location.pathname.substring(1, 2).toUpperCase() +
    location.pathname.substring(1).slice(1);
  const [modal, setModal] = useState(false);

  let codFacturi = 0;
  const nr = invoices.length + 1;
  const paddedNr = nr.toString().padStart(4, "0");
  codFacturi = "F" + paddedNr;

  let codProdus = 0;
  const nrProd = inventory.length + 1;
  const paddedNrProd = nrProd.toString().padStart(4, "0");
  codProdus = "P" + paddedNrProd;

  let codEquip = 0;
  const nrEquip = equipment.length + 1;
  const paddedNrEquip = nrEquip.toString().padStart(4, "0");
  codEquip = "EQ" + paddedNrEquip;

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchAllInvoices());
    dispatch(fetchAllInventory());
    dispatch(fetchAllEquipment());
  }, [dispatch]);

  const toggleModal = () => {
    setModal(!modal);
  };

  return (
    <div className="invoices-page">
      <div className="title">
        <Button variant="contained" color="info" onClick={toggleModal}>
          Adauga
        </Button>
        <h2>{title}</h2>
      </div>
      {modal && (
        <FormFactura
          closeModal={toggleModal}
          invoices={invoices}
          codFacturi={codFacturi}
          codProdus={codProdus}
          codEquip={codEquip}
        />
      )}
      <TableDisplay thead={thead} tbody={invoices} listOrder={thead} />
    </div>
  );
}
