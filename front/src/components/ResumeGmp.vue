<script setup lang="ts">
import { onMounted, reactive, defineProps, nextTick } from 'vue';
import apiHelper from '@/helpers/apiHelper';
import router from '@/router';
import socketHelper from '@/helpers/socketHelper';

socketHelper.disconnect();

const state = reactive({
  data: [] as any[], 
  i: 0,
  visibleItems: [] as any[], // Array to hold the items to be displayed
  loadedIndices: new Set<number>(), // Set to track already loaded indices
});

const props = defineProps<{ gmpId: string }>();

const next = () => {
  state.i += 1;
  if (state.loadedIndices.has(state.i)) {
    displayAllItems();
  } else {
    displayItemsWithDelay();
  }
  window.scrollTo({ top: 0 });
};

const previous = () => {
  state.i -= 1;
  displayAllItems(); // Display all items immediately for previous
  window.scrollTo({ top: 0 });
};

const choiceGMP = () => {
  router.push("/choice-gmp");
};

const displayItemsWithDelay = async () => {
  state.visibleItems = [];
  state.loadedIndices.add(state.i); // Mark current index as loaded
  for (let idx = 0; idx < state.data[state.i].length; idx++) {
    const item = state.data[state.i][idx];
    state.visibleItems.push({ pseudo: item.pseudo, prompt: item.prompt, img_url: '' });
    
    await new Promise((resolve) => setTimeout(resolve, 2000)); 
    state.visibleItems[idx].img_url = item.img_url;
    await nextTick();

    // Scroll to the bottom of the page after loading each item
    window.scrollTo({ top:3000, behavior: 'smooth' });


    await new Promise((resolve) => setTimeout(resolve, 3000)); 
  }
};

const displayAllItems = () => {
  state.visibleItems = state.data[state.i].map((item: any) => ({
    pseudo: item.pseudo,
    prompt: item.prompt,
    img_url: item.img_url,
  }));
};

onMounted(async () => {
  try {
    const res: any = await apiHelper.kyGetWithToken(`garticPhone/resume/${props.gmpId}`, localStorage.getItem('token') as string);

    if (!res.success) {
      router.push('/choice-gmp');
    } else {
      res.data.data.forEach((subTableau: any) => subTableau.reverse());
      state.data = res.data.data;
      displayItemsWithDelay(); 
    }
  } catch (error) {
    console.error('Failed to fetch data:', error);
  }
});
</script>

<template>
  <main>
    <div class="container">
      <h1>Guess My Prompt</h1>
      <div v-if="state.data.length >= 0">
        <div v-for="(item, idx) in state.visibleItems" :key="idx" :id="`item-${idx}`">
          <p>
            <strong>{{ item.pseudo }} :</strong>
            <p>{{ item.prompt }}</p>
            <br>
            <div class="image" v-if="item.img_url">
              <img :src="item.img_url" alt="Image" style="max-width: 200px;">
            </div>
          </p>
        </div>
        <button class="button red" v-if="state.data[state.i-1]" @click="previous">Previous</button>
        <button class="button blue" v-if="state.data[state.i+1]" @click="next">Next</button>
        <button class="button blue" v-if="!state.data[state.i+1]" @click="choiceGMP">Choice gmp</button>
      </div>
    </div>
  </main>
</template>

<style scoped lang="scss">
main {
  width: 100%;
  height: 100%;
  background-color: #211D2A;

  .container {
    display: flex;
    flex-direction: column;

    h1 {
      display: block;
      line-height: 100%;
      margin-top: 1rem;
      margin-bottom: 3rem;
      font-size: 9vh;
      max-width: 30rem;
      font-style: italic;
      font-weight: bold;
      text-align: center;

      @media(min-width: 1024px) {
        margin-top: 0.5rem;
        max-width: 100%;
        text-align: justify;
        margin-left: 4.5%;
      }
    }
    p {
      display: flex;
      flex-direction: column;
      strong {
        margin-left: 5%;
        font-weight: bold;
        font-size: 4vh;
      }
      p {
        margin-left: 5%;
      }
      .image {
        display: flex;
        img {
          margin-top: 1rem;
          margin-bottom: 2rem;
          max-width: 30rem; 
          border-radius: 16px;
          min-width: 5rem;

          @media(min-width: 1024px) {
            min-width: 20rem;
            margin-top: 2rem;
          }
        }  
        justify-content: left;
        margin-left: 5%;
      }
    }
    button {
      margin-bottom: 7rem;
  
      &.blue {
        background: #7520FF;
        
        &:focus {
          box-shadow: #6C63FF 0 0 0 1.5px inset, rgba(45, 35, 66, 0.4) 0 2px 4px, rgba(45, 35, 66, 0.3) 0 7px 13px -3px, #6C63FF 0 -3px 0 inset;
        }
        &:active {
          box-shadow: #6C63FF 0 3px 7px inset;
          transform: translateY(2px);
        }
        &:hover {
          box-shadow: rgba(45, 35, 66, 0.4) 0 4px 8px, rgba(45, 35, 66, 0.3) 0 7px 13px -3px, #6C63FF 0 -3px 0 inset;
          transform: translateY(-2px);
        }
      }
      &.red {
        background: red;

        &:focus {
          box-shadow: #ff4e50 0 0 0 1.5px inset, rgba(45, 35, 66, 0.4) 0 2px 4px, rgba(45, 35, 66, 0.3) 0 7px 13px -3px, #ff4e50 0 -3px 0 inset;
        }
        &:active {
          box-shadow: #ff4e50 0 3px 7px inset;
          transform: translateY(2px);
        }
        &:hover {
          box-shadow: rgba(45, 35, 66, 0.4) 0 4px 8px, rgba(45, 35, 66, 0.3) 0 7px 13px -3px, #ff4e50 0 -3px 0 inset;
          transform: translateY(-2px);
        }
      }
      @media(min-width: 1024px) {
        margin-bottom: 2rem;
        margin-left: 5%;
      }
    }
  }
}
</style>
