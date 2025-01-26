<script setup lang="ts">
import { TTModal, TTScrollArea } from 'tiktime-ui'
import { onMounted, ref } from 'vue'
import { api } from '@/server/api';
import { CATEGORY_URL } from '@/server/urls';
import {  LoaderCircle } from 'lucide-vue-next'
import type { Job } from '@/types/common';

const emit = defineEmits<{ selectJob: [item : Job], closed: [] }>()
const isOpen = defineModel<boolean>('isOpen', { required: true })
const selectedJob = ref<Job>()
const userJob = ref<Job>({id: '', name: '' ,})
const categories = ref()
const isLoading = ref(false)

onMounted(async() => {
    fetchCategories()
})

async function fetchCategories() {
    isLoading.value = true
    try {
        const response = await api.get(CATEGORY_URL)
        categories.value = response.data.results      
    }
    catch (error) {
        console.log(error);
    }
    finally{
        isLoading.value = false
    }
      }

function onSelectJob(item:Job) {
    selectedJob.value = item
    userJob.value = item
    isOpen.value = false
    emit('selectJob', userJob.value)
}
</script>

<template>
  <TTModal
    v-model:is-open="isOpen"
    bg="#eee"
    :modal="false"
    :dismissible="true"
  >
    <Transition
      enter-from-class="op-10 translate-y--2px"
      leave-to-class="op-10 translate-y--2px"
      enter-active-class="duration-150 ease-in"
      leave-active-class="duration-150 ease-out"
      mode="out-in"
    >
      <section
        class="h-550px w-full bg-#eee rounded-2xl"
      >
        <TTScrollArea height="550px">
            <div  v-if="isLoading" class="mt-200px flex items-center justify-center">
                <LoaderCircle :size="50" color="#7208b5" class=" animate-spin" />
            </div>

          <ul v-else class="vaul-wrapper">
            <li v-for="item in categories" :key="item.id" class="vaul-item">
              <button
                type="button"
                class="vaul-item__btn"
                :class="{
                  active: item.id === selectedJob?.id,
                }"
                @click="onSelectJob(item)"
              >
                {{ item.name }}
              </button>
            </li>
          </ul>
        </TTScrollArea>
      </section>
    </Transition>
  </TTModal>
</template>

<style scoped lang="scss">
.vaul-wrapper {
  width: 100%;
  padding: 10px 10px;
  display: flex;
  align-items: center;
  flex-direction: column;
  outline: none;
}

.vaul-item {
  width: 95%;
  height: 40px;
  font-size: 22px;
  text-align: center;
  border-top: 1px solid #ddd;;
  border-bottom: 1px solid #ddd;;

  &:first-child {
    border-top: none;
  }
  &:last-child {
    border-bottom: none;
  }
  &__btn {
    font-weight: normal;
    display: block;
    color: #000;
    width: 100%;
    height: 100%;
    cursor: pointer;
    font-size: 16px;

    span {
      position: relative;
      bottom: 2px;
      font-size: 18px;
      color: #777;
    }

    &.active {
      color: var(--clr-base);
      font-size: 19px;

      span {
        color: inherit;
      }
    }
  }
}
</style>
