import React, { useEffect, useState } from "react";
import { Button } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import Thead from "../t-head/TableHead";
import Table from "../Table/Table";
import Input from "../Input/Input";
import { fetchAllInventory } from "../../redux/slices/inventorySlice";
import "./modalProduseExtra.css";

export default function ModalProduseExtra({
  closeModal,
  service,
  setDateFisa,
  dateFisa,
}) {
  const thead = ["#", "cod", "descriere", "stocInGr", "cantitate", "valoare"];
  const stocuri = useSelector((state) => state.stocuri);
  const [filteredProducts, setFilteredProducts] = useState([]);

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchAllInventory());
  }, [dispatch]);

  useEffect(() => {
    setFilteredProducts(stocuri);
  }, [stocuri]);

  const handleSearchChange = (event) => {
    const { name, value } = event.target;
    const lowercaseValue = value.toLowerCase();
    let filteredResults = [];

    filteredResults = stocuri.filter((item) => {
      const itemValue = item[name];
      if (typeof itemValue === "number") {
        const stringValue = itemValue.toString().toLowerCase();
        return stringValue.includes(lowercaseValue);
      } else if (typeof itemValue === "string") {
        return itemValue.toLowerCase().includes(lowercaseValue);
      }
      return false;
    });

    setFilteredProducts(filteredResults);
  };

  const handleCheckboxChange = (product) => {
    setDateFisa((prevDateFisa) => {
      const { produse } = prevDateFisa;

      const serviceIndex = produse.findIndex(
        (serv) => serv.cod === service.cod
      );

      if (!service.produseExtra) {
        service.produseExtra = [];
      }

      const productIndex = service.produseExtra.findIndex(
        (p) => p.cod === product.cod
      );

      const updateProduseExtra = [...service.produseExtra];

      if (productIndex !== -1) {
        updateProduseExtra.splice(productIndex, 1);
      } else {
        const { cod, gramaj, stocInGr, pret } = product;
        const newProduct = {
          cod,
          gramaj,
          stocInGr,
          pret,
          cantitate: "",
          valoare: 0,
        };
        updateProduseExtra.push(newProduct);
        console.log(newProduct);
      }

      service.produseExtra = updateProduseExtra;

      if (serviceIndex !== -1) {
        produse[serviceIndex].produseExtra = updateProduseExtra;
        return { ...prevDateFisa, produse: [...produse] };
      } else {
        return { ...prevDateFisa };
      }
    });
  };

  const handleChangeCantiate = (e, product) => {
    e.preventDefault();
    const { value } = e.target;
    const parsedValue = value !== "" ? parseFloat(value) : 0;

    setDateFisa((prevDateFisa) => {
      const { produse } = prevDateFisa;
      const serviceIndex = produse.findIndex(
        (serv) => serv.cod === service.cod
      );

      if (serviceIndex !== -1) {
        produse[serviceIndex].produseExtra = produse[
          serviceIndex
        ].produseExtra.map((p) => {
          if (p.cod === product.cod) {
            return {
              ...p,
              cantitate: parsedValue,
              valoare: (
                (product.pret / product.gramaj) *
                parseFloat(parsedValue)
              ).toFixed(2),
            };
          } else {
            return p;
          }
        });

        return { ...prevDateFisa, produse: [...produse] };
      } else {
        return { ...prevDateFisa };
      }
    });
  };

  const handleClassName = (key) => {
    if (key !== "descriere") {
      return "small";
    }
  };

  const getCantitate = (product) => {
    const serv = dateFisa.produse?.find((s) => s.cod === service.cod);
    if (serv.produseExtra && serv.produseExtra.length !== 0) {
      const prod = serv.produseExtra.find((p) => p.cod === product.cod);

      if (
        prod &&
        typeof prod === "object" &&
        prod.hasOwnProperty("cantitate")
      ) {
        return prod.cantitate;
      }
    }
    return "";
  };

  const getProductValue = (product) => {
    const prod = service.produseExtra?.find((p) => p.cod === product.cod);

    if (prod) {
      return prod.valoare;
    } else {
      return;
    }
  };

  return (
    <div className="modal-produseExtra-overlay">
      <div className="modal-produseExtra-content">
        <div className="produseExtra-table">
          <Table className="table-dispaly">
            <Thead thead={thead} handleChange={handleSearchChange} />
            <tbody className="tbody">
              {filteredProducts.map((product) => {
                return (
                  <tr key={product.cod} className="tbody-tr">
                    <td className="small">
                      <Input
                        type="checkbox"
                        name={product.cod}
                        checked={service.produseExtra?.some(
                          (p) => p.cod === product.cod
                        )}
                        onChange={() => handleCheckboxChange(product)}
                      />
                    </td>
                    {Object.entries(product).map(([key, value]) => {
                      if (
                        key === "cod" ||
                        key === "descriere" ||
                        key === "valoare" ||
                        key === "stocInGr"
                      ) {
                        return (
                          <td key={key} className={handleClassName(key)}>
                            {value}
                          </td>
                        );
                      } else {
                        return null;
                      }
                    })}
                    <td key={"cantitate"}>
                      <Input
                        type="text"
                        name="cantitate"
                        className="small"
                        defaultValue={getCantitate(product)}
                        onChange={(e) => handleChangeCantiate(e, product)}
                        autoComplete="off"
                        disabled={
                          !service.produseExtra?.some(
                            (p) => p.cod === product.cod
                          )
                        }
                      />
                    </td>
                    <td key={"valoare"}>
                      <Input
                        type="text"
                        name="valoare"
                        className="small"
                        defaultValue={getProductValue(product)}
                        autoComplete="off"
                        disabled
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </div>
        <div className="buttons-wrapper">
          <Button
            variant="contained"
            color="info"
            onClick={closeModal}
            disabled={
              service.produseExtra &&
              service.produseExtra.length !== 0 &&
              !service.produseExtra.every(
                (produs) =>
                  produs.hasOwnProperty("cantitate") && produs.cantitate !== ""
              )
            }
          >
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}
