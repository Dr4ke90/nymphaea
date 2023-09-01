import React, { useState } from 'react'
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router';
import TableDisplay from '../../components/table-display/TableDisplay';
import { Button } from '@mui/material';
import './appointments.css'
import FormAppointment from './FormAppointments/FormAppointments';


export default function Appointments() {
  const thead = ["nr", "data", "ora", "timp", "client", 'programat la', "#" ];
  const employees = useSelector((state) => state.servicii);
  const location = useLocation();
  const title = location.pathname.substring(1,2).toUpperCase() + location.pathname.substring(1).slice(1)
  const [modal,setModal] = useState(false)

  const toggleModal =() => {
    setModal(!modal)
  }

  return (
    <div className="appointments-page">
      <div className="title">
        <Button variant="outlined" onClick={toggleModal}>Adauga</Button>
        <h2>{title}</h2>
      </div>
      {modal && <FormAppointment  closeModal={toggleModal}/>}
      <TableDisplay thead={thead} tbody={employees} removeItem={null} />
    </div>
  )
}
