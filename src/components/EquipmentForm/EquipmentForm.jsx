import React, { useEffect, useState } from "react";
import PagePreview from "../PagePreview/PagePreview";
import Form from "../Formular/Form";
import Input from "../Input/Input";
import "./equipmentForm.css";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllEquipment } from "../../redux/slices/echipamentSlice";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function EquipmentForm({
  stateEquipment,
  setStateEquipment,
  setCodEquip,
  handleChangeEquipment,
  equipmentList,
}) {
  const equipment = useSelector((state) => state.echipament);
  const [activateInputs, setActivateInputs] = useState(true);

  const notify = () => toast.info("Produsul exista deja in lista!!!");

  useEffect(() => {
    if (stateEquipment.model === "") {
      setActivateInputs(true);
    }
  }, [stateEquipment.model]);

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchAllEquipment());
  }, [dispatch]);

  const equipmentInputsOrder = [
    "model",
    "stoc",
    "cod",
    "descriere",
    "pretFaraTva",
    "discount",
  ];

  const handlePlaceHolder = (key) => {
    let placeholder = key.substring(0, 1).toUpperCase() + key.slice(1);

    if (key === "stoc") placeholder = "Cantitate";

    if (key === "pretFaraTva") placeholder = "Pret fara TVA";

    if (key === "pretAchizitie") placeholder = "Pret achizitie";

    return placeholder;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (stateEquipment.model !== "") {
      setActivateInputs(false);
    }

    const finded = equipmentList.find(
      (item) => item.model.toLowerCase() === stateEquipment.model.toLowerCase()
    );

    if (finded) {
      notify()
      setActivateInputs(true)
    }

    const combinedList = equipment.concat(equipmentList);
    const findedProduct = combinedList.find(
      (item) => item.model.toLowerCase() === stateEquipment.model.toLowerCase()
    );

    if (findedProduct) {
      setStateEquipment(findedProduct);
    } else {
      setStateEquipment({
        ...stateEquipment,
        cod: stateEquipment.model !== "" ? setCodEquip(equipment) : "",
      });
    }
  };

  return (
    <PagePreview className="form-produse">
      <ToastContainer />
      <Form>
        {equipmentInputsOrder.map((keyName) => {
          return (
            <Input
              className="input"
              key={keyName}
              id={keyName}
              type="text"
              name={keyName}
              placeholder={handlePlaceHolder(keyName)}
              onChange={handleChangeEquipment}
              value={stateEquipment[keyName]}
              disabled={
                (keyName !== "model" &&
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
