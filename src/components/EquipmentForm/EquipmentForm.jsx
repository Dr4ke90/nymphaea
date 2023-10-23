import React, { useEffect, useState } from "react";
import PagePreview from "../PagePreview/PagePreview";
import Form from "../Formular/Form";
import Input from "../Input/Input";
import "./equipmentForm.css";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllEquipment } from "../../redux/slices/echipamentSlice";


export default function EquipmentForm({
  stateEquipment,
  setStateEquipment,
  setCodEquip,
  handleChangeEquipment
}) {
  const equipment = useSelector((state) => state.echipament);
  const [activateInputs, setActivateInputs] = useState(true);


  useEffect(() => {
    if (stateEquipment.model === "") {
      setActivateInputs(true);
    }
  },[stateEquipment.model]);


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
    "pretAchizitie",
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

    const findedProduct = equipment.find(
      (item) =>
        item.model.toLowerCase() === stateEquipment.model.toLowerCase()
    );

    if (findedProduct) {
      setStateEquipment(findedProduct);
    } else {
      setStateEquipment({
        ...stateEquipment,
        cod: stateEquipment.model !== "" ? setCodEquip() : "",
      });
    }
  };

  return (
    <PagePreview className="form-produse">
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
