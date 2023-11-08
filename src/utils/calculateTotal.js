export const calculateTotal = (item) => {
  if (
    (item.pret !== "" || item.stoc !== "") &&
    (item.pret !== 0 || item.stoc !== 0)
  ) {
    console.log(item.pret, item.stoc);

    return (item.pret * item.stoc).toFixed(2);
  } else {
    return 0;
  }
};
