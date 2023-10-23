import { Route, Routes } from "react-router-dom";
import "./App.css";
import Header from "./components/Header/Header";
import MainMenu from "./components/main-manu/MainMenu";
import PagePreview from "./components/PagePreview/PagePreview";
import EmployeesList from "./pages/angajati/EmployeesList";
import ServicesList from "./pages/servicii/ServicesList";
import Inventory from "./pages/stocuri/Inventory";
import Customers from "./pages/clienti/Customers";
import Appointments from "./pages/programari/Appointments";
import Sales from "./pages/incasari/Sales";
import Invoices from "./pages/facturi/Invoices";
import CashRegister from "./pages/casa/CashRegister";
import Dashboard from "./pages/dashboard/Dashboard";
import Echipament from "./pages/echipament/Echipament";


function App() {
  return (
    <div className="App" onContextMenu={(e) => e.preventDefault()}>
      <div className="app-container">
        <Header className="header" name="Studio Nymphaea" />
        <PagePreview className="page-preview">
          <MainMenu />
          <Routes>
            <Route path="/angajati" element={<EmployeesList />}></Route>
            <Route path="/servicii" element={<ServicesList />}></Route>
            <Route path="/stocuri" element={<Inventory />}></Route>
            <Route path="/clienti" element={<Customers />}></Route>
            <Route path="/programari" element={<Appointments />}></Route>
            <Route path="/incasari" element={<Sales />}></Route>
            <Route path="/cheltuieli" element={<Invoices />}></Route>
            <Route path="/casa" element={<CashRegister />}></Route>
            <Route path="/" element={<Dashboard />}></Route>
            <Route path="/dashboard" element={<Dashboard />}></Route>
            <Route path="/echipament" element={<Echipament />}></Route>
          </Routes>
        </PagePreview>
      </div>
    </div>
  );
}

export default App;
