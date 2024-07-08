<script setup lang="ts">
import { defineProps } from 'vue';
import Resume from '@/components/ResumeGmp.vue';

// Define the props expected by this view component
const props = defineProps<{ gmpId: string }>();
</script>

<template>
  <!-- Pass the gmpId prop to the Resume component -->
  <Resume :gmpId="props.gmpId" />
</template>