import { ACCEPTABLE_TO_BE_PERSIAN } from '@/utils/string'
import { z, type ZodTypeAny } from 'zod'
import { type Ref, ref } from 'vue'
import { watchPausable } from '@vueuse/core'

type UseValidReturn<T extends ZodTypeAny> = {
  values: Ref<z.infer<T>>
  errors: Ref<Record<string, string>>
  validateField: (field: keyof z.infer<T>) => void
  validateForm: () => Promise<boolean>
}

export default function useValidate<T extends ZodTypeAny>(
  initialValues: unknown,
  schema: T,
  isRealtime: boolean = true,
): UseValidReturn<T> {
  type ZodForm = z.infer<T>
  const values = ref<ZodForm>(initialValues)
  const errors = ref<Record<string, string>>({})

  const { resume, pause } = watchPausable(
    values,
    (newValues: ZodForm) => {
      for (const fieldName of Object.keys(newValues)) {
        const field = fieldName
        validateField(field)
      }
    },
    { deep: true },
  )
  pause()

  if (isRealtime) {
    resume()
  }

  async function validateForm() {
    try {
      await schema.parse(values.value)
      errors.value = {}
      return true // Form is valid
    }
    catch (error: unknown) {
      if (error instanceof z.ZodError) {
        const validationErrors: Record<string, string> = {}
        error.errors.forEach((e) => {
          // just save the first one
          if (e.path.length > 0) {
            const path = e.path[0] // Get the first path (field name)
            validationErrors[path] = e.message // Map error messages
          }
        })
        errors.value = validationErrors
      }
      return false // form is invalid
    }
  }

  async function validateField(field: keyof ZodForm) {
    try {
      const res = schema.safeParse(values.value) as z.infer<T>
      const error = res.success ? '' : res.error.formErrors.fieldErrors[field]
      errors.value[field as string] = Array.isArray(error) ? error[0] : error || ''
    }
    catch {

    }
  }
  return { values, errors, validateForm, validateField }
}

const MOBILE_REGEX = /^(\+98|98|0098|0)?9\d{9}$/
const MAX_FILE_SIZE = 1 * 1024 * 1024 // 5 MB
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif']

export const userSchema = z.object({
  fullName: z
    .string()
    .min(1, 'وارد کردن "نام" ضروری است.')
    .max(20, '"نام" می‌بایست حداکثر 20 حرف داشته باشد.')
    .regex(ACCEPTABLE_TO_BE_PERSIAN, '"نام" باید به فارسی باشد.')
    .trim(),
    mobile: z
    .string()
    .min(1, 'وارد کردن "شماره موبایل" ضروری است.')
    .regex(MOBILE_REGEX, '"شماره موبایل" نامعتبر است.'),
    job: z
    .string()
    .min(1, 'انتخاب "دسته شغلی" الزامی است.')  
})
