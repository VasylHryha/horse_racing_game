<script setup lang="ts">
import { nextTick, ref, watch } from 'vue'

interface Props {
  show: boolean
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  confirmClass?: string
}

const props = withDefaults(defineProps<Props>(), {
  confirmText: 'Continue',
  cancelText: 'Cancel',
  confirmClass: 'bg-red-600 hover:bg-red-700',
})

const emit = defineEmits<{
  confirm: []
  cancel: []
}>()

const containerRef = ref<HTMLDivElement | null>(null)
const titleId = 'confirm-title'
const descId = 'confirm-desc'

watch(() => props.show, async (open) => {
  if (!open)
    return
  await nextTick()
  containerRef.value?.focus() // so Esc works immediately
})
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="show"
        class="fixed inset-0 z-50 flex items-center justify-center"
        @click.self="emit('cancel')"
      >
        <!-- backdrop -->
        <div class="absolute inset-0 bg-black/50" />

        <!-- modal -->
        <dialog
          ref="containerRef"
          class="relative bg-white rounded-lg max-w-md w-[calc(100vw-2rem)] mx-4 p-6 shadow-xl outline-none"
          aria-modal="true"
          :aria-labelledby="titleId"
          :aria-describedby="descId"
          open
          tabindex="-1"
          data-testid="confirm-modal"
          @keydown.esc.prevent.stop="emit('cancel')"
        >
          <h3 :id="titleId" class="text-xl font-bold text-gray-800 mb-4">
            {{ title }}
          </h3>

          <p :id="descId" class="text-gray-600 mb-6">
            {{ message }}
          </p>

          <div class="flex gap-3 justify-end">
            <button
              class="px-4 py-2 border-2 border-gray-300 rounded font-semibold hover:bg-gray-50 transition"
              data-testid="confirm-cancel"
              autofocus
              @click="emit('cancel')"
            >
              {{ cancelText }}
            </button>
            <button
              :class="`px-4 py-2 text-white rounded font-semibold transition ${confirmClass}`"
              data-testid="confirm-accept"
              @click="emit('confirm')"
            >
              {{ confirmText }}
            </button>
          </div>
        </dialog>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.modal-enter-active,
.modal-leave-active { transition: opacity .3s ease }
.modal-enter-from,
.modal-leave-to { opacity: 0 }
</style>
