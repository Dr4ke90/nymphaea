import React, { useState } from "react";
import "./formProdus.css";
import Input from "../../../components/Input/Input";
import ModalController from "../../../components/ModalController/ModalController";
import Form from "../../../components/Formular/Form";
import { useDispatch } from "react-redux";
import { addProduct } from "../../../redux/slices/inventorySlice";

export default function FormProdus({ cod, closeModal }) {
  const initialState = {
    cod: cod,
    categorie: "",
    brand: "",
    descriere: "",
    gramaj: "",
    pretFaraTva: "",
    pretCuTva: "",
    pretAchizitie: "",
    stoc: 0,
    stocInGr: 0,
  };

  const [produs, setProdus] = useState(initialState);

  const handleChangeProdus = (e) => {
    e.preventDefault();
    const { name, value } = e.target;

    setProdus((prevProdus) => {
      let updatedProdus = {
        ...prevProdus,
        [name]: value,
      };

      if (name === "pretFaraTva") {
        updatedProdus.pretFaraTva = value;
        if (value) {
          updatedProdus.pretCuTva = (parseFloat(value) * 1.19).toFixed(2);
        } else {
          updatedProdus.pretCuTva = "";
        }
      }

      return updatedProdus;
    });
  };

  const dispatch = useDispatch();
  const handleInregistreaza = () => {
    dispatch(addProduct(produs));
    closeModal();
  };

  const inputOrder = [
    "cod",
    "categorie",
    "brand",
    "descriere",
    "gramaj",
    "pretFaraTva",
    "pretCuTva",
    "pretAchizitie",
  ];

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <Form>
          {inputOrder.map((key) => {
            return (
              <Input
                key={key}
                id={key}
                name={key}
                value={produs[key]}
                onChange={handleChangeProdus}
                disabled={key === "cod" || key === "pretCuTva"}
                placeholder={key}
              />
            );
          })}
        </Form>
        <ModalController
          state={produs}
          closeModal={closeModal}
          inregistreaza={handleInregistreaza}
        />
      </div>
    </div>
  );
}
