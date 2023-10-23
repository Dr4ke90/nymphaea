import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router";
import "./echipament.css";
import TableDisplay from "../../components/table-display/TableDisplay";

import { fetchAllEquipment } from "../../redux/slices/echipamentSlice";

export default function Echipament() {
  const thead = [
    "cod",
    "descriere",
    "model",
    "stoc",
    "pretFaraTva",
    "pret",
    "pretAchizitie",
  ];
  const echipament = useSelector((state) => state.echipament);
  const location = useLocation();
  const title =
    location.pathname.substring(1, 2).toUpperCase() +
    location.pathname.substring(1).slice(1);

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchAllEquipment());
  }, [dispatch]);


  return (
    <div className="equipment-page">
      <div className="title">
        <h2>{title}</h2>
      </div>
      <TableDisplay
        thead={thead}
        tbody={echipament}
        listOrder={thead}
      />
    </div>
  );
}
