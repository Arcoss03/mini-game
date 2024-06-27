<script setup lang="ts">
import { onMounted, reactive, defineProps } from 'vue';
import apiHelper from '@/helpers/apiHelper';
import router from '@/router';
import socketHelper from '@/helpers/socketHelper';

socketHelper.disconnect()

const state = reactive({
  data: [] as any[], 
  i:0,
});

const props = defineProps<{ gmpId: string }>();
const next = () => {
  state.i += 1;
};
const previous = () => {
  state.i -= 1;
};
const choiceGMP =()=>{
  router.push("/choice-gmp")
}
onMounted(async () => {
  try {
    const res:any = await apiHelper.kyGetWithToken(`garticPhone/resume/${props.gmpId}`, localStorage.getItem('token') as string);
    
    if (!res.success) {
      router.push('/choice-gmp');
    } else {
      state.data = res.data.data;
    }
  } catch (error) {
    console.error('Failed to fetch data:', error);
  }
});
</script>
<template>
  <h1>Guess My Prompt</h1>
  <div v-if="state.data.length > 0">
      <div v-for="(item, idx) in state.data[state.i]" :key="idx">
        <p>
          <strong>{{ item.pseudo }}</strong> : {{ item.prompt }}
          <br>
          <img :src="item.img_url" alt="Image" style="max-width: 200px;">
        </p>
      </div>
      <button class="button" v-if="state.data[state.i-1]" @click="previous">Previous</button>
      <button class="button" v-if="state.data[state.i+1]" @click="next">Next</button>
      <button class="button" v-if="!state.data[state.i+1]" @click="choiceGMP">Choice gmp</button>
  </div>
</template>



<style>
/* Ajoutez du style si nécessaire */
</style>
