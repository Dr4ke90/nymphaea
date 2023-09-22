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

const FormFactura = ({ closeModal, codFacturi, codProdus }) => {
  const thead = [
    "nr",
    "cod",
    "categorie",
    "brand",
    "tip",
    "stoc",
    "gramaj",
    "pret",
    "#",
  ];
  const headProtocol = ["nr", "produs", "pret", "cantitate", "total", "#"];
  const optionsList = ["produse", "protocol", "utilitati", "chirie"];
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
  };
  const [dateFactura, setDateFactura] = useState(initialStateFactura);

  const initialStateProdus = {
    cod: codProdus,
    categorie: "",
    brand: "",
    tip: "",
    stoc: "",
    gramaj: "",
    pret: "",
    total: "",
  };
  const [produs, setProdus] = useState(initialStateProdus);

  const initialStateProtocol = {
    produs: "",
    pret: "",
    cantitate: "",
    total: "",
  };
  const [prodProtocol, setProdProtocol] = useState(initialStateProtocol);

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
        updateFactura.total =
          parseFloat(updateFactura.valoare) + parseFloat(updateFactura.tva);
      } else if (updateFactura.tip === "chirie") {
        updateFactura.total =
          parseInt(updateFactura.valoare) + parseInt(updateFactura.tva);
      } else {
        updateFactura.total = "";
      }

      return updateFactura;
    });
  };

  const handleChangeProdus = (e) => {
    const { name, value } = e.target;
    e.preventDefault();
    let newValue = value.toLowerCase();

    if (name === "pret")
      newValue = newValue.replace(/[^0-9.]|(?<=\.\d{2})\d+/g, "");

    newValue = newValue.charAt(0).toUpperCase() + newValue.slice(1);

    setProdus((prevProduse) => {
      const updateProduse = {
        ...prevProduse,
        [name]: newValue,
      };

      updateProduse.total =
        parseInt(updateProduse.stoc) * parseInt(updateProduse.pret);

      return updateProduse;
    });
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

  const handleAdaugaProdus = (e) => {
    e.preventDefault();

    let product;
    if (dateFactura.tip !== "protocol") {
      product = produs;
    } else {
      product = prodProtocol;
    }

    setDateFactura({
      ...dateFactura,
      produse: [
        ...dateFactura.produse,
        {
          nr: dateFactura.produse.length + 1,
          cantitateGr: product.stoc * product.gramaj,
          ...product,
        },
      ],
    });

    setProdus(() => {
      const cod =
        parseInt(codProdus.substring(1)) + (dateFactura.produse.length + 1);
      const paddedNr = "P" + cod.toString().padStart(4, "0");
      const updates = {
        ...initialStateProdus,
        cod: paddedNr,
      };
      return updates;
    });
  };

  const [totalGenproduse, setTotalGenProduse] = useState(0);
  useEffect(() => {
    setTotalGenProduse(
      dateFactura.produse.reduce((suma, produs) => suma + parseFloat(produs.totalP), 0)
    );
  }, [dateFactura.produse]);

  const handleInregistreaza = (event) => {
    event.preventDefault();

    if (dateFactura.tip !== "chirie" && dateFactura.tip !== "utilitati") {
      if (totalGenproduse.toFixed(1) !== parseFloat(dateFactura.total).toFixed(1)) {
        alert("Totalul produselor nu este egal cu totalul facturii");
        return;
      }
    }

    const tipUpperCase =
      dateFactura.tip.charAt(0).toUpperCase() + dateFactura.tip.slice(1);

    dispatch(addInvoice({ ...dateFactura, tip: tipUpperCase }));
    setDateFactura(initialStateFactura);
    closeModal();

  };

  const handleRemoveProdus = (nr) => {
    setDateFactura((prev) => {
      const updateProduse = prev.produse.filter((item) => item.nr !== nr);

      const updateFactura = {
        ...prev,
        produse: renumerotareLista(updateProduse),
      };

      return updateFactura;
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

  const handleChangeClassname = () => {
    let className = "";

    if (dateFactura.tip !== "" && dateFactura.tip === "produse") {
      className = "modal-large";
    }

    if (dateFactura.tip !== "" && dateFactura.tip !== "produse") {
      className = "modal-medium";
    }

    if (dateFactura.tip !== "" && dateFactura.tip === "protocol") {
      className = "modal-large";
    }
    return className;
  };

  return (
    <PagePreview className="modal-overlay">
      <PagePreview className={`modal-content ${handleChangeClassname()}`}>
        <TypeModal
          stateFactura={dateFactura}
          setDateFactura={setDateFactura}
          initial={initialStateFactura}
          optionsList={optionsList}
        />
        <hr />
        <PagePreview className="container">
          {dateFactura.tip === "produse" && (
            <>
              <RegularInvoiceForm
                stateFactura={dateFactura}
                handleChangeFactura={handleChangeFactura}
              />
              <hr />
              <ProductsInvoiceForm
                stateProdus={produs}
                handleAdaugaProdus={handleAdaugaProdus}
                handleChangeProdus={handleChangeProdus}
              />
            </>
          )}

          {dateFactura.tip === "protocol" && (
            <>
              <RegularInvoiceForm
                stateFactura={dateFactura}
                handleChangeFactura={handleChangeFactura}
              />
              <hr />
              <ProtocolProductsFrom
                stateProtocol={prodProtocol}
                handleChangeProtocol={handleChangeProtocol}
                handleAdaugaProdus={handleAdaugaProdus}
              />
            </>
          )}

          {dateFactura.tip !== "" &&
            dateFactura.tip !== "produse" &&
            dateFactura.tip !== "protocol" && (
              <RegularInvoiceForm
                stateFactura={dateFactura}
                handleChangeFactura={handleChangeFactura}
              />
            )}
        </PagePreview>

        {(dateFactura.tip === "produse" || dateFactura.tip === "protocol") && (
          <TableDisplay
            thead={dateFactura.tip === "protocol" ? headProtocol : thead}
            tbody={dateFactura.produse}
            listOrder={dateFactura.tip === "protocol" ? headProtocol : thead}
            removeItem={handleRemoveProdus}
          />
        )}

        <ModalController
          state={dateFactura}
          inregistreaza={handleInregistreaza}
          closeModal={closeModal}
        />
      </PagePreview>
    </PagePreview>
  );
};

export default FormFactura;
