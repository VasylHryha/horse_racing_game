<script setup lang="ts">
import type { Ref } from 'vue'

type Size = 'sm' | 'md'

const props = defineProps<{
  id: string // unique id per accordion (required)
  title: string // main header text
  subtitle?: string // optional muted text on the right of title
  icon?: string // simple emoji or small text icon (optional)
  disabled?: boolean
  size?: Size // visual density
}>()

const isOpen = defineModel() as Ref<boolean>

function toggle() {
  if (!props.disabled)
    isOpen.value = !isOpen.value
}
</script>

<template>
  <section class="bg-white rounded-lg shadow-md overflow-hidden" :aria-disabled="disabled || undefined">
    <h3 class="m-0">
      <button
        type="button"
        class="w-full flex items-center justify-between focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 transition"
        :class="size === 'sm' ? 'px-3 py-2' : 'px-4 py-3'"
        :aria-expanded="isOpen"
        :aria-controls="`${id}-panel`"
        :disabled="disabled"
        @click="toggle"
        @keydown.space.prevent="toggle"
        @keydown.enter.prevent="toggle"
      >
        <span class="inline-flex items-center gap-2 min-w-0">
          <span v-if="icon" aria-hidden="true" :class="size === 'sm' ? 'text-base' : 'text-lg'">{{ icon }}</span>
          <span class="truncate font-semibold text-gray-800" :class="size === 'sm' ? 'text-sm' : 'text-base'">
            {{ title }}
          </span>
          <span v-if="subtitle" class="truncate text-gray-600" :class="size === 'sm' ? 'text-xs' : 'text-sm'">
            ({{ subtitle }})
          </span>
        </span>

        <svg
          class="shrink-0 transition-transform"
          :class="[isOpen ? 'rotate-180' : '', size === 'sm' ? 'w-4 h-4' : 'w-5 h-5']"
          aria-hidden="true"
          fill="none"
          viewBox="0 0 24 24"
        >
          <path d="M19 9l-7 7-7-7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </button>
    </h3>

    <transition
      enter-active-class="transition-all duration-200 ease-out"
      enter-from-class="max-h-0 opacity-0"
      enter-to-class="max-h-96 opacity-100"
      leave-active-class="transition-all duration-200 ease-in"
      leave-from-class="max-h-96 opacity-100"
      leave-to-class="max-h-0 opacity-0"
    >
      <div v-show="isOpen" :id="`${id}-panel`" class="border-t border-gray-200" :class="size === 'sm' ? 'p-2' : 'p-3'">
        <slot />
      </div>
    </transition>
  </section>
</template>
