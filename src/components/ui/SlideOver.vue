<script setup lang="ts">
import { onBeforeUnmount, onMounted } from 'vue'

withDefaults(defineProps<{
  title?: string
  widthClass?: string // e.g. 'w-[380px]'
  closeOnOverlay?: boolean
}>(), {
  title: '',
  widthClass: 'w-[380px]',
  closeOnOverlay: true,
})

const open = defineModel<boolean>()

function onKey(e: KeyboardEvent) {
  if (e.key === 'Escape' && open.value)
    open.value = false
}

onMounted(() => document.addEventListener('keydown', onKey))
onBeforeUnmount(() => document.removeEventListener('keydown', onKey))
</script>

<template>
  <!-- Overlay -->
  <div
    v-show="open"
    class="fixed inset-0 z-40"
    aria-hidden="true"
  >
    <div
      class="absolute inset-0 bg-black/40 transition-opacity"
      @click="closeOnOverlay && (open = false)"
    />
  </div>

  <!-- Panel -->
  <dialog
    v-show="open"
    class="fixed inset-y-0 left-0 z-50 flex outline-none"
    aria-modal="true"
  >
    <transition
      enter-active-class="transform transition ease-out duration-200"
      enter-from-class="-translate-x-full"
      enter-to-class="translate-x-0"
      leave-active-class="transform transition ease-in duration-150"
      leave-from-class="translate-x-0"
      leave-to-class="-translate-x-full"
    >
      <section
        v-show="open"
        class="h-full bg-white shadow-2xl border-r border-gray-200 flex flex-col"
        :class="widthClass"
      >
        <header class="px-4 py-3 border-b flex items-center justify-between">
          <h3 class="font-semibold text-gray-800 truncate">
            {{ title }}
          </h3>
          <button
            type="button"
            class="p-2 rounded hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            aria-label="Close panel"
            @click="open = false"
          >
            ✕
          </button>
        </header>
        <div class="flex-1 overflow-auto p-3">
          <slot />
        </div>
      </section>
    </transition>
    <!-- Spacer to keep layout from shifting on scrollbars -->
    <div aria-hidden="true" class="w-0" />
  </dialog>
</template>
