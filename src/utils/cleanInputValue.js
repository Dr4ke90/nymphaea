export const cleanInputValue = (value) => {
  return value.toLowerCase().charAt(0).toUpperCase() + value.slice(1);
};
