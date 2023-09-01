import { useState } from "react";
import "./formFacturi.css";
import TableDisplay from "../../../components/table-display/TableDisplay";
import Form from "../../../components/Formular/Form";
import Input from "../../../components/Input/Input";
import { Button } from "@mui/material";
import PagePreview from "../../../components/PagePreview/PagePreview";
import { renumerotareLista } from "../../../utils/renumerotareLista";

const FormFactura = ({ closeModal }) => {
  const thead = [
    "nr",
    "inventar",
    "categorie",
    "brand",
    "produs",
    "cantitate",
    "pret",
    "total",
    "#",
  ];

  const date = new Date().toISOString().slice(0, 10);

  const initialStateFactura = {
    nr: "",
    data: date,
    serie: "",
    numar: "",
    vendor: "",
    valoare: "",
    tva: "",
    total: "",
    produse: [],
  };

  const initialStateProdus = {
    nr: "",
    nrInv: "",
    categorie: "",
    brand: "",
    produs: "",
    cantitate: "",
    pret: "",
    total: "",
  };

  const [dateFactura, setDateFactura] = useState(initialStateFactura);
  const [produs, setProdus] = useState(initialStateProdus);

  const handleChangeFactura = (event) => {
    const { name, value } = event.target;
    let newValue = value.toLocaleLowerCase();
    if (name === "serie") newValue = newValue.toUpperCase();
    if (name === "valoare")
      newValue = newValue.replace(/[^0-9.]|(?<=\.\d{2})\d+/g, "");

    newValue = newValue.charAt(0).toUpperCase() + newValue.slice(1);

    setDateFactura({
      ...dateFactura,
      [name]: newValue,
    });
  };

  const handleChangeProdus = (e) => {
    const { name, value } = e.target;
    e.preventDefault();
    let newValue = value.toLocaleLowerCase();

    if (name === "pret")
      newValue = newValue.replace(/[^0-9.]|(?<=\.\d{2})\d+/g, "");

    newValue = newValue.charAt(0).toUpperCase() + newValue.slice(1);

    setProdus((prevProduse) => {
      const updateProduse = {
        ...prevProduse,
        [name]: newValue,
      };

      updateProduse.total = updateProduse.cantitate * updateProduse.pret;

      return updateProduse;
    });
  };

  const handleAdaugaProdus = (e) => {
    e.preventDefault();

    let newTotal = dateFactura.total;
    if (dateFactura.produse.length === 0) {
      newTotal = produs.total;
    } else {
      newTotal += produs.total;
    }

    setDateFactura({
      ...dateFactura,
      produse: [
        ...dateFactura.produse,
        {
          ...produs,
          nr: dateFactura.produse.length + 1,
        },
      ],
      total: newTotal,
    });
  };

  const handleInregistreaza = (event) => {
    event.preventDefault();
  };

  const handleRemoveProdus = (nr) => {
    setDateFactura((prev) => {
      const updatedTotal =
        prev.total - prev.produse.find((item) => item.nr === nr).total;
      const updateProduse = prev.produse.filter((item) => item.nr !== nr);

      const updateFactura = {
        ...prev,
        produse: renumerotareLista(updateProduse),
        total: updatedTotal.toFixed(2),
      };

      return updateFactura;
    });
  };

  const checkDisable = (obj) =>{
    if (obj.produse.length <= 0 && Object.values(obj).some(
      (value) => typeof value === "string" && value.trim() === ""
    ) ) {
      return true
    }
  }

  return (
    <PagePreview className="modal-overlay">
      <PagePreview className="modal-content">
        <PagePreview className="forms-container">
          <PagePreview className="form-factura">
            <Form>
              {Object.keys(initialStateFactura).map((fieldName) => {
                const placeholder =
                  fieldName.substring(0, 1).toUpperCase() + fieldName.slice(1);
                if (fieldName !== "nr" && fieldName !== "produse") {
                  return (
                    <Input
                      key={fieldName}
                      id={fieldName}
                      type={fieldName === "data" ? "date" : "text"}
                      name={fieldName}
                      placeholder={placeholder}
                      onChange={handleChangeFactura}
                      value={dateFactura[fieldName]}
                      readOnly={fieldName === "total"}
                    />
                  );
                } else {
                  return null;
                }
              })}
            </Form>
          </PagePreview>

          <hr />
          <PagePreview className="form-produse">
            <Form>
              {Object.keys(initialStateProdus).map((keyName) => {
                const placeholder =
                  keyName.substring(0, 1).toUpperCase() + keyName.slice(1);
                if (keyName !== "nr") {
                  return (
                    <Input
                      key={keyName}
                      id={keyName}
                      type="text"
                      name={keyName}
                      placeholder={
                        keyName === "nrInv" ? "Cod produs" : placeholder
                      }
                      onChange={handleChangeProdus}
                      value={produs[keyName]}
                      readOnly={keyName === "nrInv" || keyName === "total"}
                    />
                  );
                } else {
                  return null;
                }
              })}
            </Form>
            <Button
              variant="outlined"
              onClick={handleAdaugaProdus}
              disabled={Object.values(produs).some(
                (value) => typeof value === "string" && value.trim() === ""
              )}
            >
              Adauga
            </Button>
          </PagePreview>
        </PagePreview>

        <TableDisplay
          thead={thead}
          tbody={dateFactura.produse}
          removeItem={handleRemoveProdus}
        />
        <PagePreview className="footer">
          <Button variant="contained" color="info" onClick={closeModal}>
            Close
          </Button>
          <Button
            variant="contained"
            color="success"
            onClick={handleInregistreaza}
            disabled={checkDisable(dateFactura)}
          >
            Inregistreaza
          </Button>
        </PagePreview>
      </PagePreview>
    </PagePreview>
  );
};

export default FormFactura;
