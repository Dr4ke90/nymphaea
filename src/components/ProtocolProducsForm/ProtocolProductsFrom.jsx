import Input from "../Input/Input";
import Form from "../Formular/Form";
import { Button } from "@mui/material";
import './protocolProductsForm.css'


export default function ProtocolProductsFrom({
  stateProtocol,
  handleChangeProtocol,
  handleAdaugaProdus,
}) {
  const handlePlaceholder = (keyName) => {
    return keyName.substring(0, 1).toUpperCase() + keyName.slice(1);
  };

  return (
    <Form className="form-protocol">
      {Object.keys(stateProtocol).map((keyName) => {
        if (keyName !== "nr") {
          return (
            <Input
              key={keyName}
              name={keyName}
              id={keyName}
              className="input"
              type="text"
              placeholder={handlePlaceholder(keyName)}
              onChange={handleChangeProtocol}
              value={stateProtocol[keyName]}
              disabled={keyName === "total"}
              autoComplete="off"
            />
          );
        } else {
          return null;
        }
      })}
      <Button
        variant="contained"
        color="success"
        onClick={handleAdaugaProdus}
        disabled={Object.values(stateProtocol).some(
          (value) => typeof value === "string" && value.trim() === ""
        )}
      >
        Adauga
      </Button>
    </Form>
  );
}
