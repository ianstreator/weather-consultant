// let location = {};
async function getCoordinates() {
  const pos = await new Promise((res, rej) => {
    navigator.geolocation.getCurrentPosition(res, rej);
  });
  //   location.lat = pos.coords.latitude;
  //   location.lon = pos.coords.longitude;
  const location = {
    lat: pos.coords.latitude,
    lon: pos.coords.longitude,
  };
  return location;
}

export default { getCoordinates };
