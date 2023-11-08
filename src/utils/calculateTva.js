export const calculateTva = (value) => {
  if (value !== "" || value !== 0) {
    return (parseFloat(value) * 1.19).toFixed(2);
  } else {
    return "";
  }
};
