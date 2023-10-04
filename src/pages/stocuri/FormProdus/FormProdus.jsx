import React, { useState, useEffect } from "react";
import "./formProdus.css";
import Input from "../../../components/Input/Input";
import Form from "../../../components/Formular/Form";
import { useDispatch } from "react-redux";
import { addProduct, updateInventory } from "../../../redux/slices/inventorySlice";
import PagePreview from "../../../components/PagePreview/PagePreview";
import { Button } from "@mui/material";

export default function FormProdus({ cod, closeModal, item, setItem }) {
  const initialState = {
    cod: cod,
    categorie: "",
    brand: "",
    descriere: "",
    gramaj: "",
    pretFaraTva: 0.00,
    pret: 0.00,
    pretAchizitie: 0.00,
    stoc: 0,
    stocInGr: 0,
  };

  const [produs, setProdus] = useState(initialState);

  useEffect(() => {
    if (item !== null) {
      setProdus(item);
    }
  }, [item]);

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
          updatedProdus.pret = (parseFloat(value) * 1.19).toFixed(2);
        } else {
          updatedProdus.pret = 0.00;
        }
      }

      return updatedProdus;
    });
  };

  const handleCloseModal = () => {
    setProdus(initialState);
    setItem(null);
    closeModal();
  };

  const dispatch = useDispatch();
  const handleInregistreaza = () => {
    dispatch(addProduct(produs));
    handleCloseModal();
  };

  const handleUpdateProduct = () => {
    dispatch(updateInventory(produs));
    handleCloseModal();
  };

  const inputOrder = ["cod", "categorie", "brand", "descriere", "gramaj"];

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
                disabled={key === "cod" || key === "pret"}
                placeholder={key}
              />
            );
          })}
        </Form>
        <PagePreview className="buttons-wrapper">
          <Button variant="contained" color="info" onClick={handleCloseModal}>
            Close
          </Button>
          <Button
            variant="contained"
            color="success"
            onClick={item !== null ? handleUpdateProduct : handleInregistreaza}
            disabled={Object.values(produs).some(
              (value) => typeof value === "string" && value.trim() === ""
            )}
          >
            {item !== null ? "Update" : "Adauga"}
          </Button>
        </PagePreview>
      </div>
    </div>
  );
}
