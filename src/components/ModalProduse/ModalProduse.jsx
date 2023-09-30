import React, { useEffect, useState } from "react";
import { Button } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import Thead from "../t-head/TableHead";
import Table from "../Table/Table";
import Input from "../Input/Input";
import { fetchAllInventory } from "../../redux/slices/inventorySlice";
import "./modalProduse.css";

export default function ModalProduse({ closeModal, dateFisa, setDateFisa }) {
  const thead = ["#", "cod", "brand", "produs"];
  const stocuri = useSelector((state) => state.stocuri);
  const [filteredServices, setFilteredServices] = useState([]);

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchAllInventory());
  }, [dispatch]);

  useEffect(() => {
    setFilteredServices(stocuri);
  }, [stocuri]);

  const handleCheckboxChange = (product) => {
    const serviceIndex = dateFisa.produse.findIndex(
      (item) => item.cod === product.cod
    );

    if (serviceIndex !== -1) {
      const updateProducts = [...dateFisa.produse];
      updateProducts.splice(serviceIndex, 1);

      for (let i = 0; i < updateProducts.length; i++) {
        updateProducts[i].nr = i + 1;
      }

      setDateFisa({
        ...dateFisa,
        produse: updateProducts,
      });
    } else {
      setDateFisa({
        ...dateFisa,
        produse: [
          ...dateFisa.produse,
          { nr: dateFisa.produse.length + 1, ...product },
        ],
      });
    }
  };

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

    setFilteredServices(filteredResults);
  };

  const handleClassName = (key) => {
    if (key !== "tip") {
      return "small";
    }
  };

  return (
    <div className="modal-products-overlay">
      <div className="modal-products-content">
        <div className="products-table">
          <Table className="table-dispaly">
            <Thead thead={thead} handleChange={handleSearchChange} />
            <tbody className="tbody">
              {filteredServices.map((product) => {
                return (
                  <tr key={product.cod} className="tbody-tr">
                    <td className="small">
                      <Input
                        type="checkbox"
                        name={product.cod}
                        onChange={() => handleCheckboxChange(product)}
                        checked={dateFisa.produse.some(
                          (item) => item.cod === product.cod
                        )}
                      />
                    </td>
                    {Object.entries(product).map(([key, value]) => {
                      if (
                        key === "cod" ||
                        key === "brand" ||
                        key === "tip"
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
