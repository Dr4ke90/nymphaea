import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router";
import TableDisplay from "../../components/table-display/TableDisplay";
import { Button } from "@mui/material";
import "./appointments.css";
import FormAppointment from "./FormAppointments/FormAppointments";
import {
  fetchAllAppointments,
  updateAppointment,
} from "../../redux/slices/appointmentsSlice";
import PagePreview from "../../components/PagePreview/PagePreview";
import ModalFisa from "../../components/ModalFisa/ModalFisa";
import { getHour } from "../../utils/getHour";

export default function Appointments() {
  const thead = [
    "cod",
    "data",
    "ora",
    "timp",
    "numeClient",
    "numeAngajat",
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
  const cod = appointments.length + 1;
  const paddedNr = cod.toString().padStart(3, "0");
  code = "A" + paddedNr;

  const toggleModal = () => {
    setModal(!modal);
  };

  const toggleModalFisa = () => {
    setModalFisa(!modalFisa);
  };

  const handleEditAppointment = (item) => {
    setReceivedAppointemnt(item);
    setModal(true);
  };

  const handleStartAppointment = (item) => {
    const status = "In curs";
    const tip_update = `Modificare status: ${status}`;
    dispatch(
      updateAppointment({
        ...item,
        status: status,
        tip_update: tip_update,
        inceput: getHour(),
      })
    );
  };

  const handleCancelAppointment = (item) => {
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
    setCurrentAppointment(item);

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
        editItem={handleEditAppointment}
        cancel={handleCancelAppointment}
        finish={handleFinishAppointment}
        start={handleStartAppointment}
        listOrder={thead}
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
