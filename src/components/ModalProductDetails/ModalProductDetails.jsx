import React, { useEffect, useState } from "react";
import PagePreview from "../PagePreview/PagePreview";
import "./modalProductDetails.css";
import Input from "../Input/Input";
import { Button } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllInventory } from "../../redux/slices/inventorySlice";

const ModalProductDetails = ({ product, closeModal }) => {
  const column1 = ["cod", "categorie", "brand", "descriere", "gramaj", "stoc"];

  const column2 = ["pretFaraTva", "pret", "discount", "pretAchizitie"];

  const products = useSelector((state) => state.stocuri);

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchAllInventory());
  }, [dispatch]);

  useEffect(() => {
    getProduct();
  }, [product]);

  const [selectedObject, setSelectedObject] = useState({});
  const getProduct = () => {

    if (!product.hasOwnProperty("referintaFactura")) {
      const productIndex = products.findIndex(
        (item) => item.cod === product.cod
      );


      if (productIndex !== -1) {
        setSelectedObject(products[productIndex]);
        console.log(products[productIndex]);
      } else {
        setSelectedObject({});
      }
    } else {
      setSelectedObject(product);
    }
  };

  const handleCleanName = (key) => {
    let name;
    switch (key) {
      case "pretFaraTva":
        name = "Pret fara TVA";
        break;
      case "pretAchizitie":
        name = "pret achizitie";
        break;
      case "pret":
        name = "pret cu TVA";
        break;
      default:
        name = key;
    }
    return name.substring(0, 1).toUpperCase() + name.slice(1);
  };

  return (
    <div className="modal-product-details">
      <PagePreview className="modal-overlay">
        <PagePreview className="modal-content">
          <div className="info">
            <span>Product info</span>
          </div>
          <div className="product-info">
            <div className="column">
              {column1.map((key) => {
                if (key !== "referintaFactura") {
                  return (
                    <div key={key} className="row">
                      <label htmlFor={key}>{handleCleanName(key)}</label>
                      <span>:</span>
                      <Input name={key} value={selectedObject[key]} disabled />
                    </div>
                  );
                } else {
                  return null;
                }
              })}
            </div>
            <hr />
            <div className="column">
              {column2.map((key) => {
                if (key !== "referintaFactura") {
                  return (
                    <div key={key} className="row">
                      <label htmlFor={key}>{handleCleanName(key)}</label>
                      <span>:</span>
                      <Input name={key} value={selectedObject[key]} disabled />
                    </div>
                  );
                } else {
                  return null;
                }
              })}
            </div>
            <hr />
            <div className="column">
              <div className="invoices-list">
                <span id="title">Factura</span>
                {selectedObject.referintaFactura?.map((ref) => {
                  return (
                    <div key={ref} className="row">
                      <span name={ref}>{ref}</span>
                    </div>
                  );
                })}
              </div>
            </div>
            <hr />
            <div className="column"></div>
          </div>
          <hr />
          <div className="close">
            <Button variant="contained" color="info" onClick={closeModal}>
              Close
            </Button>
          </div>
        </PagePreview>
      </PagePreview>
    </div>
  );
};

export default ModalProductDetails;
