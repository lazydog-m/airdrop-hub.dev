import { Color } from '@/enums/enum';
import Swal from 'sweetalert2'

const useConfirm = () => {

  document.addEventListener('keydown', (event) => {
    if (Swal.isVisible && event.key === 'Enter') {
      event.preventDefault();
    }
  });

  const showConfirm = (title = '', api, text = '', onCancel) => {
    // document.body.style.overflowY = 'hidden';
    Swal.fire({
      title: title || "Confirm?",
      text,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: Color.PRIMARY,
      focusCancel: false,
      focusConfirm: false,
      cancelButtonColor: Color.ORANGE,
      confirmButtonText: "Đồng ý",
      // width: 'auto',
      cancelButtonText: "Hủy bỏ",
      reverseButtons: true, // This property swaps the button positions
      customClass: {
        container: 'my-swal',
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

  const showSaved = (title = 'Đã lưu!') => {
    Swal.fire({
      title: title,
      icon: "success",
      confirmButtonColor: Color.PRIMARY,
      focusConfirm: false,
      // width: 'auto',
      // showConfirmButton: false,
      confirmButtonText: "Xong!",
      // timer: 5000,
      customClass: {
        container: 'my-swal'
      },
    })
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

  return { showConfirm, showConfirmCancel, showSaved };
}
export default useConfirm;
