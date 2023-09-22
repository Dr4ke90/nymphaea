import React, { useEffect, useState } from "react";
import "./modalServicii.css";
import { Button } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllServices } from "../../redux/slices/servicesSlice";
import Thead from "../t-head/TableHead";
import Table from "../Table/Table";
import Input from "../Input/Input";

export default function ModalServicii({ closeModal, dateFisa, setDateFisa }) {
  const thead = ["#", "cod", "tip"];
  const services = useSelector((state) => state.servicii);
  const [filteredServices, setFilteredServices] = useState([]);

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchAllServices());
  }, [dispatch]);

  useEffect(() => {
    setFilteredServices(services);
  }, [services]);

  const handleCheckboxChange = (service) => {
    const serviceIndex = dateFisa.produse.findIndex(
      (item) => item.cod === service.cod
    );

    if (serviceIndex !== -1) {
      const updatedServicii = [...dateFisa.produse];
      updatedServicii.splice(serviceIndex, 1);

      for (let i = 0; i < updatedServicii.length; i++) {
        updatedServicii[i].nr = i + 1;
      }

      setDateFisa({
        ...dateFisa,
        produse: updatedServicii,
      });
    } else {
      setDateFisa({
        ...dateFisa,
        produse: [
          ...dateFisa.produse,
          { nr: dateFisa.produse.length + 1, reteta: [], ...service },
        ],
      });
    }
  };

  const handleSearchChange = (event) => {
    const { name, value } = event.target;
    const lowercaseValue = value.toLowerCase();
    let filteredResults = [];

    filteredResults = services.filter((item) => {
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
    <div className="modal-servicii-overlay">
      <div className="modal-servicii-content">
        <div className="services-table">
          <Table className="table-dispaly">
            <Thead thead={thead} handleChange={handleSearchChange} />
            <tbody className="tbody">
              {filteredServices.map((service) => {
                return (
                  <tr key={service.cod} className="tbody-tr">
                    <td className="small">
                      <Input
                        type="checkbox"
                        name={service.cod}
                        onChange={() => handleCheckboxChange(service)}
                        checked={dateFisa.produse.some(
                          (item) => item.cod === service.cod
                        )}
                      />
                    </td>
                    {Object.entries(service).map(([key, value]) => {
                      if (key === "cod" || key === "tip") {
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
