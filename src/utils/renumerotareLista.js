export const renumerotareLista = (lista) => {
    return lista.map((item, index) => {
      return { ...item, nr: index + 1 };
    });
  };