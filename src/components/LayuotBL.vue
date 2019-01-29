<template>
   <div 
      class="layout"
      @dragover="$event.preventDefault()"
      @drop="drop($event)"
      @click="selected = 0"
      @keyup.delete="del('1')"
      tabindex="0"
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
      >
         <div class="layout-item-wrapper">
            <div class="layout-item-resizer" v-if="item.id == selected">
               <button class="resizer-grid resizer-top-left" @mousedown.stop="resizeTopLeft($event, item.id)"></button>   
               <button class="resizer-grid resizer-top" @mousedown.stop="resizeTop($event, item.id)"></button>   
               <button class="resizer-grid resizer-top-right"  @mousedown.stop="resizeTopRight($event, item.id)"></button>   
               <button class="resizer-grid resizer-left" @mousedown.stop="resizeLeft($event, item.id)"></button>   
               <button class="resizer-grid resizer-right" @mousedown.stop="resizeRight($event, item.id)"></button>                     
               <button class="resizer-grid resizer-bottom-left" @mousedown.stop="resizeBottomLeft($event, item.id)"></button>   
               <button class="resizer-grid resizer-bottom" @mousedown.stop="resizeBottom($event, item.id)"></button>   
               <button class="resizer-grid resizer-bottom-right" @mousedown.stop="resizeBottomRight($event, item.id)"></button>   
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
   
   private drop(e: any): void {
      const scrollX = this.$el.scrollLeft;
      const scrollY = this.$el.scrollTop;
      const item = JSON.parse(e.dataTransfer.getData('component'));
      item.coord = new Array();
      const centerX = item.width/2;
      const centerY = item.height/2;
      let posX = e.clientX - this.left - centerX;
      if (posX < 0) { posX = 0 }
      let posY = e.clientY - 30 - centerY;
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
         x = e.clientX - that.left - offsetX + scrollX;
         y = e.clientY - 30 - offsetY + scrollY;
         that.list[index].coord = [x, y];
      }

      function clean(this: any, e: MouseEvent): void {
         this.removeEventListener('mousemove', move);
         this.removeEventListener('mouseup', clean);
      }

      window.addEventListener('mousemove', move);
      window.addEventListener('mouseup', clean);
   }

   private resizeLeft(e: MouseEvent, id: number): void {
      const that = this;
      const index = this.list.findIndex(item => item.id == id);
      const scrollX = that.$el.scrollLeft;
      
      function resize(e: MouseEvent) {
         const newX = (e.clientX - that.left + scrollX);
         that.list[index].coord.splice(0, 1, newX);
         that.list[index].width -= e.movementX;
      }

      function clean(this: any, e: MouseEvent) {
         this.removeEventListener('mousemove', resize);
         this.removeEventListener('mouseup', clean);
      }

      window.addEventListener('mousemove', resize);
      window.addEventListener('mouseup', clean);
   }

   private resizeRight(e: MouseEvent, id: number): void {
      const that = this;
      const index = this.list.findIndex(item => item.id == id);
      const scrollX = that.$el.scrollLeft;

      function resize(e: MouseEvent) {
         that.list[index].width += e.movementX;
      }

      function clean(this: any, e: MouseEvent) {
         this.removeEventListener('mousemove', resize);
         this.removeEventListener('mouseup', clean);
      }

      window.addEventListener('mousemove', resize);
      window.addEventListener('mouseup', clean);
   }
   
   private resizeTop(e: MouseEvent, id: number): void {
      const that = this;
      const index = this.list.findIndex(item => item.id == id);
      const scrollY = that.$el.scrollTop;
      
      function resize(e: MouseEvent) {
         const newY = e.clientY - 30 + scrollY;
         that.list[index].coord.splice(1, 1, newY);
         that.list[index].height -= e.movementY;
      }

      function clean(this: any, e: MouseEvent) {
         this.removeEventListener('mousemove', resize);
         this.removeEventListener('mouseup', clean);
      }

      window.addEventListener('mousemove', resize);
      window.addEventListener('mouseup', clean);
   }

   private resizeBottom(e: MouseEvent, id: number): void {
      const that = this;
      const index = this.list.findIndex(item => item.id == id);
      const scrollY = that.$el.scrollTop;

      function resize(e: MouseEvent) {
         const newY = e.clientY - 30 + scrollY;
         that.list[index].height += e.movementY;
      }

      function clean(this: any, e: MouseEvent) {
         this.removeEventListener('mousemove', resize);
         this.removeEventListener('mouseup', clean);
      }

      window.addEventListener('mousemove', resize);
      window.addEventListener('mouseup', clean);
   }

   private resizeTopLeft(e: MouseEvent, id: number): void {
      const that = this;
      const index = this.list.findIndex(item => item.id == id);

      function resize(e: MouseEvent) {
         const newX = (e.clientX - that.left + scrollX);
         const newY = e.clientY - 30 + scrollY;
         that.list[index].coord.splice(0, 1, newX);
         that.list[index].coord.splice(1, 1, newY);
         that.list[index].height -= e.movementY;
         that.list[index].width -= e.movementX;
      }

      function clean(this: any, e: MouseEvent) {
         this.removeEventListener('mousemove', resize);
         this.removeEventListener('mouseup', clean);
      }

      window.addEventListener('mousemove', resize);
      window.addEventListener('mouseup', clean);
   }

   private resizeBottomLeft(e: MouseEvent, id: number): void {
      const that = this;
      const index = this.list.findIndex(item => item.id == id);

      function resize (e: MouseEvent) {
         const newX = (e.clientX - that.left + scrollX);
         that.list[index].coord.splice(0, 1, newX);
         that.list[index].height += e.movementY;
         that.list[index].width -= e.movementX;
      }

      function clean(this: any, e: MouseEvent) {
         this.removeEventListener('mousemove', resize);
         this.removeEventListener('mouseup', clean);
      }

      window.addEventListener('mousemove', resize);
      window.addEventListener('mouseup', clean);
   }

   private resizeTopRight(e: MouseEvent, id: number): void {
      const that = this;
      const index = this.list.findIndex(item => item.id == id);
      
      function resize(e: MouseEvent) {
         const newY = e.clientY - 30 + scrollY;
         that.list[index].coord.splice(1, 1, newY);
         that.list[index].height -= e.movementY;
         that.list[index].width += e.movementX;
      }
      
      function clean(this: any, e: MouseEvent) {
         this.removeEventListener('mousemove', resize);
         this.removeEventListener('mouseup', clean);
      }

      window.addEventListener('mousemove', resize);
      window.addEventListener('mouseup', clean);
   }

   private resizeBottomRight(e: MouseEvent, id: number): void {
      const that = this;
      const index = this.list.findIndex(item => item.id == id);
      
      function resize(e: MouseEvent) {
         that.list[index].height += e.movementY;
         that.list[index].width += e.movementX;
      }
      
      function clean(this: any, e: MouseEvent) {
         this.removeEventListener('mousemove', resize);
         this.removeEventListener('mouseup', clean);
      }

      window.addEventListener('mousemove', resize);
      window.addEventListener('mouseup', clean);
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
