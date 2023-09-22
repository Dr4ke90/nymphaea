import React, { useEffect, useState } from "react";
import { Button } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import Thead from "../t-head/TableHead";
import Table from "../Table/Table";
import Input from "../Input/Input";
import { fetchAllInventory } from "../../redux/slices/inventorySlice";
import "./modalReteta.css";

export default function ModalReteta({
  closeModal,
  service,
  setDateFisa,
  dateFisa,
}) {
  const thead = ["#", "cod", "produs", "cantitate"];
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
    const productIndex = service.reteta.findIndex(
      (p) => p.cod === product.cod
    );

    if (productIndex !== -1) {
      service.reteta.splice(productIndex, 1);
    } else {
      service.reteta.push(product);
    }

    setDateFisa((prevDateFisa) => {
      const { produse } = prevDateFisa;

      const serviceIndex = produse.findIndex(
        (serv) => serv.cod === service.cod
      );

      if (serviceIndex !== -1) {
        produse[serviceIndex].reteta = service.reteta;

        return { ...prevDateFisa, produse: [...produse] };
      } else {
        return { ...prevDateFisa };
      }
    });
  };

  const handleChangeCantiate = (e, product) => {
    e.preventDefault();
    const { value } = e.target;

    setDateFisa((prevDateFisa) => {
      const { produse } = prevDateFisa;
      const serviceIndex = produse.findIndex(
        (serv) => serv.cod === service.cod
      );

      if (serviceIndex !== -1) {
        produse[serviceIndex].reteta = produse[serviceIndex].reteta.map(
          (p) => {
            if (p.cod === product.cod) {
              return {
                ...p,
                cantitateUtilizata: value,
              };
            } else {
              return p;
            }
          }
        );

        return { ...prevDateFisa, produse: [...produse] };
      } else {
        return { ...prevDateFisa };
      }
    });
  };

  const handleClassName = (key) => {
    if (key !== "tip") {
      return "small";
    }
  };

  const getCantitate = (product) => {
    const serv = dateFisa.produse.find((s) => s.cod === service.cod);
    if (serv.reteta.lentgh !== 0) {
      const prod = serv.reteta.find((p) => p.cod === product.cod);

      if (
        prod &&
        typeof prod === "object" &&
        prod.hasOwnProperty("cantitate")
      ) {
        return prod.cantitate;
      }
    }
  };

  

  return (
    <div className="modal-reteta-overlay">
      <div className="modal-reteta-content">
        <div className="reteta-table">
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
                        checked={service.reteta.some(
                          (p) => p.cod === product.cod
                        )}
                        onChange={() => handleCheckboxChange(product)}
                      />
                    </td>
                    {Object.entries(product).map(([key, value]) => {
                      if (key === "cod" || key === "produs") {
                        return (
                          <td key={key} className={handleClassName(key)}>
                            {value}
                          </td>
                        );
                      } else if (key === "stoc") {
                        return (
                          <td key={"cantitate"}>
                            <Input
                              type="text"
                              name="cantitate"
                              className="small"
                              value={getCantitate(product)}
                              onChange={(e) => handleChangeCantiate(e, product)}
                              autoComplete="off"
                              disabled={!service.reteta.some(
                                (p) => p.cod === product.cod
                              )}
                            />
                          </td>
                        );
                      } else {
                        return null;
                      }
                    })}
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </div>
        <div className="buttons-wrapper">
          <Button variant="contained" color="info" onClick={closeModal}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}
