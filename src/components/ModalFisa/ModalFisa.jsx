import React, { useEffect, useState } from "react";
import "./modalFisa.css";
import { Button } from "@mui/material";
import ModalServicii from "../ModalServicii/ModalServicii";
import Table from "../Table/Table";
import Thead from "../t-head/TableHead";
import Input from "../Input/Input";
import { FaSlidersH, FaTrash } from "react-icons/fa";
import ModalProduse from "../ModalProduse/ModalProduse";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllCustomers } from "../../redux/slices/customersSlice";
import ModalProduseExtra from "../ModalProduseExtra/ModalProduseExtra";
import { fetchAllEmployees } from "../../redux/slices/employeesSlice";
import { getDate } from "../../utils/getDate";
import { addNewSale, fetchAllSales } from "../../redux/slices/salesSlice";
import { updateAppointment } from "../../redux/slices/appointmentsSlice";
import { getHour } from "../../utils/getHour";

export default function ModalFisa({ closeModal, appointment }) {
  const thead = ["nr", "cod", "serviciu/produs", "cantitate", "#"];
  const clienti = useSelector((state) => state.clienti);
  const angajati = useSelector((state) => state.angajati);
  const incasari = useSelector((state) => state.incasari);
  const [foundedEmployye, setFoundedEmployee] = useState(false);

<<<<<<< HEAD
=======
  useEffect(() => {
    if (appointment) {
      setDateFisa({
        codFisa: getCodFisa(),
        codClient: getCodClient(),
        numeClient: appointment.numeClient,
        data: appointment.data,
        codProgramare: appointment.cod,
        codAngajat: appointment.angajat,
        produse: [],
      });
    }
  }, [clienti, appointment]);

  useEffect(() => {
    if (appointment) {
      setFoundedEmployee(true);
    }
  }, [appointment]);
>>>>>>> 79ec3d295c8cd64433b12a84e32fc0531aa6f284

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchAllEmployees());
    dispatch(fetchAllSales());
    dispatch(fetchAllCustomers());
  }, [dispatch]);

  const getCodFisa = () => {
    if (clienti.length === 0) return "";

    if (appointment.client.startsWith("C0")) {
      const client = clienti.find(
        (client) => client.cod === appointment.client
      );

      if (client) {
        const nr = client.fise.length + 1;
        const paddedNr = nr.toString().padStart(3, "0");
        return "F" + paddedNr;
      }
    } else {
      const clientByName = clienti.find(
        (client) => `${client.nume} ${client.prenume}` === appointment.client
      );

      if (clientByName) {
        const nr = clientByName.fise.length + 1;
        const paddedNr = nr.toString().padStart(3, "0");
        return "F" + paddedNr;
      }
    }
    return "N/A";
  };

<<<<<<< HEAD


  let nrBon;
  const nr = bonuri.length + 1 + incasari.length;
  const paddedNr = nr.toString().padStart(6, "0");
  nrBon = paddedNr;

  const initialStateFisa = {
    codFisa: getCodFisa(),
    codClient: appointment ? appointment.client : "",
    numeClient: appointment ? appointment.numeClient : "",
    data: appointment ? appointment.data : "",
    codProgramare: appointment ? appointment.cod : "",
    codAngajat: appointment ? appointment.angajat : "",
=======
  const getCodClient = () => {
    if (clienti.length === 0) return "";

    const client = clienti.find((client) => client.cod === appointment.client);

    if (client) {
      return client.cod;
    } else {
      return "N/A";
    }
  };

  const initialStateFisa = {
    codFisa: "",
    codClient: "",
    numeClient: "",
    data: "",
    codProgramare: "",
    codAngajat: "",
>>>>>>> 79ec3d295c8cd64433b12a84e32fc0531aa6f284
    produse: [],
  };

  const [dateFisa, setDateFisa] = useState(initialStateFisa);

  const [openModalServicii, setOpenModalServicii] = useState(false);
  const handleOpenModalServicii = () => {
    setOpenModalServicii(!openModalServicii);
  };

  const [openModalProduse, setOpenModalProduse] = useState(false);
  const handleOpenModalProduse = () => {
    setOpenModalProduse(!openModalProduse);
  };

  const [openModalProduseExtra, setOpenModalProduseExtra] = useState(false);
  const [curentService, setCurrentService] = useState({});

  const handleOpenModalProduseExtra = (service) => {
    setOpenModalProduseExtra(!openModalProduseExtra);
    setCurrentService(service);
  };

  const handleChangeCantitate = (event, index) => {
    const { value } = event.target;

    const parsedValue = parseInt(value);

    const newCantitate = parsedValue < 0 ? 0 : parsedValue;

    const updatedServicii = [...dateFisa.produse];

    updatedServicii[index] = {
      ...updatedServicii[index],
      cantitate: newCantitate,
    };

    setDateFisa({
      ...dateFisa,
      produse: updatedServicii,
    });
  };

  const [totalFisa, setTotalFisa] = useState(0.0);

  useEffect(() => {
    const updatedServicii = dateFisa.produse.map((serviciu) => {
      let totalServiciu = 0;
      if (serviciu.produseExtra && serviciu.produseExtra.length !== 0) {
        totalServiciu = serviciu.produseExtra.reduce((acc, produs) => {
          const pret = parseFloat(produs.pret) || 0;
          const gramaj = parseInt(produs.gramaj) || 1;
          const cantitate = parseFloat(produs.cantitate) || 1;
          const totalProdus = (pret / gramaj) * cantitate;
          return acc + totalProdus;
        }, 0);
      }

      if (serviciu.cantitate !== undefined) {
        totalServiciu +=
          parseFloat(serviciu.pret) * parseInt(serviciu.cantitate);
      }

      return {
        ...serviciu,
        totalServiciu: totalServiciu.toFixed(2),
      };
    });

    const totalGeneral = updatedServicii.reduce((acc, serviciu) => {
      return acc + parseFloat(serviciu.totalServiciu);
    }, 0.0);

    setTotalFisa(parseFloat(totalGeneral.toFixed(2)));
  }, [dateFisa]);

  const handleRemoveItem = (service) => {
    setDateFisa((prevFisa) => {
      const updatedServicii = prevFisa.produse.filter(
        (s) => s.cod !== service.cod
      );

      const renumberedServicii = updatedServicii.map((s, index) => ({
        ...s,
        nr: index + 1,
      }));

      return {
        ...prevFisa,
        produse: renumberedServicii,
      };
    });
  };

  let nrIncasare;
  const nr = incasari.length + 1;
  const paddedNr = nr.toString().padStart(6, "0");
  nrIncasare = paddedNr;

  const handleInregistreaza = (e) => {
    e.preventDefault();
    dispatch(
      addNewSale({
        ...dateFisa,
        nr: nrIncasare,
        totalDePlata: totalFisa,
        data: getDate(),
      })
    );

    const newApp = {
      ...appointment,
      status: "Terminat",
      tip_update: "Modificare status",
      data_update: getDate(),
      ora_update: getHour(),
    };

    delete newApp._id;
    delete newApp.start;
    delete newApp.end;
    delete newApp.list;
    dispatch(updateAppointment(newApp));
    closeModal();
  };

  const searchEmployee = (value) => {
    return angajati.find((angajat) => angajat.cod === value);
  };

  const handleChangeAngajat = (e) => {
    const { name, value } = e.target;
    if (name === "codAngajat") {
      const angajat = searchEmployee(value);

      if (angajat) {
        setDateFisa({
          ...dateFisa,
          [name]: value,
        });
        setFoundedEmployee(true);
      } else {
        setDateFisa({
          ...dateFisa,
          [name]: value,
        });
        setFoundedEmployee(false);
      }
    } else {
      return;
    }
  };

  const setPlaceholder = (key) => {
    let label;
    if (key === "codAngajat") {
      label = "Cod angajat";
    }

    if (key === "numeClient") {
      label = "Nume client";
    }

    if (key === "codClient") {
      label = "Cod client";
    }

    if (key === "codFisa") {
      label = "Numar fisa";
    }

    return label;
  };

  const headerFieldOrder = ["codAngajat", "numeClient", "codClient", "codFisa"];
  const tableFieldOrder = ["nr", "cod", "descriere", "produs"];
  return (
    <div className="modal-fisa-overlay">
      <div className="modal-fisa-content">
        <div className="modal-header">
          {headerFieldOrder.map((key) => {
            if (dateFisa.hasOwnProperty(key)) {
              return (
                <div key={key} className="info">
                  <label htmlFor={key}>{setPlaceholder(key)}</label>
                  <Input
                    type="text"
                    disabled={appointment || key !== "codAngajat"}
                    placeholder={key}
                    value={dateFisa[key]}
                    name={key}
                    onChange={handleChangeAngajat}
                  />
                </div>
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
              onClick={handleOpenModalServicii}
              disabled={!foundedEmployye}
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
                {dateFisa.produse.map((service, index) => {
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
                          type="number"
                          name="cantitate"
                          className="small"
                          onChange={(e) => handleChangeCantitate(e, index)}
                          autoComplete="off"
                          value={service.cantitate}
                        />
                      </td>
                      <td
                        key={"add-produse"}
                        style={{
                          height: "inherit",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-around",
                          }}
                        >
                          {service.cod.startsWith("S") && (
                            <FaSlidersH
                              size={21}
                              style={{ cursor: "pointer" }}
                              onClick={() =>
                                handleOpenModalProduseExtra(service)
                              }
                            />
                          )}
                          <FaTrash
                            size={21}
                            style={{ cursor: "pointer" }}
                            onClick={() => handleRemoveItem(service)}
                          />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          </div>
        </div>
        <div className="total">
          <Input type="text" name="total" value={totalFisa} disabled />
        </div>
        <div className="modal-control-buttons">
          <Button
            variant="contained"
            color="success"
            onClick={(e) => handleInregistreaza(e)}
            disabled={
              dateFisa.produse.length === 0 ||
              !dateFisa.produse.every(
                (produs) =>
                  produs.hasOwnProperty("cantitate") && produs.cantitate !== ""
              )
            }
          >
            Inregistreaza
          </Button>
          <Button variant="contained" color="info" onClick={closeModal}>
            Close
          </Button>
        </div>
        {openModalServicii && (
          <ModalServicii
            closeModal={handleOpenModalServicii}
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
        {openModalProduseExtra && (
          <ModalProduseExtra
            closeModal={handleOpenModalProduseExtra}
            service={curentService}
            dateFisa={dateFisa}
            setDateFisa={setDateFisa}
          />
        )}
      </div>
    </div>
  );
}
