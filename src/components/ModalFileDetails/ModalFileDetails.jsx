import React, { useEffect, useState } from "react";
import PagePreview from "../PagePreview/PagePreview";
import TableDisplay from "../table-display/TableDisplay";
import "./modalFileDetails.css";
import Input from "../Input/Input";
import { Button } from "@mui/material";
import ModalServiceDetails from "../ModalServiceDetails/ModalServiceDetails";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllEmployees } from "../../redux/slices/employeesSlice";

const ModalFileDetails = ({ file, closeModal }) => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchAllEmployees());
  }, [dispatch]);

  const employees = useSelector((state) => state.angajati);

  const getEmployeeName = () => {
    const employeeIndex = employees.findIndex(
      (employee) => employee.cod === file.codAngajat
    );

    if (employeeIndex !== -1) {
      return `${employees[employeeIndex].nume} ${employees[employeeIndex].prenume}`;
    } else {
      return "Studio Nymphaea";
    }
  };

  const column1 = [
    "codFisa",
    "data",
    "codClient",
    "numeClient",
    "produse",
    "totalDePlata",
    "tipPlata",
  ];

  const column2 = ["codAngajat", "numeAngajat", "codProgramare", "nr"];

  const headProduse = ["cod", "descriere", "cantitate", "pret"];

  const handleCleanName = (item) => {
    let name;
    switch (item) {
      case "codFisa":
        name = "cod Fisa";
        break;
      case "codClient":
        name = "cod Client";
        break;
      case "numeClient":
        name = "nume client";
        break;
      case "tipPlata":
        name = "tip plata";
        break;
      case "totalDePlata":
        name = "total (RON)";
        break;
      case "codAngajat":
        name = "cod angajat";
        break;
      case "numeAngajat":
        name = "Nume angajat";
        break;
      case "codProgramare":
        name = "cod programare";
        break;
      case "nr":
        name = "nr incasare";
        break;
      default:
        name = item;
    }
    return name.substring(0, 1).toUpperCase() + name.slice(1);
  };

  const [openModalServicii, setOpenModalSevicii] = useState(false);
  const handleOpenModalServicii = () => {
    setOpenModalSevicii(!openModalServicii);
  };

  const [receivedObject, setReceivedObject] = useState({});
  const handleOpenModal = (obj) => {
    setReceivedObject(obj);
    handleOpenModalServicii();
  };

  return (
    <div className="modal-file-details">
      <PagePreview className="modal-overlay">
        <PagePreview className="modal-content">
          <div className="info">
            <span>File info</span>
          </div>
          <div className="file-info">
            <div className="column">
              {column1.map((item) => {
                if (item !== "produse") {
                  return (
                    <div key={item} className="row">
                      <label htmlFor={item}>{handleCleanName(item)}</label>
                      <span>:</span>
                      <Input name={item} value={file[item]} disabled />
                    </div>
                  );
                } else if (item === "produse") {
                  return (
                    <div key={item} className="row">
                      <label htmlFor={item}>Nr de servicii </label>
                      <span>:</span>
                      <Input name={item} value={file[item].length} disabled />
                    </div>
                  );
                } else {
                  return null;
                }
              })}
            </div>
            <hr />
            <div className="column">
              {column2.map((item) => {
                return (
                  <div key={item} className="row">
                    <label htmlFor={item}>{handleCleanName(item)}</label>
                    <span>:</span>
                    <Input
                      name={item}
                      value={
                        item === "numeAngajat" ? getEmployeeName() : file[item]
                      }
                      disabled
                    />
                  </div>
                );
              })}
            </div>
          </div>
          <hr />
          <div className="title">
            <h4>Fise</h4>
          </div>
          <TableDisplay
            thead={headProduse}
            tbody={file.produse}
            listOrder={headProduse}
            openDetails={handleOpenModal}
          />
          <hr />
          <div className="close">
            <Button variant="contained" color="info" onClick={closeModal}>
              Close
            </Button>
          </div>

          {openModalServicii && (
            <ModalServiceDetails
              service={receivedObject}
              closeModal={handleOpenModalServicii}
            />
          )}
        </PagePreview>
      </PagePreview>
    </div>
  );
};

export default ModalFileDetails;
