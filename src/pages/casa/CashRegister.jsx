import React, { useEffect } from "react";
import TableDisplay from "../../components/table-display/TableDisplay";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllEmployees } from "../../redux/slices/employeesSlice";
import { Button } from "@mui/material";
import { useLocation } from "react-router";
import './cashRegister.css'

export default function CashRegister() {
  const thead = ["cod", "nume", "prenume", "telefon", "functie"];
  const employees = useSelector((state) => state.angajati);
  const location = useLocation();
  const name = location.pathname.substring(1,2).toUpperCase() + location.pathname.substring(1).slice(1)

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchAllEmployees());
  }, [dispatch]);

  return (
    <div className="cash-page">
      <div className="title">
        <Button variant="outlined">Creeaza</Button>
        <h2>{name}</h2>
      </div>
      <TableDisplay thead={thead} tbody={employees} removeItem={null} />
    </div>
  );
}
