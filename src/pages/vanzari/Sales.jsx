import React from 'react'
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router';
import TableDisplay from '../../components/table-display/TableDisplay';
import './sales.css'


export default function Sales() {
  const thead = ["nr","data", "ora", "bon", "valoare", "client", "angajat"];
  const employees = useSelector((state) => state.stocuri);
  const location = useLocation();
  const title = location.pathname.substring(1,2).toUpperCase() + location.pathname.substring(1).slice(1)

  return (
    <div className="sales-page">
      <div className="title">
        <h2>{title}</h2>
      </div>
      <TableDisplay thead={thead} tbody={employees} removeItem={null} />
    </div>
  )
}
