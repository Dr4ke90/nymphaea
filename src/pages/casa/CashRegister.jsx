import { Button } from "@mui/material";
import { useLocation } from "react-router";
import "./cashRegister.css";
import Keyboard from "../../components/Keyboard/Keyboard";
import ListaBonuriCasa from "../../components/ListaBonuriCasa/ListaBonuriCasa";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllReceipes } from "../../redux/slices/cashRegisterSlice";
import Thead from "../../components/t-head/TableHead";
import Table from "../../components/Table/Table";
import Input from "../../components/Input/Input";
import { addNewSale } from "../../redux/slices/salesSlice";

export default function CashRegister() {
  const thead = ["nr", "cod", "serv/produs", "cantitate", "pret", "total"];
  const location = useLocation();
  const name =
    location.pathname.substring(1, 2).toUpperCase() +
    location.pathname.substring(1).slice(1);
  const bonuri = useSelector((state) => state.casa);

  const [bonCurent, setBonCurrent] = useState({});
  const [input, setInput] = useState("");

  useEffect(() => {
    setBonCurrent((prevBon) => {
      return {
        ...prevBon,
        incasat: input,
        rest: input !== "" ? input - prevBon.totalDePlata : "",
      };
    });
  },[input]);


  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchAllReceipes());
  },[dispatch]);

  const handleButtonClick = (value) => {
    setInput(input + value);
  };

  const handleResetInput = () => {
    setInput("");
  };

  const handleSetBonCurrent = (bon) => {
    const boncurent = bonuri.find((b) => b.nrBon === bon.nrBon)
    setBonCurrent({
      ...boncurent,
      incasat: "",
      rest: ""
    });
    setInput("");
  };

  const handleIncaseaza = () => {
    dispatch(addNewSale(bonCurent))
    setInput("");
  };

  const handleChangeInputnIncasat = (e) => {
    e.preventDefault();
    const { value } = e.target;
    setInput(value);
  };

  const handleTenPercentButton = () => {
    setBonCurrent((prevBon) => {
      const reducere = 0.1; 
      const totalRedus = prevBon.totalDePlata * (1 - reducere); 
  
      const updateBon = {
        ...prevBon,
        totalDePlata: totalRedus,
        reducere: "10%",
      };
  
      return updateBon;
    });
  };

  const cashDisplay = ["totalDePlata", "incasat", "rest"]

  return (
    <div className="cash-page">
      <div className="title">
        <Button variant="contained" color="info">
          Creaza
        </Button>
        <h2>{name}</h2>
      </div>
      <div className="cash-page-wrapper">
        <ListaBonuriCasa bonuri={bonuri} setBonCurrent={handleSetBonCurrent} />
        <div className="table-wrapper">
          <div className="table-container">
            <Table>
              <Thead thead={thead} />
              <tbody>
                {bonCurent.produse?.map((item) => {
                  const listOrder = [
                    "nr",
                    "cod",
                    "tip",
                    "cantitateUtilizata",
                    "pret",
                    "totalServiciu",
                  ];

                  return (
                    <tr key={item.cod}>
                      {listOrder.map((key) => {
                        const value = item[key];
                        return (
                          <td key={key} id={key}>
                            {value}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          </div>
          <div className="cash-display-wrapper">
            {cashDisplay.map((key) => {
              return (
                <div key={key} className="cash-display">
                  <span>{key.charAt(0).toUpperCase() + key.slice(1)} = </span>
                  <span style={{ fontSize: "30px" }} className="span2">
                    {bonCurent[key]}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
        <div>
          <div className="wrapper-suma">
            <Input
              type="text"
              className="suma"
              placeholder="Suma primita"
              value={input}
              onChange={(e) => handleChangeInputnIncasat(e)}
            />
            <Button
              variant="contained"
              color="success"
              onClick={() => handleIncaseaza()}
            >
              Incaseaza
            </Button>
          </div>
          <Keyboard setInput={handleButtonClick} reset={handleResetInput} />
          <div className="buttons-wrapper">
            <Button
              variant="contained"
              color="info"
              onClick={() => handleTenPercentButton()}
            >
              10%
            </Button>
            <Button variant="contained" color="info">
              25%
            </Button>
            <Button variant="contained" color="info">
              50%
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
