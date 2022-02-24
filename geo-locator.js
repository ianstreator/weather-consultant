async function getCoordinates() {
  const pos = await new Promise((res, rej) => {
    navigator.geolocation.getCurrentPosition(res, rej);
  });
  const location = {
    lat: pos.coords.latitude,
    lon: pos.coords.longitude,
  };
  return location;
}

export default { getCoordinates };
