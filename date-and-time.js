function time(set_rise) {
  let date = new Date();
  let hours = date.getHours();
  let minutes = date.getMinutes();

  if (set_rise) {
    date = new Date(set_rise);
    hours = date.getHours(set_rise);
    minutes = date.getMinutes(set_rise);
    if (minutes < 10) minutes = `0${minutes}`;
    if (hours > 12) hours = hours - 12;
    else if (hours === 0) hours = 12;
    const time = `${hours}:${minutes}`;
    return { time };
  }

  const am_pm = hours < 12 ? "AM" : "PM";
  if (minutes < 10) minutes = `0${minutes}`;
  if (hours > 12) hours = hours - 12;
  if (hours === 0) hours = 12;

  const time = `${hours}:${minutes} ${am_pm}`;
  const month_day_year = `${date.getMonth() + 1}/${date.getDate()}/${
    date.getFullYear() - 2000
  }`;
  const timeAndDate = { time, month_day_year };
  return timeAndDate;
}

export default { time };
