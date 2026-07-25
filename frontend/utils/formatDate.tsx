const formatDate = (date: Date | string) => {
  const datex = new Date(typeof date === "string" ? date : date.toString());
  const s = datex.getSeconds();
  const m = datex.getMinutes();
  const h = datex.getHours();
  return `${addZero(h)}:${addZero(m)}:${addZero(s)}`;
};

const addZero = (number: number) =>{
  const numberToString = number.toString()
  if(numberToString.length == 1){
    return `0${numberToString}`
  }
  return numberToString
}

export default formatDate;
