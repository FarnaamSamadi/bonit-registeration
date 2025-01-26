<script setup lang="ts">
import SelectJob from '@/components/base/SelectJob.vue';
import useValidate, { userSchema } from '@/composables/useValidate';
import { api } from '@/server/api';
import { STORE_URL } from '@/server/urls';
import { TTBtn, TTForm, TTInput } from 'tiktime-ui'
import { ref } from 'vue';
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
    job: null,
  },
  userSchema,
  false,
)

const { showSuccess, showError } = useToast()
const loading = ref(false)
const isSubmitted = ref(false)
const isOpen = ref(false)
const selectedJob = ref()


function toggleModal() {
  isOpen.value = !isOpen.value
}
function handleUserJobs(item: any) {
  selectedJob.value =item.id
  userValue.value.job = item.name
}

async function checkForm() {
  isSubmitted.value = true
  if (loading.value)
    return

  if (!(await validateUserForm()))
    return
    loading.value = true

  try {
   const response =  await api.post(STORE_URL, { 
      name: userValue.value.fullName,
      mobile: userValue.value.mobile,
      category : selectedJob.value
     })  
     if(response.status === 201){
       showSuccess('REQUSETED_SUCCESSFULLY')
     }
    else if(response.status === 422){
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
    <div class="w-full px-16px">
        <h2 class="text-24px font-bold mt-80px mb-20px text-center">اطلاعات زیر را تکمیل کنید</h2>
        <div class="w-full">
         <TTForm
         novalidate
         @submit="checkForm"
          wrapper-class="py-20px">
          <div class="w-full flex flex-col gap-8px mb-10px">
            <label class="pr-10px text-14px c-#777" for="">نام و نام خانوادگی</label>
            <TTInput   
              background-color="#e8e8e8"  
              class="inputclass"
              v-model="userValue.fullName"
              style="color: #fff;"
              label=" مثال : محمد محمدی "
              :error="userError.fullName"
         
              :onchange="validateUser('fullName')"
            />
         </div>
          <div class="w-full flex flex-col gap-8px mb-10px">
            <label class="pr-10px text-14px c-#777" for="">شماره موبایل</label>
            <TTInput 
              background-color="#e8e8e8"
              label=" مثال : 09141234567 "
              is-ltr
              is-number
              class="inputclass"
              v-model="userValue.mobile"
              style="color: #fff;"
              :error="userError.mobile"
            />
        </div>

        <div class="w-full flex flex-col gap-8px mb-10px"
        @click="toggleModal">
            <label class="pr-10px text-14px c-#777" for="">دسته شغلی</label>
            <TTInput 

              background-color="#e8e8e8"
              label=" مثال : سالن زیبایی "
              class="inputclass"
              v-model="userValue.job"
              style="color: #fff;"
              :error="userError.job"
            />
        </div>
        <TTBtn 
            type="submit"
            :loading="loading"
            style="background: linear-gradient(to right, #f7ac00 0, #ed1c24 50%, #7d00ff 100%);"
            text-color="#fff"
            width="100%"
            label="تایید"
            class="mt-20px"
            />
    </TTForm>
    </div>
    <SelectJob v-model:is-open="isOpen"  @select-job="handleUserJobs" />        
</div>
</template>

<style lang="scss">

</style>