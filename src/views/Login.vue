<script setup lang="ts">
import { ref, provide } from 'vue';
import SelectJob from '@/components/base/SelectJob.vue';
import useValidate, { userSchema } from '@/composables/useValidate';
import { api } from '@/server/api';
import { STORE_URL } from '@/server/urls';
import { TTBtn, TTForm, TTInput } from 'tiktime-ui';
import useToast from '@/composables/useToast';

const {
  values: userValue,
  errors: userError,
  validateForm: validateUserForm,
  validateField: validateUser,
} = useValidate(
  {
    fullName: '',
    mobile: '',
    job: '',
  },
  userSchema,
)

const { showSuccess, showError } = useToast()
const loading = ref(false)
const isSubmitted = ref(false)
const isOpen = ref(false)
const selectedJob = ref()
const pageContent = ref<'FORM' | 'MSG'>('MSG')

provide('isSubmitted', isSubmitted)


function handleUserJobs(item: { name: string, id: number }) {
  selectedJob.value = item.id
  userValue.value.job = item.name
}

async function checkForm() {
  isSubmitted.value = true

  if (loading.value) {
    return
  }

  if (!(await validateUserForm()))
    return
  loading.value = true

  try {
    const response = await api.post(STORE_URL, {
      name: userValue.value.fullName,
      mobile: userValue.value.mobile,
      category: selectedJob.value
    })
    if (response.status === 201) {
      showSuccess('REQUSETED_SUCCESSFULLY')

    }
    else if (response.status === 422) {
      showError('BAD_FORM')
    }
  }
  catch (err) {
    showError('REQUSETED_FAILED')
  }
  finally {
    loading.value = false
  }
}
</script>



<template>
  <main class="w-full px-16px flex flex-col items-center flex-grow">

    <TTForm v-if="pageContent === 'FORM'" @submit="checkForm" wrapper-class="py-20px">
      <h2 class="text-24px font-bold mt-80px mb-20px text-center">اطلاعات زیر را تکمیل کنید</h2>
      <div class="w-full flex flex-col gap-8px">
        <label class="pr-10px text-14px c-#777" for="">نام و نام خانوادگی</label>
        <TTInput background-color="#e8e8e8" class="inputclass" v-model="userValue.fullName" style="color: #fff;"
          label=" مثال : محمد محمدی " :error="userError.fullName" :onchange="validateUser('fullName')" />
      </div>

      <div class="w-full flex flex-col gap-8px">
        <label class="pr-10px text-14px c-#777" for="">شماره موبایل</label>
        <TTInput background-color="#e8e8e8" label=" مثال : 09141234567 " is-ltr is-number class="inputclass"
          v-model="userValue.mobile" style="color: #fff;" :error="userError.mobile" />
      </div>

      <div class="w-full flex flex-col gap-8px" @click="isOpen = true">
        <label class="pr-10px text-14px c-#777" for="">دسته شغلی</label>

        <TTBtn is-form width="100%" @click="isOpen = true" :label="userValue.job ? userValue.job : 'انتخاب'"
          bg="#e8e8e8" :error="userError.job" />
      </div>

      <div class="w-full mt-20px text-20px rounded-20px flex items-center justify-center bg-#e8e8e8 h-100px">
        لطفاً فیلترشکن خود را خاموش نمایید
      </div>

      <TTBtn type="submit" :loading="loading"
        style="background: linear-gradient(to right, #f7ac00 0, #ed1c24 50%, #7d00ff 100%);" text-color="#fff"
        width="100%" label="تایید" />
    </TTForm>

    <div v-else
      class="w-full my-auto text-18px rounded-20px flex items-center justify-center bg-#e8e8e8 h-100px text-center">
      درخواست شما با موفقیت ثبت شد و بزودی پیامک برایتان ارسال می‌شود.
    </div>

    <SelectJob v-model:is-open="isOpen" @select-job="handleUserJobs" />
  </main>
</template>

<style lang="scss"></style>
