<script setup lang="ts">
import { ref, onMounted, computed, type Ref, reactive } from 'vue';
import { useUserStore } from '@/stores/userStore';
import type { LayoutProfil } from '@/interfaces/profil';
import type { UserDetails } from '@/interfaces/user';
import { useRoute } from 'vue-router';
import router from '@/router';


const getUserDetailsByPseudo = useUserStore().getUserDetailsByPseudo;
let user: Ref<UserDetails | null> = ref(null);

let layout = reactive<LayoutProfil[]>([]);
const route = useRoute();
const pseudo = route.params.pseudo;

layout.push(...user.value?.profil.layout || []);
const colNum = ref(4); // Nombre initial de colonnes

onMounted(async () => {
    if (!pseudo) {
        router.push({ name: 'home' });
    }
    window.addEventListener('resize', updateColNum);
    user.value = await getUserDetailsByPseudo(pseudo as string);
    layout.push(...user.value?.profil.layout || []);
    updateColNum();
    console.log("user",user.value);
});

const updateColNum = () => {
  const width = window.innerWidth;
  colNum.value = width > 1250 ? 4 : 2;
};

</script>


<template>
    <div class="grid-container">
        <GridLayout class="grid" v-model:layout="layout" :col-num="colNum" :row-height="178" :vertical-compact="true"
            :auto-size="true" :margin="[20, 20]" :is-resizable="false">
            <GridItem v-for="item in layout" :key="item.i" :x="item.x" :y="item.y" :w="item.w" :h="item.h" :i="item.i">
                <img v-if="item.type === 'img'" class="img" :src="item.img" alt="">
                <p v-if="item.type === 'text'">
                    {{ item.text }}
                </p>
                <badgeItem v-if="item.type === 'badge'" :type_badge_id="item.type_badge_id!" :user_id="user!.id!"
                    class="badge-item" />
                <div class="badge">
                </div>
            </GridItem>
        </GridLayout>
    </div>

</template>