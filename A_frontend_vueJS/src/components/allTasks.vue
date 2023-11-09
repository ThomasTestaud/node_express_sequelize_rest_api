<script>
import axios from 'axios';
import {ref, onMounted} from 'vue';

let tasks = ref(null);

const apiUrl = 'http://localhost:3005/';

const request = () => {
  axios.get(apiUrl, {widthCredentials: false})
    .then((response) => {
      const jsonData = response.data;
      tasks.value = response.data;
      console.log(tasks.value);
    })
    .catch((error) => {
      console.error('Error:', error);
    });
}

onMounted(() => {
  request();
});

</script>

<template>
  <div class="flex flex-col justify-center items-center font-semibold">
    <h1 class="text-3xl">ToDo App</h1>
    <p>Toutes vos tâches</p>
    <template v-if="tasks !== null">
      <div>Task {{tasks}}</div>
    </template>
    
  </div>
</template>