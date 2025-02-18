<script setup lang="ts">
import { TTModal, TTScrollArea, TTSpinner } from 'tiktime-ui'
import { onMounted, ref } from 'vue'
import { api } from '@/server/api';
import { CATEGORY_URL } from '@/server/urls';
import type { Job } from '@/types/common';

const emit = defineEmits<{ selectJob: [item: Job], closed: [] }>()
const isOpen = defineModel<boolean>('isOpen', { required: true })
const selectedJob = ref<Job>()
const userJob = ref<Job>({ id: -1, name: '', })
const categories = ref<{ id: number, name: string }[]>([])
const isLoading = ref('initial')

onMounted(() => {
  if (isLoading.value === 'initial') { fetchCategories() }
})

async function fetchCategories() {
  if (isLoading.value === 'loading') { return }

  isLoading.value = 'loading'
  try {
    const { data } = await api.get(CATEGORY_URL)
    categories.value = data.results
    isLoading.value = 'resolved'
  }
  catch (error) {
    isLoading.value = 'failed'
  }
}

function onSelectJob(item: Job) {
  selectedJob.value = item
  userJob.value = item
  isOpen.value = false
  emit('selectJob', userJob.value)
}
</script>

<template>
  <TTModal v-model:is-open="isOpen" bg="#eee" :modal="false" :dismissible="true">
    <Transition enter-from-class="op-10 translate-y--2px" leave-to-class="op-10 translate-y--2px"
      enter-active-class="duration-150 ease-in" leave-active-class="duration-150 ease-out" mode="out-in">
      <section class="h-550px w-full bg-#eee rounded-2xl">
        <TTScrollArea height="550px">
          <div v-if="isLoading === 'loading'" class="mt-200px flex items-center justify-center">
            <TTSpinner />
          </div>

          <ul v-else-if="isLoading === 'resolved'" class="vaul-wrapper">
            <li v-for="item in categories" :key="item?.id" class="vaul-item">
              <button type="button" class="vaul-item__btn" :class="{
                active: item.id === selectedJob?.id,
              }" @click="onSelectJob(item)">
                {{ item.name }}
              </button>
            </li>
          </ul>

          <div v-else
            class="w-100px cursor-pointer mx-auto rounded-20px bg-#fff h-30px mt-200px flex items-center justify-center"
            @click="fetchCategories">
            تلاش مجدد
          </div>
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
  border-top: 1px solid #ddd;
  ;
  border-bottom: 1px solid #ddd;
  ;

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
