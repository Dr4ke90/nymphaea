import React from 'react'
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router';
import TableDisplay from '../../components/table-display/TableDisplay';
import { Button } from '@mui/material';
import './invoices.css'


export default function Invoices() {
  const thead = ["nr", "data", "serie", "numar", "valoare"];
  const employees = useSelector((state) => state.facturi);
  const location = useLocation();
  const title = location.pathname.substring(1,2).toUpperCase() + location.pathname.substring(1).slice(1)

  return (
    <div className="invoices-page">
      <div className="title">
        <Button variant="outlined">Adauga</Button>
        <h2>{title}</h2>
      </div>
      <TableDisplay thead={thead} tbody={employees} removeItem={null} />
    </div>
  )
}
