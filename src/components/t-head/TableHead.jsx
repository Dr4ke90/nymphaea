import "./t-head.css";

const Thead = ({ thead, handleChange }) => {
  const handleDisable = (value) => {
    let disabled = false;
    if (value === "nr" || value === "#") {
      return !disabled;
    }
    return disabled;
  };

  const handleSize = (value) => {
    let classname = value;
    if (
      value.toLowerCase() === "cod" ||
      value.toLowerCase() === "nr" ||
      value.toLowerCase() === "inventar" ||
      value.toLowerCase() === "fise" ||
      value.toLowerCase() === "#"
    )
      classname = "small";

    if (value.toLowerCase() === "programari") {
      classname = "medium"
    }

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
          {thead.map((value) => {
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
                    autoComplete="off"
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
