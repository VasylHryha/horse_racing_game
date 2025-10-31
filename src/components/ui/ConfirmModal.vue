<script setup lang="ts">
interface Props {
  show: boolean
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  confirmClass?: string
}

withDefaults(defineProps<Props>(), {
  confirmText: 'Continue',
  cancelText: 'Cancel',
  confirmClass: 'bg-red-600 hover:bg-red-700',
})

const emit = defineEmits<{
  confirm: []
  cancel: []
}>()
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <dialog
        v-if="show"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
        aria-modal="true"
        data-testid="confirm-modal"
        @click.self="emit('cancel')"
      >
        <div class="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
          <!-- Header -->
          <h3 class="text-xl font-bold text-gray-800 mb-4">
            {{ title }}
          </h3>

          <!-- Message -->
          <p class="text-gray-600 mb-6">
            {{ message }}
          </p>

          <!-- Actions -->
          <div class="flex gap-3 justify-end">
            <button
              class="px-4 py-2 border-2 border-gray-300 rounded font-semibold hover:bg-gray-50 transition"
              @click="emit('cancel')"
            >
              {{ cancelText }}
            </button>
            <button
              :class="`px-4 py-2 text-white rounded font-semibold transition ${confirmClass}`"
              @click="emit('confirm')"
            >
              {{ confirmText }}
            </button>
          </div>
        </div>
      </dialog>
    </Transition>
  </Teleport>
</template>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style>
