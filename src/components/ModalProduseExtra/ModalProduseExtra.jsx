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
  const thead = ["#", "cod", "descriere", "cantitate"];
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
    const productIndex = service.produseExtra.findIndex(
      (p) => p.cod === product.cod
    );

    const updateProduseExtra = [...service.produseExtra];

    if (productIndex !== -1) {
      updateProduseExtra.splice(productIndex, 1);
    } else {
      updateProduseExtra.push(product);
    }

    setDateFisa((prevDateFisa) => {
      const { produse } = prevDateFisa;

      const serviceIndex = produse.findIndex(
        (serv) => serv.cod === service.cod
      );

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
              cantitateUtilizata: value,
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
    if (key !== "tip") {
      return "small";
    }
  };

  const getCantitate = (product) => {
    const serv = dateFisa.produse.find((s) => s.cod === service.cod);
    if (serv.produseExtra.length !== 0) {
      // Corectat aici
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
                        checked={service.produseExtra.some(
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
                          <td key={"cantitate"}>
                            <Input
                              type="text"
                              name="cantitate"
                              className="small"
                              value={getCantitate(product)}
                              onChange={(e) => handleChangeCantiate(e, product)}
                              autoComplete="off"
                              disabled={
                                !service.produseExtra.some(
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
