<template>
   <div id="menu">
      <nav>
         <input type="button" class="menu-text-button" value="Файл">
         <input type="button" class="menu-text-button" value="Настройки">
         <input type="button" class="menu-text-button" value="Вид">
      </nav>
      <router-link to="/" class="menu-close-button"></router-link>
   </div>
</template>

<style lang="scss" scoped>
   #menu {
      flex: 0 0 auto;

      box-sizing: border-box;
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
      height: 30px;
      background-color: #2c3e50;
      // box-shadow: 0px -1px 1px 0px rgba(0, 0, 0, .35) inset;
   }

   .menu {
      &-text-button {
         cursor: not-allowed;
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


