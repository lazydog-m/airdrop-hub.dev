const convertToArray = (data) => {
  Array.isArray(data) ? data : [data];
}

const convertBitToBoolean = (bit) => {

  switch (bit) {
    case 1:
      return true
    case 0:
      return false
    default: return null
  }

}

const convertEmailToEmailUsername = (email) => {
  const username = email?.split('@')[0] || null;
  return username;
}

module.exports = {
  convertToArray,
  convertBitToBoolean,
  convertEmailToEmailUsername
}
