import {Bounce, toast, ToastOptions} from "react-toastify";

const toastOptions: ToastOptions = {
    autoClose: 3000,
    pauseOnHover: true,
    theme: "light",
    transition: Bounce,
    type: 'success',
}

export const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    toast(message, {...toastOptions, type})
}
