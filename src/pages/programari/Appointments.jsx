import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router";
import TableDisplay from "../../components/table-display/TableDisplay";
import { Button } from "@mui/material";
import "./appointments.css";
import FormAppointment from "./FormAppointments/FormAppointments";
import {
  deleteAppointment,
  fetchAllAppointments,
  updateAppointment,
} from "../../redux/slices/appointmentsSlice";
import PagePreview from "../../components/PagePreview/PagePreview";
import ModalFisa from "../../components/ModalFisa/ModalFisa";

export default function Appointments() {
  const thead = [
    "nr",
    "data",
    "ora",
    "timp (ore)",
    "client",
    "programat la",
    "status",
    "#",
  ];
  const location = useLocation();
  const title =
    location.pathname.substring(1, 2).toUpperCase() +
    location.pathname.substring(1).slice(1);
  const [modal, setModal] = useState(false);
  const [modalFisa, setModalFisa] = useState(false);
  const [receivedAppointemnt, setReceivedAppointemnt] = useState(null);
  const appointments = useSelector((state) => state.programari);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const ora = new Date().toLocaleTimeString("ro", "RO");
  const [currentAppointment, setCurrentAppointment] = useState({});

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchAllAppointments());
  }, [dispatch]);

  useEffect(() => {
    setFilteredAppointments(
      appointments.filter((item) => item.status === "Activ")
    );
  }, [appointments]);

  let code = 0;
  const nr = appointments.length + 1;
  const paddedNr = nr.toString().padStart(3, "0");
  code = "A" + paddedNr;

  const toggleModal = () => {
    setModal(!modal);
  };

  const toggleModalFisa = () => {
    setModalFisa(!modalFisa);
  };

  const handleDeleteAppointment = (item) => {
    const confirm = window.confirm(
      `Esti sigur ca vrei sa stergi Programarea ${item.nr}`
    );
    if (!confirm) return;
    dispatch(deleteAppointment(item));
  };

  const handleEditAppointment = (item) => {
    setReceivedAppointemnt(item);
    setModal(true);
  };

  const handleStartAppointment = (item) => {
    const confirm = window.confirm(
      `Incepi Programarea ${item.nr} - ${item.client} ??`
    );
    if (!confirm) return;
    const status = "In curs";
    const tip_update = `Modificare status: ${status}`;
    dispatch(
      updateAppointment({
        ...item,
        status: status,
        tip_update: tip_update,
        inceput: ora,
      })
    );
  };

  const handleCancelAppointment = (item) => {
    const confirm = window.confirm(
      `Esti sigur ca vrei sa anulezi Programarea ${item.nr} - ${item.client}`
    );
    if (!confirm) return;
    const status = "Anulat";
    const tip_update = `Modificare status: ${status}`;
    dispatch(
      updateAppointment({
        ...item,
        status: status,
        tip_update: tip_update,
      })
    );
  };

  const handleFinishAppointment = (item) => {
    const confirm = window.confirm(
      `Ai terminat Programarea ${item.nr} - ${item.numeClient}??`
    );
    if (!confirm) return;
    setCurrentAppointment(item);
    // const status = "Terminat";
    // const tip_update = `Modificare status: ${status}`;
    // dispatch(
    //   updateAppointment({
    //     ...item,
    //     status: status,
    //     tip_update: tip_update,
    //     terminat: ora,
    //   })
    // );
    toggleModalFisa();
  };

  const handleFilterAll = () => {
    setFilteredAppointments(appointments);
  };

  const handleFilterActive = () => {
    setFilteredAppointments(
      appointments.filter((item) => item.status === "Activ")
    );
  };

  const handleFilterInCurs = () => {
    setFilteredAppointments(
      appointments.filter((item) => item.status === "In curs")
    );
  };

  const handleFilterCancel = () => {
    setFilteredAppointments(
      appointments.filter((item) => item.status === "Anulat")
    );
  };

  return (
    <div className="appointments-page">
      <div className="title">
        <Button variant="contained" color="info" onClick={toggleModal}>
          Adauga
        </Button>

        <h2>{title}</h2>
        <PagePreview className="buttons-wrapper">
          <Button variant="outlined" onClick={handleFilterActive}>
            Active
          </Button>
          <Button variant="outlined" onClick={handleFilterInCurs}>
            In curs
          </Button>
          <Button variant="outlined" onClick={handleFilterCancel}>
            Anulate
          </Button>
          <Button variant="outlined" onClick={handleFilterAll}>
            Toate
          </Button>
        </PagePreview>
      </div>
      {modal && (
        <FormAppointment
          closeModal={toggleModal}
          cod={code}
          item={receivedAppointemnt}
          setItem={setReceivedAppointemnt}
        />
      )}
      <TableDisplay
        thead={thead}
        tbody={filteredAppointments}
        removeItem={handleDeleteAppointment}
        editItem={handleEditAppointment}
        cancel={handleCancelAppointment}
        finish={handleFinishAppointment}
        start={handleStartAppointment}
      />

      {modalFisa && (
        <ModalFisa
          closeModal={toggleModalFisa}
          appointment={currentAppointment}
        />
      )}
    </div>
  );
}
