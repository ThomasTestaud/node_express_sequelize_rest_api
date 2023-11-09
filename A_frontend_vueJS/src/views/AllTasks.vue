<script setup>
import axios from 'axios';
import {ref, onMounted, watchEffect} from 'vue';

let tasks = ref(null);
let amountPerPage = ref(3);
let page = ref(1);
let filter = ref("");
let value = ref("");
let pageAmount = ref(0);

const getFilterAndValue = () => {
  if(filter.value === "user" || filter.value === "search") {
    return "&filter=" +filter.value + "&value="+value.value;
  } else if(filter.value === "done" || filter.value === "undone") {
    return "&filter=" +filter.value;
  } else {
    return "";
  }
}

let apiUrl = ref(`http://localhost:3005`);

const request = () => {
  //console.log(amountPerPage.value);
  axios.get(apiUrl.value + `?page=${page.value}&amount=${amountPerPage.value}`+ getFilterAndValue(), {widthCredentials: false})
    .then((response) => {
      tasks.value = response.data[0];
      pageAmount.value = response.data[1];
      //console.log(tasks.value);
    })
    .catch((error) => {
      console.error('Error:', error);
    });
}

request();

watchEffect(() => {
  //console.log(filter.value);
  //console.log("request");
  //console.log(apiUrl.value + `?page=${page.value}&amount=${amountPerPage.value}`+ getFilterAndValue());
  request();
});

</script>

<template>
  <div class="flex flex-col justify-center items-center font-semibold">
    <h1 class="text-3xl mb-4">ToDo App</h1>
    <div class="flex">
      <p>Filtrer par: </p>
      <select v-model="filter" class="border rounded">
        <option value="">Aucun filtre</option>
        <option value="done">Taches fini</option>
        <option value="undone">Taches non fini</option>
        <option value="user">Par utilisateur</option>
        <option value="search">Par recherche</option>
      </select>
      <input v-if="filter === 'search' || filter === 'user'" type="text" v-model="value" class="border rounded">
    </div>
    <template v-if="tasks !== null">
      <button v-for="task in tasks" class="text-center mt-4 border rounded-lg p-4 hover:bg-gray-300 w-6/12">
        <h1 class="text-xl">{{task.title}}</h1>
        <p>{{task.user}}</p>
        <p>{{task.due_date}}</p>
      </button>
    </template>
    <div @click="request" class="flex mt-5">
      <button v-for="item, index in pageAmount" @click="page = index+1" :class="page===index+1?'border rounded w-7 bg-gray-300' :'border rounded w-7'">{{index+1}}</button>
    </div>
    <input @change="request" class="border rounded w-20" type="number" v-model="amountPerPage">
    
  </div>
</template>

