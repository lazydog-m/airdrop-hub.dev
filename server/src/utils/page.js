const getPagination = (page, size) => {
  const limit = size ? +size : 10;
  const offset = page ? (+page - 1) * limit : 0;
  return { limit, offset };
};

const getPageItems = (data, page, limit) => {
  console.log(data);
  const { count: totalItems, rows: tutorials } = data; // Giải cấu trúc đối tượng 'data' để lấy 'count' và 'rows'.
  const currentPage = page ? +page : 0; // Nếu có 'page', chuyển đổi sang số; nếu không, gán là 0.
  const totalPages = Math.ceil(totalItems / limit); // Tính tổng số trang.
  return { totalItems, tutorials, totalPages, currentPage }; // Trả về một đối tượng chứa thông tin phân trang.
};

module.exports = { getPagination, getPageItems };
