export const getHour = () => {
    const currentDate = new Date();
    const hours = currentDate.getHours().toString().padStart(2, "0"); 
    const minutes = currentDate.getMinutes().toString().padStart(2, "0"); 

    return `${hours}:${minutes}`;
  };