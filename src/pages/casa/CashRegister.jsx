import TableDisplay from "../../components/table-display/TableDisplay";
import { Button } from "@mui/material";
import { useLocation } from "react-router";
import "./cashRegister.css";
import Keyboard from "../../components/Keyboard/Keyboard";

export default function CashRegister() {
  const thead = ["bon", "data", "creat", "valoare", "#"];
  const location = useLocation();
  const name =
    location.pathname.substring(1, 2).toUpperCase() +
    location.pathname.substring(1).slice(1);

  return (
    <div className="cash-page">
      <div className="title">
        <Button variant="contained" color="info">
          Creaza
        </Button>
        <h2>{name}</h2>
      </div>
      <div className="cash-page-wrapper">
        <TableDisplay thead={thead} tbody={null} removeItem={null} />
        <div>
          <Keyboard />
          <div className="buttons-wrapper">
            <Button variant="contained" color="info">
              Servicii
            </Button>
            <Button variant="contained" color="info">
              Produse
            </Button>
            <Button variant="contained" color="info">
              Oferte
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
