import Swal from "sweetalert2";

export const notifyError = (title, detail) => {
  Swal.fire({
    title: title,
    text: detail,
    icon: "error",
    cancelButtonColor: "black",
    confirmButtonColor: "black",
  });
};

export const notifySuccess = (title, detail) => {
  Swal.fire({
    title: title,
    text: detail,
    icon: "success",
    cancelButtonColor: "black",
    confirmButtonColor: "black",
  });
};

export const notifyWarning = (title, detail) => {
  Swal.fire({
    title: title,
    text: detail,
    icon: "warning",
    cancelButtonColor: "black",
    confirmButtonColor: "black",
  });
};

export const notifyInfo = (title, detail) => {
  Swal.fire({
    title: title,
    text: detail,
    icon: "info",
    showCancelButton: false,
    showConfirmButton: false,
  });
};
