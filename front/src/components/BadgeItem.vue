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

onMounted(async () => {
    const res = await apiHelper.kyGet(`badges/stats/${props.type_badge_id}/${props.user_id}`);
    console.log(res);
    if (res.success) {
        badge.value = res.data as unknown as Badge;
    } else {
        showToast('Erreur lors du chargement des badges', false);
    }

})

const badge: Ref<Badge | null> = ref(null);


</script>

<template>
    <div class="container">
        <div v-if="badge?.statistic !==undefined" class="badge">
            <img :src="badge.img_url" alt="badge_img" class="background-image">
            <div class="stat">{{ badge.statistic }}</div>
            <div class="stat-description">{{ badge.stat_description }}</div>
            <div class="title">{{ badge.title }}</div>
        </div>
        <div v-if="badge?.statistic === undefined" class="loader"></div>
    </div>
</template>

<style scoped lang="scss">
.container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: #17141D;

    .badge {
        position: relative;
        width: 100%;
        height: 100%;
        border-radius: 8px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;

        .background-image {
            height: 62%;
            object-fit: contain;
        }

        .title {
            color: white;
            font-size: 1.3rem;
            height: 1.5rem;
        }


        .stat {
            position: absolute;
            top: 35%;
            left: 50%;
            transform: translate(-50%, -50%);
            color: white;
            font-size: 2.5rem;
        }
        .stat-description {
            position: absolute;
            top: 55%;
            left: 50%;
            transform: translate(-50%, -50%);
            color: white;
            font-size: 1rem;
            font-weight: 600;
        }
    }

    .loader {
        margin-top: 10%;
    }
}
</style>
