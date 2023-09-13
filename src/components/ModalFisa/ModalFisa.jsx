import React, { useState } from "react";
import Keyboard from "../../components/Keyboard/Keyboard";
import "./modalFisa.css";
import { Button } from "@mui/material";
import TableDisplay from "../table-display/TableDisplay";
import ModalController from "../ModalController/ModalController";

export default function ModalFisa({closeModal}) {
  const thead = ["nr", "serviciu", "cantitate", "#"];

  const initialStateFisa = {
    cod: "",
    client: "",
    angajat: "",
    numeClient: "",
    serviciu: "",
    cantitate: "",
  };

  const [dateFisa, setDateFisa] = useState(initialStateFisa);

  const handleChangeFisa = (e) => {
    e.preventDefault();
    const { name, value } = e.target;

    setDateFisa({
      ...dateFisa,
      [name]: value,
    });
  };

  return (
    <div className="modal-fisa-overlay">
      <div className="modal-fisa-content">
        <div className="modal-fisa-container">
          <TableDisplay thead={thead} tbody={[]} />
          <div className="buttons-wrapper">
            <div className="modal-controller">
              <Button variant="contained" color="info">
                Servicii
              </Button>
              <Button variant="contained" color="info">
                Produse
              </Button>
            </div>
            <Keyboard />
          </div>
        </div>
        <ModalController state={dateFisa} closeModal={closeModal} inregistreaza={null}/> 
      </div>
    </div>
  );
}
