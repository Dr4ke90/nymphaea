import React, { useEffect, useState } from "react";
import { Button } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import Thead from "../t-head/TableHead";
import Table from "../Table/Table";
import Input from "../Input/Input";
import { fetchAllInventory } from "../../redux/slices/inventorySlice";
import "./modalProduseDeBaza.css";

export default function ModalProduseDeBaza({
  closeModal,
  service,
  setService,
}) {
  const thead = ["#", "cod", "descriere", "cantitate", "valoare"];
  const stocuri = useSelector((state) => state.stocuri);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [totalProdDebaza, setTotalProdDeBaza] = useState(0);

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchAllInventory());
  }, [dispatch]);

  useEffect(() => {
    setFilteredProducts(stocuri);
  }, [stocuri]);

  useEffect(() => {
    setTotalProdDeBaza(
      service.produseDeBaza.reduce((acumulator, item) => {
        return acumulator + parseFloat(item.valoare);
      }, 0)
    );
  }, [service.produseDeBaza]);

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
    const { cod } = product;

    setService((prevService) => {
      const { produseDeBaza } = prevService;
      const existingProductIndex = produseDeBaza.findIndex(
        (item) => item.cod === cod
      );

      if (existingProductIndex !== -1) {
        // Dacă produsul există în listă, elimină-l
        const updatedProducts = [...produseDeBaza];
        updatedProducts.splice(existingProductIndex, 1);

        return { ...prevService, produseDeBaza: updatedProducts };
      } else {
        // Dacă produsul nu există în listă, adaugă-l cu proprietatea valoare setată la 0
        const newProduct = {
          nr: produseDeBaza.length + 1,
          cod,
          cantitate: 0,
          valoare: 0, // Adaugă proprietatea valoare cu valoarea implicită 0
        };

        return {
          ...prevService,
          produseDeBaza: [...produseDeBaza, newProduct],
        };
      }
    });
  };

  const handleChangeCantitate = (e, product) => {
    e.preventDefault();
    const { value } = e.target;
    const parsedValue = value !== "" ? parseFloat(value) : 0;

    setService((prevService) => {
      const { produseDeBaza } = prevService;
      const productIndex = produseDeBaza.findIndex(
        (prod) => prod.cod === product.cod
      );

      if (productIndex !== -1) {
        const updatedProducts = [...produseDeBaza];
        updatedProducts[productIndex] = {
          ...updatedProducts[productIndex],
          cantitate: parsedValue,
          valoare: (
            (product.pret / product.gramaj) *
            parseFloat(parsedValue)
          ).toFixed(2),
        };

        return { ...prevService, produseDeBaza: updatedProducts };
      } else {
        return { ...prevService };
      }
    });
  };

  const handleClassName = (key) => {
    if (key !== "tip") {
      return "small";
    }
  };

  const getCantitate = (product) => {
    const prod = service.produseDeBaza.find((p) => p.cod === product.cod);
    if (prod) {
      return prod.cantitate;
    } else {
      return;
    }
  };

  const getProductValue = (product) => {
    const prod = service.produseDeBaza.find((p) => p.cod === product.cod);

    if (prod) {
      return prod.valoare;
    } else {
      return;
    }
  };

  return (
    <div className="modal-prodDeBaza-overlay">
      <div className="modal-prodDeBaza-content">
        <div className="product-table">
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
                        checked={service.produseDeBaza.some(
                          (p) => p.cod === product.cod
                        )}
                        onChange={() => handleCheckboxChange(product)}
                      />
                    </td>
                    {Object.entries(product).map(([key, value]) => {
                      if (key === "cod" || key === "descriere") {
                        return (
                          <td key={key} className={handleClassName(key)}>
                            {value}
                          </td>
                        );
                      } else if (key === "stoc") {
                        return (
                          <td key={key}>
                            <Input
                              type="text"
                              name="cantitate"
                              className="small"
                              value={getCantitate(product)}
                              onChange={(e) =>
                                handleChangeCantitate(e, product)
                              }
                              autoComplete="off"
                              disabled={
                                !service.produseDeBaza.some(
                                  (p) => p.cod === product.cod
                                )
                              }
                            />
                          </td>
                        );
                      } else {
                        return null;
                      }
                    })}
                    <td key={"valoare"}>
                      <Input
                        type="text"
                        name="valoare"
                        className="small"
                        value={getProductValue(product)}
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
        <div className="total">Total : {totalProdDebaza} lei</div>
        <div className="buttons-wrapper">
          <Button variant="contained" color="info" onClick={closeModal}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}
