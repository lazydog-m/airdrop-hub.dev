export const displayCurrencyVnd = (data) => {
  return data?.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
}

export const formatCurrencyVnd = (data) => {
  const hasNonZeroNumber = /\d*[1-9]\d*/.test(data);

  let stringData = String(data);

  if (hasNonZeroNumber) {
    return stringData
      .replace(/[^0-9]+/g, "")
      .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  } else {
    return "";
  }
};

export const formatNumber = (data) => {

  let stringData = String(data);

  return stringData
    .replace(/[^0-9]+/g, "");
};
