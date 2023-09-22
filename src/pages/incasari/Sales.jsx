import TableDisplay from "../../components/table-display/TableDisplay";
import { useLocation } from "react-router";
import './sales.css'
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { fetchAllSales } from "../../redux/slices/salesSlice";

export default function Sales() {
  const thead = ["nrBon", "data", "codAngajat", "totalDePlata", "incasat", "rest"];
  const location = useLocation();
  const name = location.pathname.substring(1,2).toUpperCase() + location.pathname.substring(1).slice(1)
  const incasari = useSelector(state => state.incasari)

  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(fetchAllSales())
  },[dispatch])

  return (
    <div className="sales-page">
      <div className="title">
        <h2>{name}</h2>
      </div>
      <TableDisplay thead={thead} tbody={incasari} listOrder={thead} />
    </div>
  );
}
