import React, { useEffect, useState } from "react";
import PagePreview from "../PagePreview/PagePreview";
import Form from "../Formular/Form";
import Input from "../Input/Input";
import "./productsInvoiceForm.css";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllInventory } from "../../redux/slices/inventorySlice";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ProductsInvoiceForm({
  stateProdus,
  setStateProdus,
  setCodProdus,
  handleChangeProdus,
  productsList,
}) {
  const inventory = useSelector((state) => state.stocuri);
  const [activateInputs, setActivateInputs] = useState(true);

  const notify = () => toast.info("Produsul exista in deja in lista");

  const inputsOrder = [
    "descriere",
    "stoc",
    "cod",
    "categorie",
    "brand",
    "gramaj",
    "pretFaraTva",
    "discount",
  ];

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchAllInventory());
  }, [dispatch]);

  useEffect(() => {
    if (stateProdus.descriere === "") {
      setActivateInputs(true);
    }
  }, [stateProdus.descriere]);

  const handlePlaceHolder = (key) => {
    let placeholder = key.substring(0, 1).toUpperCase() + key.slice(1);

    if (key === "stoc") placeholder = "Cantitate";

    if (key === "gramaj") placeholder = "Gramaj / BUC";

    if (key === "pretFaraTva") placeholder = "Pret fara TVA";

    if (key === "pretAchizitie") placeholder = "Pret achizitie";

    return placeholder;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (stateProdus.descriere !== "") {
      setActivateInputs(false);
    }

    const searcedInPoducts = productsList
      .map(
        (item) =>
          `${item.categorie} ${item.brand} ${item.descriere} ${item.gramaj}`
      )
      .join(" ")
      .toLowerCase();

    const finded = searcedInPoducts.includes(
      stateProdus.descriere.toLowerCase()
    );

    if (finded) {
      notify();
      setActivateInputs(true)
    }

    const combinedList = inventory.concat(productsList);
    const searchedString = combinedList
      .map(
        (item) =>
          `${item.categorie} ${item.brand} ${item.descriere} ${item.gramaj}`
      )
      .join(" ")
      .toLowerCase();

    const findedProduct = searchedString.includes(
      stateProdus.descriere.toLowerCase()
    );

    if (findedProduct) {
      const foundItem = combinedList.find((item) => {
        const itemString = `${item.categorie} ${item.brand} ${item.descriere} ${item.gramaj}`.toLowerCase();
        return itemString.includes(stateProdus.descriere.toLowerCase());
      });

      setStateProdus(foundItem);
    } else {
      setStateProdus({
        ...stateProdus,
        cod: stateProdus.descriere !== "" ? setCodProdus(inventory) : "",
      });
    }
  };

  return (
    <PagePreview className="form-produse">
      <ToastContainer />
      <Form>
        {inputsOrder.map((keyName) => {
          return (
            <Input
              className="input"
              key={keyName}
              id={keyName}
              type="text"
              name={keyName}
              placeholder={handlePlaceHolder(keyName)}
              onChange={handleChangeProdus}
              value={stateProdus[keyName]}
              disabled={
                (keyName !== "descriere" &&
                  (activateInputs || keyName === "cod")) ||
                keyName === "cod"
              }
              autoComplete="off"
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  handleSubmit(e);
                }
              }}
            />
          );
        })}
      </Form>
    </PagePreview>
  );
}
