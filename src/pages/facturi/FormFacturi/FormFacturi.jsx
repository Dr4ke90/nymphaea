import { useEffect, useState } from "react";
import "./formFacturi.css";
import TableDisplay from "../../../components/table-display/TableDisplay";
import PagePreview from "../../../components/PagePreview/PagePreview";
import { renumerotareLista } from "../../../utils/renumerotareLista";
import TypeModal from "../../../components/TypeModal/TypeModal";
import ModalController from "../../../components/ModalController/ModalController";
import RegularInvoiceForm from "../../../components/RegularInvoiceForm/RegularInvoiceForm";
import ProductsInvoiceForm from "../../../components/ProductsInvoiceForm/ProductsInvoiceForm";
import { useDispatch } from "react-redux";
import { addInvoice } from "../../../redux/slices/invoicesSlice";
import ProtocolProductsFrom from "../../../components/ProtocolProducsForm/ProtocolProductsFrom";
import EquipmentForm from "../../../components/EquipmentForm/EquipmentForm";
import Input from "../../../components/Input/Input";
import { Button } from "@mui/material";

const FormFactura = ({ closeModal, codFacturi, codProdus, codEquip }) => {
  const thead = [
    "nr",
    "cod",
    "categorie",
    "brand",
    "descriere",
    "stoc",
    "gramaj",
    "pret",
    "#",
  ];

  const headEchipament = [
    "nr",
    "cod",
    "descriere",
    "model",
    "stoc",
    "pret",
    "#",
  ];
  const headProtocol = ["nr", "produs", "cantitate", "pret", "total", "#"];
  const optionsList = [
    "inventar",
    "protocol",
    "utilitati",
    "chirie",
    "salarii",
  ];
  const date = new Date().toISOString().slice(0, 10);
  const dispatch = useDispatch();

  const initialStateFactura = {
    cod: codFacturi,
    tip: "",
    data: date,
    serie: "",
    numar: "",
    vendor: "",
    valoare: "",
    tva: "",
    total: "",
    produse: [],
    echipament: [],
  };
  const [dateFactura, setDateFactura] = useState(initialStateFactura);

  const initialStateProdus = {
    descriere: "",
    stoc: "",
    cod: "",
    categorie: "",
    brand: "",
    gramaj: "",
    stocInGr: 0,
    pretFaraTva: "",
    pret: "",
    pretAchizitie: "",
    total: 0,
  };
  const [produs, setProdus] = useState(initialStateProdus);

  const initialStateProtocol = {
    produs: "",
    pret: "",
    cantitate: "",
    total: "",
  };
  const [prodProtocol, setProdProtocol] = useState(initialStateProtocol);

  const [isEquipment, setIsEquipment] = useState(false);

  const initialStateEquipment = {
    cod: "",
    descriere: "",
    model: "",
    stoc: "",
    pretFaraTva: "",
    pret: "",
    pretAchizitie: "",
    total: 0,
  };

  const [equipment, setEquipment] = useState(initialStateEquipment);

  const [tableHead, setTableHead] = useState(thead);
  const [filteredItems, setFilteredItems] = useState([]);

  useEffect(() => {
    setFilteredItems(dateFactura.produse);
  }, [dateFactura.produse, dateFactura.echipament]);

  const handleChangeFactura = (event) => {
    const { name, value } = event.target;
    let newValue = value.toLocaleLowerCase();
    if (name === "serie") newValue = newValue.toUpperCase();
    if (name === "valoare") {
      newValue = newValue.replace(/[^0-9.]|(?<=\.\d{2})\d+/g, "");
    }

    newValue = newValue.charAt(0).toUpperCase() + newValue.slice(1);

    setDateFactura((prevDateFactura) => {
      const updateFactura = {
        ...prevDateFactura,
        [name]: newValue,
      };

      if (updateFactura.valoare && updateFactura.tva) {
        updateFactura.total = (
          parseFloat(updateFactura.valoare) + parseFloat(updateFactura.tva)
        ).toFixed(2);
      } else if (updateFactura.tip === "chirie") {
        updateFactura.total = (
          parseInt(updateFactura.valoare) + parseInt(updateFactura.tva)
        ).toFixed(2);
      } else {
        updateFactura.total = "";
      }

      return updateFactura;
    });
  };

  const cleanInputValue = (value) => {
    return value.toLowerCase().charAt(0).toUpperCase() + value.slice(1);
  };

  const calculateTotal = (updated) => {
    const pretNumeric = parseFloat(updated.pret) || 0;
    const stocNumeric = parseInt(updated.stoc) || 0;
    return (pretNumeric * stocNumeric).toFixed(2) || 0;
  };

  const calculateStocInGr = (stoc, gramaj) => {
    return stoc * gramaj || 0;
  };

  const updateProdus = (prevProduse, name, value) => {
    let updatedProdus = {
      ...prevProduse,
      [name]: value,
    };

    if (name === "pretFaraTva") {
      updatedProdus.pret = value ? (parseFloat(value) * 1.19).toFixed(2) : "";
    }

    if (
      (name === "stoc" && prevProduse.gramaj) ||
      (name === "gramaj" && prevProduse.stoc)
    ) {
      updatedProdus.stocInGr = calculateStocInGr(
        updatedProdus.stoc,
        updatedProdus.gramaj
      );
    } else {
      updatedProdus.stocInGr = prevProduse.stocInGr || 0;
    }

    updatedProdus.total = calculateTotal(updatedProdus);

    if (updatedProdus.descriere === "") {
      updatedProdus = { ...initialStateProdus };
    }

    return updatedProdus;
  };

  const handleChangeProdus = (e) => {
    e.preventDefault();
    const { name, value } = e.target;
    let cleanedValue = value;

    if (name === "pret") {
      cleanedValue = cleanedValue.replace(/[^0-9.]|(?<=\.\d{2})\d+/g, "");
    }

    cleanedValue = cleanInputValue(cleanedValue);

    setProdus((prevProduse) => updateProdus(prevProduse, name, cleanedValue));
  };

  const handleChangeCheckBox = () => {
    setIsEquipment(!isEquipment);
  };

  const handleChangeProtocol = (e) => {
    e.preventDefault();
    const { name, value } = e.target;

    setProdProtocol((prevProtocol) => {
      const updateProtocol = {
        ...prevProtocol,
        [name]: value,
      };
      updateProtocol.total = updateProtocol.cantitate * updateProtocol.pret;
      return updateProtocol;
    });
  };

  const updateEchipament = (prevEquip, name, value) => {
    let updateEquip = {
      ...prevEquip,
      [name]: value,
    };

    if (name === "pretFaraTva") {
      updateEquip.pret = value ? (parseFloat(value) * 1.19).toFixed(2) : "";
    }

    updateEquip.total = calculateTotal(updateEquip);

    if (updateEquip.model === "") {
      updateEquip = { ...initialStateEquipment};
    }

    return updateEquip;
  };

  const handleChangeEchipament = (e) => {
    e.preventDefault();
    const { name, value } = e.target;
    let cleanedValue = value;

    if (name === "pret") {
      cleanedValue = cleanedValue.replace(/[^0-9.]|(?<=\.\d{2})\d+/g, "");
    }

    cleanedValue = cleanInputValue(cleanedValue);

    setEquipment((prevEquip) =>
      updateEchipament(prevEquip, name, cleanedValue)
    );
  };

  const handleAdaugaProdus = (e) => {
    e.preventDefault();

    let product;
    if (isEquipment) {
      product = equipment;
    }
    if (!isEquipment && dateFactura.tip === "protocol") {
      product = prodProtocol;
    }

    if (!isEquipment && dateFactura.tip !== "protocol") {
      product = produs;
    }

    const newItem = {
      nr: isEquipment
        ? dateFactura.echipament.length + 1
        : dateFactura.produse.length + 1,
      ...product,
      referintaFactura: [dateFactura.cod],
    };

    setDateFactura((prevState) => ({
      ...prevState,
      echipament: isEquipment
        ? [...prevState.echipament, newItem]
        : prevState.echipament,
      produse: isEquipment
        ? prevState.produse
        : [...prevState.produse, newItem],
    }));

    if (isEquipment) {
      setEquipment(initialStateEquipment);
    } else {
      setProdus(initialStateProdus);
    }
  };

  const [totalGenProduse, setTotalGenProduse] = useState(0);

  useEffect(() => {
    const totalProduse = dateFactura.produse.reduce(
      (suma, produs) => suma + parseFloat(produs.total),
      0
    );

    const totalEchipament = dateFactura.echipament.reduce(
      (suma, produs) => suma + parseFloat(produs.total),
      0
    );

    const totalGeneral = totalProduse + totalEchipament;

    setTotalGenProduse(totalGeneral);
  }, [dateFactura.produse, dateFactura.echipament]);

  const handleInregistreaza = (event) => {
    event.preventDefault();

    const tipUpperCase =
      dateFactura.tip.charAt(0).toUpperCase() + dateFactura.tip.slice(1);

    dispatch(
      addInvoice({
        ...dateFactura,
        tip: tipUpperCase,
      })
    );
    setDateFactura(initialStateFactura);
    closeModal();
  };

  const handleRemoveProdus = (produs) => {
    setDateFactura((prev) => {
      const listaActualizata = !isEquipment
        ? renumerotareLista(
            prev.produse.filter((item) => item.nr !== produs.nr)
          )
        : renumerotareLista(
            prev.echipament.filter((item) => item.nr !== produs.nr)
          );

      return {
        ...prev,
        produse: !isEquipment ? listaActualizata : prev.produse,
        echipament: isEquipment ? listaActualizata : prev.echipament,
      };
    });

    const cod =
      parseInt(codProdus.substring(1)) + (dateFactura.produse.length - 1);
    const paddedNr = "P" + cod.toString().padStart(4, "0");
    setProdus(() => {
      const updates = {
        ...produs,
        cod: paddedNr,
      };
      return updates;
    });
  };

  const setProductCode = () => {
    let cod;
    let paddedCod;
    if (isEquipment) {
      cod = parseInt(codEquip.substring(2)) + dateFactura.echipament.length;
      paddedCod = "EQ" + cod.toString().padStart(4, "0");
    } else {
      cod = parseInt(codProdus.substring(1)) + dateFactura.produse.length;
      paddedCod = "P" + cod.toString().padStart(4, "0");
    }

    return paddedCod;
  };

  const handleChangeClassname = () => {
    let className = "";

    if (dateFactura.tip !== "" && dateFactura.tip === "inventar") {
      className = "modal-large";
    }

    if (dateFactura.tip !== "" && dateFactura.tip !== "inventar") {
      className = "modal-medium";
    }

    if (dateFactura.tip !== "" && dateFactura.tip === "protocol") {
      className = "modal-large";
    }
    return className;
  };

  const handleChangeTbodyWithProducts = () => {
    setFilteredItems(dateFactura.produse);
    setTableHead(thead);
  };

  const handleChangeTbodyWithEquipment = () => {
    setFilteredItems(dateFactura.echipament);
    setTableHead(headEchipament);
  };

  return (
    <PagePreview className="modal-overlay">
      <PagePreview className={`modal-content ${handleChangeClassname()}`}>
        <TypeModal
          dateFactura={dateFactura}
          setDateFactura={setDateFactura}
          initial={initialStateFactura}
          optionsList={optionsList}
        />
        <hr />
        <PagePreview className="container">
          {dateFactura.tip === "inventar" && (
            <>
              <RegularInvoiceForm
                stateFactura={dateFactura}
                handleChangeFactura={handleChangeFactura}
                setProducts={handleChangeTbodyWithProducts}
                setEquipment={handleChangeTbodyWithEquipment}
              />
              <div className="products-wrapper">
                <div className="check">
                  <Input
                    key="check"
                    id="check"
                    type="checkbox"
                    name="echipament"
                    onChange={handleChangeCheckBox}
                  />
                  <label>Echipament</label>
                </div>

                <div className="products-form">
                  {!isEquipment && (
                    <ProductsInvoiceForm
                      stateProdus={produs}
                      setStateProdus={setProdus}
                      setCodProdus={setProductCode}
                      handleChangeProdus={handleChangeProdus}
                    />
                  )}
                  {isEquipment && (
                    <EquipmentForm
                      stateEquipment={equipment}
                      setStateEquipment={setEquipment}
                      setCodEquip={setProductCode}
                      handleChangeEquipment={handleChangeEchipament}
                    />
                  )}
                </div>
                <div className="adauga">
                  <Button
                    className="adauga-produs"
                    variant="contained"
                    color="success"
                    onClick={(e) => handleAdaugaProdus(e)}
                    disabled={Object.values(
                      isEquipment ? equipment : produs
                    ).some(
                      (value) =>
                        typeof value === "string" && value.trim() === ""
                    )}
                  >
                    Adauga
                  </Button>
                </div>
              </div>
            </>
          )}

          {dateFactura.tip === "protocol" && (
            <>
              <RegularInvoiceForm
                stateFactura={dateFactura}
                handleChangeFactura={handleChangeFactura}
              />
              <ProtocolProductsFrom
                stateProtocol={prodProtocol}
                handleChangeProtocol={handleChangeProtocol}
                handleAdaugaProdus={handleAdaugaProdus}
              />
            </>
          )}

          {dateFactura.tip !== "" &&
            dateFactura.tip !== "inventar" &&
            dateFactura.tip !== "protocol" && (
              <RegularInvoiceForm
                stateFactura={dateFactura}
                handleChangeFactura={handleChangeFactura}
              />
            )}
        </PagePreview>

        {(dateFactura.tip === "inventar" || dateFactura.tip === "protocol") && (
          <TableDisplay
            thead={dateFactura.tip === "protocol" ? headProtocol : tableHead}
            tbody={filteredItems}
            listOrder={
              dateFactura.tip === "protocol" ? headProtocol : tableHead
            }
            removeItem={handleRemoveProdus}
          />
        )}

        <ModalController
          state={dateFactura}
          inregistreaza={handleInregistreaza}
          closeModal={closeModal}
          total={totalGenProduse}
        />
      </PagePreview>
    </PagePreview>
  );
};

export default FormFactura;
