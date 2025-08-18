import Swal from 'sweetalert2'

const useConfirm = () => {

  document.addEventListener('keydown', (event) => {
    if (Swal.isVisible && event.key === 'Enter') {
      event.preventDefault();
    }
  });

  const showConfirm = (title, api, onCancel) => {
    // document.body.style.overflowY = 'hidden';
    Swal.fire({
      title: title || "Confirm?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      focusCancel: false,
      focusConfirm: false,
      cancelButtonColor: "#d33",
      confirmButtonText: "Đồng ý",
      cancelButtonText: "Hủy bỏ",
      customClass: {
        container: 'my-swal'
      },
    }).then((result) => {
      if (result.isConfirmed) {
        api();
      } else {
        onCancel?.();
      }
      // document.body.style.overflowY = '';
    });
  };

  const showConfirmCancel = (title, text, onConfirm) => {

    Swal.fire({
      title: title || "Xác nhận?",
      text: text || "",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      focusCancel: false,
      focusConfirm: false,
      cancelButtonColor: "#d33",
      confirmButtonText: "Đồng ý!",
      cancelButtonText: "Hủy bỏ",
      customClass: {
        container: 'my-swal'
      },

    }).then((result) => {
      if (result.isConfirmed) {
        onConfirm();
      }
    });
  };

  return { showConfirm, showConfirmCancel };
}
export default useConfirm;
