import "./t-head.css";
import { useLocation } from "react-router";

const Thead = ({ thead, handleChange }) => {
  const location = useLocation();
  const pathName = location.pathname.substring(1).includes("create");

  const handleDisable = (value) => {
    let disabled = false;
    if (value === "nr" || value === "#") {
      return !disabled;
    }
    return disabled;
  };

  const handleSize = (value) => {
    let classname = "";
    if (
      value.toLowerCase() === "cod" ||
      value.toLowerCase() === "nr" ||
      value.toLowerCase() === "#"
    )
      classname = "small";

    return classname;
  };

  if (thead !== null && thead !== undefined) {
    return (
      <thead className="thead">
        <tr className={"thead-tr"}>
          {thead.map((value) => (
            <th key={value} className={handleSize(value)}>
              {value.toUpperCase()}
            </th>
          ))}
        </tr>
        <tr className="thead-search">
          {pathName
            ? null
            : thead.map((value) => {
                if (value !== "nr" && value !== "#") {
                  return (
                    <th key={value}>
                      <input
                        type="text"
                        placeholder={value}
                        onChange={handleChange}
                        name={value}
                        disabled={handleDisable(value)}
                        className={handleSize(value)}
                      />
                    </th>
                  );
                } else {
                  return <th key={value}></th>;
                }
              })}
        </tr>
      </thead>
    );
  }
};

export default Thead;
