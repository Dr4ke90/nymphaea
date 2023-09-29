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
import ModalReteta from "../ModalReteta/ModalReteta";
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

  console.log(bonuri);

  let nrBon;
  const nr = bonuri.length + 1 + incasari.length;
  const paddedNr = nr.toString().padStart(6, "0");
  nrBon = paddedNr;

  const initialStateFisa = {
    codFisa: getCodFisa(),
    codClient: appointment ? appointment.client : "",
    numeClient: appointment ? appointment.numeClient : "",
    data: appointment ? appointment.data : "",
    codProgramare: appointment ? appointment.nr : "",
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
    const updatedServicii = [...dateFisa.produse];
    updatedServicii[index].cantitateUtilizata = value;
    setDateFisa({
      ...dateFisa,
      produse: updatedServicii,
    });
  };

  const [totalFisa, setTotalFisa] = useState(0.0);

  useEffect(() => {
    const updatedServicii = dateFisa.produse.map((serviciu) => {
      if (serviciu.reteta && serviciu.reteta.length !== 0) {
        const totalReteta = serviciu.reteta.reduce((acc, produs) => {
          const pret = parseFloat(produs.pret);
          const gramaj = parseInt(produs.gramaj);
          const cantitate = parseFloat(produs.cantitateUtilizata);

          if (!isNaN(pret) && !isNaN(gramaj) && !isNaN(cantitate)) {
            const totalProdus = (pret / gramaj) * cantitate;
            return acc + totalProdus;
          } else {
            return acc;
          }
        }, 0);

        serviciu.totalServiciu =
          (parseFloat(serviciu.pret) + totalReteta) *
          serviciu.cantitateUtilizata;
      } else {
        serviciu.totalServiciu =
          parseFloat(serviciu.pret) * parseInt(serviciu.cantitateUtilizata);
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

  const handleChangeAngajat = (e) => {
    const { name, value } = e.target;
    if (name === "codAngajat") {
      const angajat = angajati.find((angajat) => angajat.cod === value);

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
                  disabled={appointment || key !== "codAngajat"}
                  placeHolder={key}
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
              onClick={handleModalServicii}
              disabled={dateFisa.codAngajat === "" || !foundedEmployye}
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
                          name="cantitateUtilizata"
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
                        {service.reteta && (
                          <FaSlidersH
                            size={21}
                            style={{ cursor: "pointer" }}
                            onClick={() => handleOpenModalReteta(service)}
                          />
                        )}

                        <FaTrash
                          size={21}
                          style={{ cursor: "pointer" }}
                          onClick={() => handleRemoveItem(service)}
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
                  produs.hasOwnProperty("cantitateUtilizata") &&
                  produs.cantitateUtilizata !== ""
              )
            }
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
            dateFisa={dateFisa}
            setDateFisa={setDateFisa}
          />
        )}
      </div>
    </div>
  );
}
