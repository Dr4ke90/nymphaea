import React, { useEffect, useState } from "react";
import Keyboard from "../../components/Keyboard/Keyboard";
import "./modalFisa.css";
import { Button } from "@mui/material";
import ModalServicii from "../ModalServicii/ModalServicii";
import Table from "../Table/Table";
import Thead from "../t-head/TableHead";
import Input from "../Input/Input";
import { FaSlidersH } from "react-icons/fa";
import ModalProduse from "../ModalProduse/ModalProduse";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllCustomers } from "../../redux/slices/customersSlice";
import ModalReteta from "../ModalReteta/ModalReteta";

export default function ModalFisa({ closeModal, appointment }) {
  const thead = ["nr", "cod", "tip", "cantitate", "#"];
  const clienti = useSelector((state) => state.clienti);
  const [total, settotal] = useState(0)

  const getCodFisa = () => {
    if (clienti.length === 0) return;
    const client = clienti.filter(
      (client) => client.cod === appointment.client
    );

    const nr = client[0].fise.length + 1;
    const paddedNr = nr.toString().padStart(3, "0");
    return "F" + paddedNr;
  };

  const initialStateFisa = {
    codFisa: getCodFisa(),
    codClient: appointment.client,
    numeClient: appointment.numeClient,
    data: appointment.data,
    codProgramare: appointment.nr,
    codAngajat: appointment.angajat,
    servicii: [],
  };
  const [dateFisa, setDateFisa] = useState(initialStateFisa);

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchAllCustomers());
  }, [dispatch]);

  const [openModalServicii, setOpenModalServicii] = useState(false);
  const handleModalServicii = () => {
    setOpenModalServicii(!openModalServicii);
  };

  const [openModalProduse, setOpenModalProduse] = useState(false);
  const handleOpenModalProduse = () => {
    setOpenModalProduse(!openModalProduse);
  };

  const [openModalReteta, setOpenModalReteta] = useState(false);
  const [curentService, setCurrentService] = useState({});
  const handleOpenModalReteta = (service) => {
    setOpenModalReteta(!openModalReteta);

    setCurrentService(service);
  };

  const handleChangeCantitate = (event, index) => {
    const { value } = event.target;
    const updatedServicii = [...dateFisa.servicii];
    updatedServicii[index].cantitate = value;
    setDateFisa({
      ...dateFisa,
      servicii: updatedServicii,
    });
  };

  const headerFieldOrder = ["numeClient", "codClient", "codFisa", "codAngajat"];
  const tableFieldOrder = ["nr", "cod", "tip", "nrInv", "produs"];
  return (
    <div className="modal-fisa-overlay">
      <div className="modal-fisa-content">
        <div className="modal-header">
          {headerFieldOrder.map((key) => {
            if (dateFisa.hasOwnProperty(key)) {
              return (
                <Input
                  key={key}
                  type="text"
                  disabled
                  value={dateFisa[key]}
                  name={key}
                />
              );
            } else {
              return null;
            }
          })}
        </div>
        <div className="modal-fisa-container">
          <div className="buttons-wrapper">
            <Button
              variant="contained"
              color="info"
              onClick={handleModalServicii}
            >
              Servicii
            </Button>
            <Button
              variant="contained"
              color="info"
              onClick={handleOpenModalProduse}
            >
              Produse
            </Button>
          </div>
          <div className="table-container">
            <Table>
              <Thead thead={thead} />
              <tbody>
                {dateFisa.servicii.map((service, index) => {
                  return (
                    <tr key={service.cod}>
                      {tableFieldOrder.map((key) => {
                        if (service.hasOwnProperty(key)) {
                          return <td key={key}> {service[key]}</td>;
                        } else {
                          return null;
                        }
                      })}
                      <td key={"input"}>
                        <Input
                          type="text"
                          name="cantitate"
                          className="small"
                          onChange={(e) => handleChangeCantitate(e, index)}
                          autoComplete="off"
                        />
                      </td>
                      <td
                        key={"add-produse"}
                        style={{
                          display: "flex",
                          justifyContent: "space-around",
                        }}
                      >
                        <FaSlidersH
                          style={{ cursor: "pointer" }}
                          onClick={() => handleOpenModalReteta(service)}
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          </div>
        </div>
        <div className="total"> 
                <Input type="text" name="total" value={total} disabled />
        </div>
        <div className="modal-control-buttons">
          <Button
            variant="contained"
            color="success"
            onClick={() => console.log(dateFisa)}
          >
            Trimite catre casa
          </Button>
          <Button variant="contained" color="info" onClick={closeModal}>
            Close
          </Button>
        </div>
        {openModalServicii && (
          <ModalServicii
            closeModal={handleModalServicii}
            dateFisa={dateFisa}
            setDateFisa={setDateFisa}
          />
        )}
        {openModalProduse && (
          <ModalProduse
            closeModal={handleOpenModalProduse}
            dateFisa={dateFisa}
            setDateFisa={setDateFisa}
          />
        )}
        {openModalReteta && (
          <ModalReteta
            closeModal={handleOpenModalReteta}
            service={curentService}
            setDateFisa={setDateFisa}
          />
        )}
      </div>
    </div>
  );
}
