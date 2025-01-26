import { toast } from 'vue-sonner'

const toasts = {
  // Systm Errors
  REQUSETED_FAILED: 'درخواست شما موفقیت‌آمیز نبود.',
  REQUSETED_SUCCESSFULLY: 'درخواست شما با موفقیت ثبت شد.',
  BAD_FORM: 'مقادیر را به درستی وارد کنید',

} 

export type toastKeys = keyof typeof toasts

export default function useToast() {
  const showToast = (type: 'error' | 'success', msg: string) =>
    toast[type](msg)

  const showError = (msg: toastKeys = 'REQUSETED_FAILED') => toast.error(toasts[msg], {
    position: 'top-right',
    richColors: true,
    duration: 1000,
    style: { width: '320px', fontSize: '14px', direction: 'rtl' },
  })

  const showErrors = (msgs: toastKeys[]) => {
    if (msgs.length > 0) {
      for (const msg of msgs) showError(msg)
    }
  }

  const showSuccess = (msg: toastKeys) => toast.success(toasts[msg], {
    position: 'top-right',
    richColors: true,
    duration: 1000,
    style: { width: '320px', fontSize: '14px', direction: 'rtl' },
  })
  return { showToast, showError, showErrors, showSuccess }
}
