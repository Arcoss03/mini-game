
<script setup lang="ts">
import { onMounted, ref, type Ref } from 'vue'
import apiHelper from '@/helpers/apiHelper';
import { useUtilsStore } from '@/stores/utilsStore';

const showToast = useUtilsStore().showToast;
interface Badge {
    id: number;
    type_badge_id: number;
    level: string;
    img_url: string;
    title: number;
    stat_description: number;
    statistic: string;
}

const props = defineProps<{
    type_badge_id: number;
    user_id: number;
}>()

onMounted(async() => {
    const res = await apiHelper.kyGet(`badges/stats/${props.type_badge_id}/${props.user_id}`);
    if (res.success) {
        badge.value = res.data as unknown as Badge;
        console.log(badge.value);
        badge.value.img_url = "https://cdn2.thecatapi.com/images/y61B6bFCh.jpg"
    } else {
        showToast('Erreur lors du chargement des badges', false);
    }

})

const badge: Ref<Badge | null> = ref(null);


</script>

<template>
    <div class="container">
        <div :style="{ backgroundImage: `url(${badge?.img_url})` }" v-if="badge?.statistic" class="badge">
            <div class="stat">{{ badge.statistic }}</div>

        </div>

        <div v-if="!badge?.statistic" class="loader"></div>
    </div>
</template>

<style scoped lang="scss">
    .container {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        background-color: #17141D;
        width: 100%;
        height: 100%;

        .badge {
            background-image: url("{{ badge?.img_url }}");
            width: 100%;
            height: 100%;
            border-radius: 8px;
        }

        .loader {
            margin-top: 10%;
        }
    }
</style>
