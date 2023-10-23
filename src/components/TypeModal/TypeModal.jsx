import React from "react";
import Form from "../Formular/Form";
import "./typeModal.css"

export default function TypeModal({ initial, optionsList, dateFactura, setDateFactura }) {
  const handleChangeTip = (e) => {
    const selectedVal = e.target.value;
    const newFacturaData = {
      ...initial,
      tip: selectedVal,
      serie: selectedVal === "chirie" ? "N/A" : initial.serie,
      vendor: selectedVal === "chirie" ? "Chirie" : initial.vendor,
      tva: selectedVal === "chirie" ? 0 : initial.tva,
      total: selectedVal === "chirie" ? initial.valoare : initial.total,
    };

    setDateFactura(newFacturaData);
  };

  return (
    <Form className="type-modal">
      {Object.keys(dateFactura).map((key) => {
        if (key === "tip") {
          return (
            <select
              key={key}
              id={key}
              name={key}
              onChange={handleChangeTip}
              value={dateFactura.tip}
            >
              <option value="">Setelcteaza tip</option>
              {optionsList.map((option) => {
                return (
                  <option key={option}  className="option" value={option}>
                    {option.charAt(0).toUpperCase() + option.slice(1)}
                  </option>
                );
              })}
            </select>
          );
        } else {
          return null;
        }
      })}
    </Form>
  );
}
