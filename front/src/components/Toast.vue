<script setup lang="ts">
import { ref } from 'vue';

const props = defineProps({
    message: String,
    isSuccess: Boolean
});


</script>

<template>
    <div class="toast" :class="{ 'toast-success': isSuccess, 'toast-error': !isSuccess }">
        <p>{{ message }}</p>
    </div>
</template>

<style scoped lang="scss">
.toast {
    position: fixed;
    bottom: 0;
    right: 0;
    padding: 10px 20px;
    border-radius: 8px 0 0 0;
    color: #fff;
    font-weight: bold;
    z-index: 1000;
    transition: transform 0.3s ease-in-out;
    pointer-events: none;

    &.toast-success {
        background-color: #3ee243;
    }

    &.toast-error {
        background-color: #f44336;
    }
}
</style>
