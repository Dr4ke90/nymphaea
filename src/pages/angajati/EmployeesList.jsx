import React, { useEffect, useState } from "react";
import TableDisplay from "../../components/table-display/TableDisplay";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteEmployee,
  fetchAllEmployees,
} from "../../redux/slices/employeesSlice";
import { Button } from "@mui/material";
import { useLocation } from "react-router";
import "./employeesList.css";
import FormEmployees from "./form-angajati/FormEmployees";

export default function EmployeesList() {
  const thead = ["cod", "nume", "prenume", "telefon", "functie", "programari"];
  const employees = useSelector((state) => state.angajati);
  const location = useLocation();
  const name =
    location.pathname.substring(1, 2).toUpperCase() +
    location.pathname.substring(1).slice(1);
  const [modal, setModal] = useState(false);
  const [receivedEmployee, setReceivedEmployee] = useState(null);

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchAllEmployees());
  }, [dispatch]);

  const toggleModal = () => {
    setModal(!modal);
  };

  let code = 0;
  if (employees.length !== 0) {
    const nr = parseInt(employees[employees.length - 1].cod) + 1;
    const paddedNr = nr.toString().padStart(3, "0");
    code = paddedNr;
  } else {
    const nr = employees.length + 1;
    const paddedNr = nr.toString().padStart(3, "0");
    code = paddedNr;
  }

  const handleDeleteEmployee = (item) => {
    const confirm = window.confirm(
      `Esti sigur ca vrei sa stergi Angajatul ${item.cod}`
    );
    if (!confirm) return;
    dispatch(deleteEmployee(item));
  };

  const handleEditEmployee = (item) => {
    setReceivedEmployee(item)
    setModal(true)
  };

  return (
    <div className="employees-page">
      <div className="title">
        <Button variant="outlined" onClick={toggleModal}>
          Adauga
        </Button>
        <h2>{name}</h2>
      </div>
      {modal && <FormEmployees closeModal={toggleModal} cod={code} item={receivedEmployee} setItem={setReceivedEmployee}/>}
      <TableDisplay
        thead={thead}
        tbody={employees}
        removeItem={handleDeleteEmployee}
        editItem={handleEditEmployee}
      />
    </div>
  );
}
