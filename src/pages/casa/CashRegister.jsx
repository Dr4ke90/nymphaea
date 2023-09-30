import { Button } from "@mui/material";
import { useLocation } from "react-router";
import "./cashRegister.css";
import Keyboard from "../../components/Keyboard/Keyboard";
import ListaBonuriCasa from "../../components/ListaBonuriCasa/ListaBonuriCasa";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteReceipe,
  fetchAllReceipes,
} from "../../redux/slices/cashRegisterSlice";
import Thead from "../../components/t-head/TableHead";
import Table from "../../components/Table/Table";
import Input from "../../components/Input/Input";
import ModalFisa from "../../components/ModalFisa/ModalFisa";
import { addNewSale } from "../../redux/slices/salesSlice";
import { getHour } from "../../utils/getHour";
import { updateInventoryRecursively } from "../../redux/slices/inventorySlice";

export default function CashRegister() {
  const thead = ["nr", "cod", "serv/produs", "cantitate", "pret", "total"];
  const location = useLocation();
  const name =
    location.pathname.substring(1, 2).toUpperCase() +
    location.pathname.substring(1).slice(1);
  const bonuri = useSelector((state) => state.casa);
  const [openModalFisa, setOpenModalFisa] = useState(false);
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
  }, [input]);

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchAllReceipes());
  }, [dispatch]);

  const handleButtonClick = (value) => {
    setInput(input + value);
  };

  const handleResetInput = () => {
    setInput("");
  };

  const handleSetBonCurrent = (bon) => {
    const boncurent = bonuri.find((b) => b.nrBon === bon.nrBon);
    setBonCurrent({
      ...boncurent,
      incasat: "",
      rest: "",
    });
    setInput("");
  };

  const handleIncaseaza = () => {
    dispatch(
      addNewSale({
        ...bonCurent,
        oraIncasarii: getHour(),
      })
    );
    dispatch(deleteReceipe(bonCurent));
    dispatch(updateInventoryRecursively(bonCurent));
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

  const cashDisplay = ["totalDePlata", "incasat", "rest"];

  const handleOpenModalFisa = () => {
    setOpenModalFisa(!openModalFisa);
  };

  return (
    <div className="cash-page">
      {openModalFisa && <ModalFisa closeModal={handleOpenModalFisa} />}
      <div className="title">
        <Button variant="contained" color="info" onClick={handleOpenModalFisa}>
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
              disabled={Object.keys(bonCurent).length === 2}
            />
            <Button
              variant="contained"
              color="success"
              onClick={() => handleIncaseaza()}
              disabled={input === "" || input < bonCurent.totalDePlata}
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
