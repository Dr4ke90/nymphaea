import React, { useEffect } from "react";
import "./dashboard.css";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllSales } from "../../redux/slices/salesSlice";
import { fetchAllInvoices } from "../../redux/slices/invoicesSlice";
import SalesChart from "../../components/SalesChart/SalesChart";
import { useLocation } from "react-router";
import InvoicesChart from "../../components/InvoicesChart/InvoicesChart";
import { fetchAllAppointments } from "../../redux/slices/appointmentsSlice";
import AppointmentsChart from "../../components/AppointmentsChart/AppointmentsChart";
import { fetchAllInventory } from "../../redux/slices/inventorySlice";
import { fetchAllEquipment } from "../../redux/slices/echipamentSlice";
import { fetchAllServices } from "../../redux/slices/servicesSlice";
import InventoryChart from "../../components/InventoryChart/InventoryChart";
import ProductsChart from "../../components/ProductsChart/ProductsChart";
import LossChart from "../../components/LossChart/LossChart";

export default function Dashboard() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchAllSales());
    dispatch(fetchAllInvoices());
    dispatch(fetchAllAppointments());
    dispatch(fetchAllInventory());
    dispatch(fetchAllEquipment());
    dispatch(fetchAllServices());
  }, [dispatch]);

  const location = useLocation();
  const name =
    location.pathname.substring(1, 2).toUpperCase() +
    location.pathname.substring(1).slice(1);
  const sales = useSelector((state) => state.incasari);
  const invoices = useSelector((state) => state.facturi);
  const appointments = useSelector((state) => state.programari);
  const produse = useSelector((state) => state.stocuri);
  const echipament = useSelector((state) => state.echipament);
  const servicii = useSelector((state) => state.servicii);


  return (
    <div className="dashboard-page">
      <div className="title">
        <h2>{name}</h2>
      </div>
      <hr />
      <div className="charts-wrapper">
        <div className="up">
          <SalesChart sales={sales} />
          <div className="invoicesChart">
            <InvoicesChart invoices={invoices} />
          </div>
          <LossChart />
        </div>
        <hr />
        <div className="down">
          <AppointmentsChart appointments={appointments} />
          <InventoryChart
            produse={produse}
            servicii={servicii}
            echipament={echipament}
          />
          <ProductsChart produse={produse} />
        </div>
      </div>
    </div>
  );
}
