const formatDate = (date: Date) => {
  const datex = new Date(date.toString());
  const s = datex.getSeconds();
  const m = datex.getMinutes();
  const h = datex.getHours();
  return `${h}:${m}:${s} `;
};

export default formatDate;
