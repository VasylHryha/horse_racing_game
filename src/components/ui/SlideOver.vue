<script setup lang="ts">
import { onBeforeUnmount, onMounted } from 'vue'

withDefaults(defineProps<{
  title?: string
  widthClass?: string // e.g. 'w-[380px]' or 'w-full max-w-md'
  closeOnOverlay?: boolean
  testId?: string
}>(), {
  title: '',
  widthClass: 'w-full max-w-sm',
  closeOnOverlay: true,
  testId: undefined,
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
    class="fixed inset-0 z-50 flex items-stretch outline-none"
    aria-modal="true"
    :open="open"
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
        class="bg-white shadow-2xl border-r border-gray-200 flex flex-col h-dvh max-h-dvh"
        :class="widthClass"
        :data-testid="testId"
        style="padding-top: env(safe-area-inset-top); padding-bottom: env(safe-area-inset-bottom);"
      >
        <header class="px-4 py-3 border-b flex items-center justify-between shrink-0">
          <h3 id="slideover-title" class="font-semibold text-gray-800 truncate">
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

        <!-- Make only the content scroll, keep header fixed -->
        <div class="flex-1 overflow-auto p-3 overscroll-contain" :aria-labelledby="title ? 'slideover-title' : undefined">
          <slot />
        </div>
      </section>
    </transition>

    <!-- Spacer to keep layout from shifting on scrollbars (kept minimal) -->
    <div aria-hidden="true" class="w-0" />
  </dialog>
</template>
