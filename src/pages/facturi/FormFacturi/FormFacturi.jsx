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
import { calculateTva } from "../../../utils/calculateTva";
import { calculateTotal } from "../../../utils/calculateTotal";
import { cleanInputValue } from "../../../utils/cleanInputValue";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const FormFactura = ({ closeModal, codFacturi, codProdus, invoices }) => {
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
  const headProtocol = ["nr", "produs", "stoc", "pret", "total", "#"];
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
    discount: "",
    pretAchizitie: "",
    total: 0,
  };
  const [produs, setProdus] = useState(initialStateProdus);

  const initialStateProtocol = {
    produs: "",
    stoc: "",
    pretFaraTva: "",
    pret: "",
    discount: "",
    pretAchizitie: "",
  };
  const [prodProtocol, setProdProtocol] = useState(initialStateProtocol);

  const notify = () => toast.info("Factura exista in deja in baza de date");

  const [isEquipment, setIsEquipment] = useState(false);

  const initialStateEquipment = {
    cod: "",
    descriere: "",
    model: "",
    stoc: "",
    pretFaraTva: "",
    pret: "",
    discount: "",
    pretAchizitie: "",
    total: 0,
  };

  const [equipment, setEquipment] = useState(initialStateEquipment);

  const [tableHead, setTableHead] = useState(thead);
  const [filteredItems, setFilteredItems] = useState([]);

  useEffect(() => {
    setFilteredItems(dateFactura.produse);
  }, [dateFactura]);

  const handleChangeCheckBox = () => {
    setIsEquipment(!isEquipment);
  };

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

      const facturaExista = invoices.some(
        (item) =>
          item.serie + item.numar === updateFactura.serie + updateFactura.numar
      );

      if (facturaExista) {
        notify();
      }

      return updateFactura;
    });
  };

  const handleChangeProdus = (e) => {
    e.preventDefault();
    const { name, value } = e.target;

    setProdus((prevProdus) => {
      let cleanedValue = value;
      let updatedPret = prevProdus.pret;
      let updatedPretAchizitie = prevProdus.pretAchizitie;
      let updatedStocInGr = prevProdus.stocInGr;

      if (name === "pretFaraTva") {
        cleanedValue = cleanedValue.replace(/[^\d.]/g, "");
        updatedPret = (parseFloat(cleanedValue) * 1.19).toFixed(2);
      }

      if (name.toLowerCase() === "discount") {
        cleanedValue = cleanedValue.replace(/\D/g, "");
        cleanedValue =
          cleanedValue !== ""
            ? Math.min(parseInt(cleanedValue, 10), 100).toString()
            : "";
        updatedPretAchizitie =
          cleanedValue !== ""
            ? (
                updatedPret -
                (parseFloat(cleanedValue) / 100) * updatedPret
              ).toFixed(2)
            : null;
      }

      if (name === "gramaj") {
        cleanedValue = cleanedValue.replace(/\D/g, "");
        updatedStocInGr = parseInt(prevProdus.stoc) * parseInt(cleanedValue);
      }

      cleanedValue = cleanInputValue(cleanedValue);

      const updatedProdus = {
        ...prevProdus,
        [name]: cleanedValue,
        pret: updatedPret,
        pretAchizitie: updatedPretAchizitie,
        stocInGr: updatedStocInGr,
      };

      if (updatedProdus.descriere === "") {
        return initialStateProdus;
      }
      return updatedProdus;
    });
  };

  const handleChangeProtocol = (e) => {
    e.preventDefault();
    const { name, value } = e.target;

    setProdProtocol((prevProtocol) => {
      let cleanedValue = value;
      let updatedPret = prevProtocol.pret;
      let updatedStoc = prevProtocol.stoc;
      let updatedPretAchizitie = prevProtocol.pretAchizitie;

      if (name === "pretFaraTva") {
        cleanedValue = cleanedValue.replace(/[^\d.]/g, "");
        updatedPret = calculateTva(cleanedValue);
      }

      if (name.toLowerCase() === "discount") {
        cleanedValue = cleanedValue.replace(/\D/g, "");
        cleanedValue =
          cleanedValue !== ""
            ? Math.min(parseInt(cleanedValue, 10), 100).toString()
            : "";
        updatedPretAchizitie =
          cleanedValue !== ""
            ? (
                updatedPret -
                (parseFloat(cleanedValue) / 100) * updatedPret
              ).toFixed(2)
            : null;
      }

      if (name === "stoc") {
        cleanedValue = cleanedValue.replace(/\D/g, "");
        updatedStoc = parseInt(cleanedValue);
      }

      cleanedValue = cleanInputValue(cleanedValue);

      const updatedProtocol = {
        ...prevProtocol,
        [name]: cleanedValue,
        pret: updatedPret,
        stoc: updatedStoc,
        pretAchizitie: updatedPretAchizitie,
      };

      if (updatedProtocol.produs === "") {
        return initialStateProtocol;
      }
      return updatedProtocol;
    });
  };

  const handleChangeEchipament = (e) => {
    e.preventDefault();
    const { name, value } = e.target;

    setEquipment((prevEquip) => {
      let cleanedValue = value;
      let updatedPret = prevEquip.pret;
      let updatedPretAchizitie = prevEquip.pretAchizitie;
      let updatedStoc = prevEquip.stoc;

      if (name === "pretFaraTva") {
        cleanedValue = cleanedValue.replace(/[^\d.]/g, "");
        updatedPret = calculateTva(cleanedValue);
      }

      if (name.toLowerCase() === "discount") {
        cleanedValue = cleanedValue.replace(/\D/g, "");
        cleanedValue =
          cleanedValue !== ""
            ? Math.min(parseInt(cleanedValue, 10), 100).toString()
            : "";
        updatedPretAchizitie =
          cleanedValue !== ""
            ? (
                updatedPret -
                (parseFloat(cleanedValue) / 100) * updatedPret
              ).toFixed(2)
            : null;
      }

      if (name === "stoc") {
        cleanedValue = cleanedValue.replace(/\D/g, "");
        updatedStoc = parseInt(cleanedValue);
      }

      cleanedValue = cleanInputValue(cleanedValue);

      const updatedEquip = {
        ...prevEquip,
        [name]: cleanedValue,
        pret: updatedPret,
        pretAchizitie: updatedPretAchizitie,
        stoc: updatedStoc,
      };

      if (updatedEquip.model === "") {
        return initialStateEquipment;
      }
      return updatedEquip;
    });
  };

  const handleAdaugaProdus = (e) => {
    e.preventDefault();

    let product;
    if (isEquipment) {
      product = equipment;
    } else if (dateFactura.tip === "protocol") {
      product = prodProtocol;
    } else {
      product = produs;
    }

    const newProductItem = {
      ...product,
      nr: isEquipment
        ? dateFactura.echipament.length + 1
        : dateFactura.produse.length + 1,
      referintaFactura: [dateFactura.cod],
      total: calculateTotal(product),
    };

    const existingItemIndex = isEquipment
      ? dateFactura.echipament.findIndex((item) => item.cod === product.cod)
      : dateFactura.produse.findIndex((item) => item.cod === product.cod);

    const updatedList = [
      ...(isEquipment ? dateFactura.echipament : dateFactura.produse),
    ];

    if (existingItemIndex !== -1) {
      updatedList[existingItemIndex] = {
        ...updatedList[existingItemIndex],
        stoc:
          parseFloat(updatedList[existingItemIndex].stoc) +
          parseInt(product.stoc),
      };
    } else {
      updatedList.push(newProductItem);
    }

    setDateFactura((prevState) => ({
      ...prevState,
      echipament: isEquipment ? updatedList : prevState.echipament,
      produse: isEquipment ? prevState.produse : updatedList,
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
  }, [dateFactura]);

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

  const setProductCode = (dbList) => {
    const itemsArray = isEquipment
      ? dateFactura.echipament
      : dateFactura.produse;

    const prefix = isEquipment ? "EQ" : "P";

    const combinedList = itemsArray.concat(dbList);

    const cod =
      combinedList.reduce((max, item) => {
        const itemNr = parseInt(item.cod.substring(isEquipment ? 2 : 1));
        return Math.max(max, itemNr);
      }, 0) + 1;

    const paddedCod = prefix + cod.toString().padStart(4, "0");
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
    setIsEquipment(false);
    setFilteredItems(dateFactura.produse);
    setTableHead(thead);
  };

  const handleChangeTbodyWithEquipment = () => {
    setFilteredItems(dateFactura.echipament);
    setIsEquipment(true);
    setTableHead(headEchipament);
  };

  useEffect(() => {
    if (isEquipment) {
      handleChangeTbodyWithEquipment();
    } else {
      handleChangeTbodyWithProducts();
    }
  }, [isEquipment]);

  return (
    <PagePreview className="modal-overlay">
      <PagePreview className={`modal-content ${handleChangeClassname()}`}>
        <ToastContainer />
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
                    checked={isEquipment}
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
                      productsList={dateFactura.produse}
                    />
                  )}
                  {isEquipment && (
                    <EquipmentForm
                      stateEquipment={equipment}
                      setStateEquipment={setEquipment}
                      setCodEquip={setProductCode}
                      handleChangeEquipment={handleChangeEchipament}
                      equipmentList={dateFactura.echipament}
                    />
                  )}
                </div>
                <div className="adauga">
                  <Button
                    className="adauga-produs"
                    variant="contained"
                    color="success"
                    onClick={(e) => handleAdaugaProdus(e)}
                    disabled={Object.entries(
                      isEquipment ? equipment : produs
                    ).some(
                      ([key, value]) =>
                        key !== "pret" &&
                        key !== "stocInGr" &&
                        key !== "pretAchizitie" &&
                        key !== "total" &&
                        (typeof value === "string"
                          ? value.trim() === ""
                          : !value)
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
