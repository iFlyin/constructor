<template>
  <div class="home">
    <router-link to="/"><img alt="ИМЦ логотип" src="../assets/logo.png"></router-link>
    <div id="nav">
      <router-link class="disabledLink" to="/">Документы</router-link> |
      <router-link class="disabledLink" to="/">Формы</router-link> |
      <router-link to="/bl_designer">Процессы</router-link>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component({})
export default class Home extends Vue {}
</script>

<style lang="scss" scoped>
  .home {
    height: 80%;
    display: flex;
    flex-flow: column nowrap;
    justify-content: center;
    align-items: center;
  }
  #nav {
    padding: 30px;
    a {
      font-weight: bold;
      color: #2c3e50;
      
      &:hover {
        color: #42b983;
      }
    }
  }

  .disabledLink {
    cursor: not-allowed;
  }
</style>

