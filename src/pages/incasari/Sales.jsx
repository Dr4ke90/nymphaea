import TableDisplay from "../../components/table-display/TableDisplay";
import { useLocation } from "react-router";
import './sales.css'

export default function Sales() {
  const thead = ["bon", "data", "creat", "valoare", "#"];
  const location = useLocation();
  const name = location.pathname.substring(1,2).toUpperCase() + location.pathname.substring(1).slice(1)


  return (
    <div className="sales-page">
      <div className="title">
        <h2>{name}</h2>
      </div>
      <TableDisplay thead={thead} tbody={null} removeItem={null} />
    </div>
  );
}
