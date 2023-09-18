import React, { useEffect, useState } from "react";
import { Button } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import Thead from "../t-head/TableHead";
import Table from "../Table/Table";
import Input from "../Input/Input";
import { fetchAllInventory } from "../../redux/slices/inventorySlice";
import "./modalReteta.css";

export default function ModalReteta({ closeModal, service, setDateFisa }) {
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
      (p) => p.nrInv === product.nrInv
    );

    if (productIndex !== -1) {
      service.reteta.splice(productIndex, 1);
    } else {
      service.reteta.push(product);
    }

    setDateFisa((prevDateFisa) => {
      const { servicii } = prevDateFisa;

      const serviceIndex = servicii.findIndex(
        (serv) => serv.cod === service.cod
      );

      if (serviceIndex !== -1) {
        servicii[serviceIndex].reteta = service.reteta;

        return { ...prevDateFisa, servicii: [...servicii] };
      } else {
        return { ...prevDateFisa };
      }
    });
  };

  const handleChangeCantiate = (e, product) => {
    e.preventDefault();
    const { value } = e.target;

    setDateFisa((prevDateFisa) => {
      const { servicii } = prevDateFisa;
      const serviceIndex = servicii.findIndex(
        (serv) => serv.cod === service.cod
      );

      if (serviceIndex !== -1) {
        servicii[serviceIndex].reteta = servicii[serviceIndex].reteta.map(
          (p) => {
            console.log(value);
            if (p.nrInv === product.nrInv) {
              return {
                ...p,
                cantitate: value,
              };
            } else {
              return p;
            }
          }
        );

        return { ...prevDateFisa, servicii: [...servicii] };
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

  return (
    <div className="modal-reteta-overlay">
      <div className="modal-reteta-content">
        <div className="reteta-table">
          <Table className="table-dispaly">
            <Thead thead={thead} handleChange={handleSearchChange} />
            <tbody className="tbody">
              {filteredProducts.map((product, index) => {
                return (
                  <tr key={product.nrInv} className="tbody-tr">
                    <td className="small">
                      <Input
                        type="checkbox"
                        name={product.nrInv}
                        checked={service.reteta.some(
                          (p) => p.nrInv === product.nrInv
                        )}
                        onChange={() => handleCheckboxChange(product)}
                      />
                    </td>
                    {Object.entries(product).map(([key, value], i) => {
                      if (key === "nrInv" || key === "produs") {
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
                              onChange={(e) => handleChangeCantiate(e, product)}
                              autoComplete="off"
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
