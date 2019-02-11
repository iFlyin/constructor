<template>
   <div id="menu">
      <nav @click="menuActive = !menuActive">
         <div class="menu-container">
            <input type="button" class="menu-text-button" value="Файл" @mouseover="active='file'">
            <ul class="menu-list" v-show="menuActive && (active==='file')">
               <li class="menu-list-item" @click="$emit('newproject')">Новый проект</li>
               <li class="menu-list-item" @click.stop>Загрузить проект
                  <ul class="menu-side-list">
                     <li 
                        v-for="system of systemsList"
                        :key="system.uuid"
                        class="menu-side-list-item" 
                        @click="$emit('initByID', system.uuid), menuActive = !menuActive"                        
                     >{{system.name}}</li>
                  </ul>
               </li>
               <li class="menu-list-item">Сохранить в файл</li>
               <li class="menu-list-item">Загрузить из файла</li>
               <li class="menu-list-item" @click="$router.push({ path: '/' })">Выход</li>
            </ul>
         </div>
         <div class="menu-container">
            <input type="button" class="menu-text-button" value="Настройки" @mouseover="active='settings'">
            <!-- <ul class="menu-list" v-show="menuActive">
               <li class="menu-list-item">Новый проект</li>
               <li class="menu-list-item">Загрузить проект</li>
               <li class="menu-list-item">Сохранить в файл</li>
               <li class="menu-list-item">Загрузить из файла</li>
               <li class="menu-list-item">Выход</li>
            </ul> -->
         </div>
         <div class="menu-container">
            <input type="button" class="menu-text-button" value="Вид" @mouseover="active='view'">
            <!-- <ul class="menu-list" v-show="menuActive">
               <li class="menu-list-item">Новый проект</li>
               <li class="menu-list-item">Загрузить проект</li>
               <li class="menu-list-item">Сохранить в файл</li>
               <li class="menu-list-item">Загрузить из файла</li>
               <li class="menu-list-item">Выход</li>
            </ul> -->
         </div>
      </nav>
      <router-link to="/" class="menu-close-button"/>
   </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { mapGetters } from 'vuex';
@Component({computed: {...mapGetters('CMS', {systemsList: 'getSystemsList'})}})
export default class MainMenu extends Vue { 
   public menuActive: boolean = false;
   public active: string = '';

   public newproject(): void {

   }
}
</script>


<style lang="scss" scoped>
   #menu {
      position: relative;
      flex: 0 0 auto;
      box-sizing: border-box;
      justify-content: space-between;
      align-items: center;
      width: 100%;
      height: 30px;
      background-color: #2c3e50;
      padding: 0 20px;
      z-index: 1000000;

      & nav {
         display: flex;
         flex-flow: row nowrap;
      }
   }

   .menu {
      &-container {
         position: relative;
         display: flex;
      }

      &-list {
         position: absolute;
         top: 30px;
         left: 0;
         width: 160px;
         list-style: none;
         padding: 5px 0;
         margin: 0;
         background-color: #2c3e50;
         color: #fff;
         font-size: 12px;
         box-shadow: 2px 2px 8px rgba(0, 0, 0, .33);

         & a {
            color: #fff;
            text-decoration: none;
         }

         &-item {
            position: relative;
            user-select: none;
            cursor: pointer;
            padding: 10px 25px;
            display: flex;
            flex-flow: row nowrap;
            justify-content: flex-start;
            white-space: nowrap;

            &:hover {
               background-color: grey;

               & .menu-side-list {
                  display: block;
               }
            }
         }


      }

      &-side-list {
         display: none;
         list-style: none;
         position: absolute;
         left: 160px;
         top: 0;
         padding: 5px 0;
         margin: 0;
         margin-top: -5px;
         background-color: #2c3e50;
         box-shadow: 2px 2px 8px rgba(0, 0, 0, .33);

         &-item {
            display: flex;
            justify-content: flex-start;
            padding: 10px 25px;

            &:hover {
               background-color: grey;
            }
         }
      }

      &-text-button {
         cursor: pointer;
         box-sizing: border-box;
         height: 30px;
         border: none;
         outline: none;
         background-color: transparent;
         color: #fff;
         padding: 0 10px;

         &:hover {
            background-color: grey;
         }
      }

      &-inside-button {
         width: 100%;
         height: 100;
         display: flex;
         justify-content: flex-start;
      }

      &-close-button {
         position: absolute;
         right: 0;
         top: 0;
         width: 32px;
         height: 30px;

         &:hover {
            background-color: red;
         }

         &::before, &::after {
            position: absolute;
            left: 15px;
            content: ' ';
            top: calc(50% - 9px);
            height: 18px;
            width: 2px;
            background-color: #fff;
         }

         &::before {
            transform: rotate(45deg);
         }
      
         &::after {
            transform: rotate(-45deg);
         }
      }
   }

   
</style>


