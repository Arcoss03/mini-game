<script setup lang="ts">
import { defineProps } from 'vue';
import gmp from "../components/GuessMyPrompt.vue";
const props = defineProps<{ gmpId: string }>();

</script>
<template>
  <gmp :gmpId="props.gmpId"/>
</template>