<template>
   <div 
      class="layout"
      @dragover="$event.preventDefault()"
      @drop="drop($event)"
      @click="selected = 0"
      @keyup.delete="del('1')"
      tabindex="0"
   >
      {{list}}  
   </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';

@Component({})

export default class LayoutBL extends Vue {
   private list: any[] = new Array();
   private id: number = 0;
   private drop(e: any): void {
      const scrollX = this.$el.scrollLeft;
      const scrollY = this.$el.scrollTop;
      const item = JSON.parse(e.dataTransfer.getData('component'));
      item.coord = new Array();
      item.coord.push(e.offsetX - (item.width/2));
      item.coord.push(e.offsetY - (item.height/2));
      item.id = ++this.id;
      this.list.push(item);
   }
}
</script>


<style lang="scss" scoped>
   .layout {
      width: 100%;
      height: 100%;
      display: flex;
      z-index: 1;
      position: relative;
      outline: none;
      overflow: auto;
   }
</style>
