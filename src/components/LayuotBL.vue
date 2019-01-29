<template>
   <div 
      class="layout"
      @dragover.stop="$event.preventDefault()"
      @drop.stop="drop($event)"
      @click="selected = 0"
      @keyup.delete="del('1')"
      tabindex="0"
      @mousewheel="wheel($event)"
      :style="{
         zoom: zoom
      }"
   >
      <div 
         class="layout-item"
         v-for="(item, index) of list"
         :key="index"
         :style="{
            left: (item.coord[0]) + 'px',
            top: item.coord[1] + 'px',
            width: item.width + 'px',
            height: item.height + 'px',
         }"
         :data-id="item.id"
         @mousedown="movement($event)"
         @click.stop="select($event)"
         @drop.stop="1"
      >
         <div class="layout-item-wrapper">
            <div class="layout-item-resizer" v-if="item.id == selected">
               <button class="resizer-grid resizer-top-left" @mousedown.stop="resize($event, item.id, ['top', 'left'])"></button>   
               <button class="resizer-grid resizer-top" @mousedown.stop="resize($event, item.id, ['top'])"></button>   
               <button class="resizer-grid resizer-top-right"  @mousedown.stop="resize($event, item.id, ['top', 'right'])"></button>   
               <button class="resizer-grid resizer-left" @mousedown.stop="resize($event, item.id, ['left'])"></button>   
               <button class="resizer-grid resizer-right" @mousedown.stop="resize($event, item.id, ['right'])"></button>                     
               <button class="resizer-grid resizer-bottom-left" @mousedown.stop="resize($event, item.id, ['bottom', 'left'])"></button>   
               <button class="resizer-grid resizer-bottom" @mousedown.stop="resize($event, item.id, ['bottom'])"></button>   
               <button class="resizer-grid resizer-bottom-right" @mousedown.stop="resize($event, item.id, ['bottom', 'right'])"></button>   
            </div>
            <div class="layout-item-content">
               <div class="layout-item-header">
                  {{item.name}}   
               </div>   
            </div>  
         </div>
      </div> 
   </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';

@Component({
   props: {
      left: {
         type: Number,
         required: true,
      }
   }
})

export default class LayoutBL extends Vue {
   // описать интерфейс объекта и придать типу массива
   private list: any[] = new Array();
   private id: number = 0;
   private left!: number;
   private selected: number = 0;
   private zoom: number = 1;
   
   private drop(e: any): void {
      const scrollX = this.$el.scrollLeft;
      const scrollY = this.$el.scrollTop;
      const item = JSON.parse(e.dataTransfer.getData('component'));
      item.coord = new Array();
      const centerX = item.width/2;
      const centerY = item.height/2;
      let posX = (e.clientX - this.left) / this.zoom  - centerX;
      if (posX < 0) { posX = 0 }
      let posY = (e.clientY - 30) /this.zoom - centerY;
      if (posY < 0) { posY = 0 }
      item.coord.push(posX + scrollX);
      item.coord.push(posY + scrollY);
      item.id = ++this.id;
      this.list.push(item);
   }

   private select (e: MouseEvent): void {
      const target: any = e.target;
      const parent: any = target.offsetParent.offsetParent;
      const id: number = parent.dataset.id;
      this.selected = id;
   }

   private del(): void {
      let index = null;
      if (this.selected != 0) {
         index = this.list.findIndex(item => item.id == this.selected);
         if (index || index === 0) {
            this.list.splice(index, 1);
            this.selected = 0;
         }
      }
   }

   private movement(e: any): void {
      const scrollX = this.$el.scrollLeft;
      const scrollY = this.$el.scrollTop;
      const id: number = e.target.offsetParent.offsetParent.dataset.id;
      const index = this.list.findIndex(item => item.id == id);
      let x: number;
      let y: number;
      const that = this;
      const offsetX = e.offsetX;
      const offsetY = e.offsetY;
      
      function move(e: MouseEvent): void {
         x = (e.clientX - offsetX - that.left) / that.zoom  + scrollX;
         if (x < 0) { x = 0; }
         y = (e.clientY - 30 - offsetY) / that.zoom + scrollY;
         if (y < 0) { y = 0; }
         that.list[index].coord = [x, y];
      }

      function clean(this: any, e: MouseEvent): void {
         this.removeEventListener('mousemove', move);
         this.removeEventListener('mouseup', clean);
      }

      window.addEventListener('mousemove', move);
      window.addEventListener('mouseup', clean);
   }

   private resize(e: MouseEvent, id: number, direction: string[]): void {
      const that = this;
      const index = this.list.findIndex(item => item.id == id);
      const scrollX = that.$el.scrollLeft;
      const scrollY = that.$el.scrollTop;

      function onResize(e: MouseEvent) {
         const newX = (e.clientX - that.left) / that.zoom + scrollX;
         const newY = (e.clientY - 30) / that.zoom + scrollY;

         if (direction.indexOf('left') !== -1) {
            that.list[index].coord.splice(0, 1, newX);
            that.list[index].width -= e.movementX / that.zoom;
         } else if (direction.indexOf('right') !== -1) { 
            that.list[index].width += e.movementX / that.zoom;
         }
         
         if (direction.indexOf('top') !== -1) {
            that.list[index].coord.splice(1, 1, newY);
            that.list[index].height -= e.movementY / that.zoom;
         } else if (direction.indexOf('bottom') !== -1) { 
            that.list[index].height += e.movementY / that.zoom;
         }
      }

      function clean(this: any, e: MouseEvent) {
         this.removeEventListener('mousemove', onResize);
         this.removeEventListener('mouseup', clean);
      }

      window.addEventListener('mousemove', onResize);
      window.addEventListener('mouseup', clean);
   }

   private wheel(e: WheelEvent): void {
      const clearZoom = Math.round((this.zoom * 10));
      if (e.deltaY > 0) { 
         if (clearZoom === 4) {
            this.zoom = 0.4
         } else {
            this.zoom -= 0.1;
         }
      }
      if (e.deltaY < 0) {
         if (clearZoom === 15) {
            this.zoom = 1.5;
         } else {
            this.zoom += 0.1; 
         }
      }
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

   .layout-item {
      border: 1px solid black;
      box-sizing: border-box;
      z-index: 100;
      position: absolute;

      &-wrapper {
         width: 100%;
         height: 100%;
         background: #fff;
         position: relative;
      }

      &-resizer {
         height: 100%;
         width: 100%;
         outline: 2px dashed grey;
         position: absolute;
         top: 0;
         left: 0;
      }
      
      &-content {
         position: absolute;
         top: 0;
         left: 0;
         height: 100%;
         width: 100%;
      }

      &-header {
         min-height: 40px;
         padding: 10px;
         width: 100%;
         box-sizing: border-box;
         outline: 1px solid black;
         display: flex;
         justify-content: center;
         align-items: center;
         user-select: none;
      }
   }

   .resizer {
      &-grid{
         position: absolute;
         box-sizing: border-box;
         padding: 4px;
         background: transparent;
         border: 2px dashed grey;
         height: 0;
         outline: none;
         
         &:hover {
            border: 2px dashed red;
         }
      }

      &-top-left {
         top: -12px;
         left: -12px;
      }
      &-top {
         top: -12px;
         left: calc(50% - 6px);
      }
      &-top-right {
         top: -12px;
         right: -12px;
      }
      &-left {
         top: calc(50% - 6px);
         left: -12px;
      }
      &-right {
         top: calc(50% - 6px);
         right: -12px;
      }
      &-bottom-left {
         bottom: -12px;
         left: -12px;
      }
      &-bottom {
         bottom: -12px;
         left: calc(50% - 6px);
      }
      &-bottom-right {
         bottom: -12px;
         right: -12px;
      }
   }
</style>
