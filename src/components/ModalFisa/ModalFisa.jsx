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
import {
  addRceceipe,
  fetchAllReceipes,
} from "../../redux/slices/cashRegisterSlice";
import { updateAppointment } from "../../redux/slices/appointmentsSlice";
import { getHour } from "../../utils/getHour";
import { fetchAllEmployees } from "../../redux/slices/employeesSlice";
import { getDate } from "../../utils/getDate";
import { fetchAllSales } from "../../redux/slices/salesSlice";

export default function ModalFisa({ closeModal, appointment }) {
  const thead = ["nr", "cod", "serviciu/produs", "cantitate", "#"];
  const clienti = useSelector((state) => state.clienti);
  const bonuri = useSelector((state) => state.casa);
  const angajati = useSelector((state) => state.angajati);
  const incasari = useSelector((state) => state.incasari);
  const [foundedEmployye, setFoundedEmployee] = useState(false);

 


  const getCodFisa = () => {
    if (clienti.length === 0 || !appointment) return "";

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
    return "";
  };

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
    produse: [],
  };

  const [dateFisa, setDateFisa] = useState(initialStateFisa);

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchAllCustomers());
    dispatch(fetchAllReceipes());
    dispatch(fetchAllEmployees());
    dispatch(fetchAllSales());
  }, [dispatch]);

  useEffect(() => {
    if (appointment) {
      setFoundedEmployee(true);
    }
  }, [appointment]);

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
    const updatedServicii = [...dateFisa.produse];
    updatedServicii[index].cantitate = value;
    setDateFisa({
      ...dateFisa,
      produse: updatedServicii,
    });
  };

  const [totalFisa, setTotalFisa] = useState(0.0);

  useEffect(() => {
    const updatedServicii = dateFisa.produse.map((serviciu) => {
      if (serviciu.produseExtra && serviciu.produseExtra.length !== 0) {
        const totalProduseExtra = serviciu.produseExtra.reduce(
          (acc, produs) => {
            const pret = parseFloat(produs.pret);
            const gramaj = parseInt(produs.gramaj);
            const cantitate = parseFloat(produs.cantitate);

            if (!isNaN(pret) && !isNaN(gramaj) && !isNaN(cantitate)) {
              const totalProdus = (pret / gramaj) * cantitate;
              return (acc + totalProdus).toFixed(2);
            } else {
              return acc;
            }
          },
          0
        );

        serviciu.totalServiciu =
          ((parseFloat(serviciu.pret) + totalProduseExtra) * serviciu.cantitate).toFixed(2);
      } else {
        serviciu.totalServiciu =
         ( parseFloat(serviciu.pret) * parseInt(serviciu.cantitate)).toFixed(2);
      }
      return serviciu;
    });

    const totalGeneral = updatedServicii.reduce((acc, serviciu) => {
      return acc + (parseFloat(serviciu.totalServiciu) || 0.0);
    }, 0.0);

    setTotalFisa(parseFloat(totalGeneral.toFixed(2)));
  }, [dateFisa.produse]);

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

  const handleInregistreaza = (e) => {
    e.preventDefault();
    dispatch(
      addRceceipe({
        nrBon: nrBon,
        ...dateFisa,
        totalDePlata: totalFisa,
        data: getDate(),
      })
    );
    dispatch(
      updateAppointment({
        ...appointment,
        status: "Terminat",
        tip_update: "Modificare status: Terminat",
        terminat: getHour(),
      })
    );
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

  const headerFieldOrder = ["codAngajat", "numeClient", "codClient", "codFisa"];
  const tableFieldOrder = ["nr", "cod", "descriere", "produs"];
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
                  disabled={appointment || key !== "codAngajat"}
                  placeholder={key}
                  value={dateFisa[key]}
                  name={key}
                  onChange={handleChangeAngajat}
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
