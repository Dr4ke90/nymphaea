import React, {useEffect} from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router';
import TableDisplay from '../../components/table-display/TableDisplay';
import './inventory.css'
import { fetchAllInventory } from '../../redux/slices/inventorySlice';


export default function Inventory() {
  const thead = ["nr", "categorie", "brand", "produs","cantitate", "pret (BUC)", "gr/buc"];
  const inventory = useSelector((state) => state.stocuri);
  const location = useLocation();
  const title = location.pathname.substring(1,2).toUpperCase() + location.pathname.substring(1).slice(1)

  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(fetchAllInventory());
  }, [dispatch]);

  
  return (
    <div className="inventory-page">
      <div className="title">
        <h2>{title}</h2>
      </div>
      <TableDisplay thead={thead} tbody={inventory} />
    </div>
  )
}
