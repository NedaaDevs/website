<script setup lang="ts">
type Props = {
  fluid?: boolean
  maxWidth?: string
}

const props = withDefaults(defineProps<Props>(), {
  fluid: false,
  maxWidth: '1200px',
})
</script>

<template>
  <VContainer :fluid="props.fluid" :max-width="maxWidth" class="px-md-6" v-bind="$attrs">
    <slot />
  </VContainer>
</template>
