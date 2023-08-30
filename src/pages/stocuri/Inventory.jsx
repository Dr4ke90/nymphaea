import React from 'react'
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router';
import TableDisplay from '../../components/table-display/TableDisplay';
import './inventory.css'


export default function Inventory() {
  const thead = ["nr", "categorie", "brand", "produs","cantitate"];
  const employees = useSelector((state) => state.stocuri);
  const location = useLocation();
  const title = location.pathname.substring(1,2).toUpperCase() + location.pathname.substring(1).slice(1)

  return (
    <div className="inventory-page">
      <div className="title">
        <h2>{title}</h2>
      </div>
      <TableDisplay thead={thead} tbody={employees} removeItem={null} />
    </div>
  )
}
