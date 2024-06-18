<script setup lang="ts">
import { ref, onMounted, computed, type Ref, reactive } from 'vue';
import { useUserStore } from '@/stores/userStore';
import type { LayoutProfil } from '@/interfaces/profil';
import type { UserDetails } from '@/interfaces/user';
import { useRoute } from 'vue-router';
import router from '@/router';
import { GridItem, GridLayout } from 'grid-layout-plus';
import BadgeItem from './BadgeItem.vue';

const getUserDetailsByPseudo = useUserStore().getUserDetailsByPseudo;
let user: Ref<UserDetails | null> = ref(null);

let layout = reactive<LayoutProfil[]>([]);
const route = useRoute();
const pseudo = route.params.pseudo;

layout.push(...user.value?.profil.layout || []);

const gridContainerDim = ref(
    {
        width: 800,
        rowHeight: 178,
        colNum: 2,
    }
);
onMounted(async () => {
    if (!pseudo) {
        router.push({ name: 'profilNotFound' });
    }
    user.value = await getUserDetailsByPseudo(pseudo as string);
    if(user.value === null) {
        router.push({ name: 'profilNotFound' });
    }
    layout.push(...user.value?.profil.layout || []);
    updateItemDim();
    rearrangeLayout();
});

const rearrangeLayout = () => {
    let nextX = 0;
    let nextY = 0;
    const newLayout: LayoutProfil[] = [];

    // Triez les éléments par leur position Y, puis X pour conserver un ordre de haut en bas et de gauche à droite
    const sortedLayout = [...layout].sort((a, b) => a.y - b.y || a.x - b.x);

    sortedLayout.forEach(item => {
        if (nextX + item.w > gridContainerDim.value.colNum) { // Si l'élément suivant ne rentre pas dans la ligne, passez à la ligne suivante
            nextX = 0;
            nextY++;
        }

        newLayout.push({ ...item, x: nextX, y: nextY }); // Ajoutez l'élément avec la nouvelle position
        nextX += item.w;
    });

    layout.splice(0, layout.length, ...newLayout); // Remplacez l'ancien layout par le nouveau
};


const updateItemDim = () => {
    const width = window.innerWidth;
    if (width <500) {
        gridContainerDim.value.width = 375;
        gridContainerDim.value.colNum = 2;
        gridContainerDim.value.rowHeight = 158;
    } else if (width < 1024) {
        gridContainerDim.value.width = 415;
        gridContainerDim.value.colNum = 2;
        gridContainerDim.value.rowHeight = 178;
    } else {
        gridContainerDim.value.width = 812;
        gridContainerDim.value.colNum = 4;
    }
};

</script>


<template>
    <div class="container">
        <div class="user">
            <img :src="user?.profil_picture" alt="img">
            <div>
                <h1>{{ user?.pseudo }}</h1>
                <p>{{ user?.description }}</p>
            </div>
        </div>
        <div class="grid-container" :style="`width: ${gridContainerDim.width}px`">
            <GridLayout class="grid" v-model:layout="layout" :col-num="gridContainerDim.colNum" :row-height="gridContainerDim.rowHeight"
                :is-draggable="false" :vertical-compact="true" :auto-size="true" :margin="[20, 20]"
                :is-resizable="false">
                <GridItem v-for="item in layout" :key="item.i" :x="item.x" :y="item.y" :w="item.w" :h="item.h"
                    :i="item.i">
                    <img v-if="item.type === 'img'" class="img" :src="item.img" alt="">
                    <p class="text" v-if="item.type === 'text'">
                        {{ item.text }}
                    </p>
                    <BadgeItem v-if="item.type === 'badge'" :type_badge_id="item.type_badge_id!" :user_id="user!.id!"
                        class="badge-item" />
                    <div class="badge">
                    </div>
                </GridItem>
            </GridLayout>
        </div>
    </div>

</template>

<style scoped lang="scss">
:deep(.vgl-item:not(.vgl-item--placeholder)) {
    border-radius: 12px;
    position: relative;
    z-index: 4;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #17141D;

    img {
        border-radius: 8px;
    }

    .badge-item {
        border-radius: 8px;
        width: 100%;
        height: 100%;
        padding: 0;
    }

    .text {
        width: 100%;
        text-align: center;
    }
}

:deep(.vgl-item--resizing) {
    opacity: 90%;
}

.container {
    width: 100%;
    padding: 20px 0px 5rem 0px;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;

    .user {
        display: flex;
        flex-direction: row;
        padding: 1rem;
        gap: 1rem;

        img {
            width: 150px;
            height: 150px;
            object-fit: cover;
            border-radius: 999px;
        }

        h1 {
            font-size: 3rem;
        }

        p {
            font-size: 1.2rem;
        }

    }

    .grid-container {

        .grid {
            height: 4px;


            .img {
                width: 100%;
                height: 100%;
                object-fit: cover;
            }

            .text {
                font-size: 1.5rem;
                text-align: center;
                padding: 20px;
            }

            .badge {
                display: flex;
                justify-content: center;
                align-items: center;
            }
        }


    }

    @media screen and (min-width: 1024px) {
        flex-direction: row;
        justify-content: space-around;
        align-items: flex-start;
        .user {
            flex-direction: column;
            gap: 1rem;

            img {
                width: 190px;
                height: 190px;
            }
        }
        
    }
}
</style>