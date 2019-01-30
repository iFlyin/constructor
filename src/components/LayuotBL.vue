<template>
   <div 
      class="layout"
      @dragover.stop="$event.preventDefault()"
      @drop.stop="drop($event)"
      @click.prevent="selected = 0"
      @keyup.delete="del()"
      tabindex="0"
      @mousewheel.prevent="wheel($event)"
      :style="{
         zoom: zoom
      }"
   >
      <div 
         class="layout-item"
         v-for="(item, index) of list.filter(el => el.type === 'screen')"
         :key="index"
         :style="{
            left: (item.coord[0]) + 'px',
            top: item.coord[1] + 'px',
            width: item.width + 'px',
            height: item.height + 'px',
            'border-width': 2 / zoom + 'px'
         }"
         :data-id="item.id"
         @mousedown.stop.prevent="movement($event)"
         @click.stop.prevent="select($event)"
      >
         <div class="layout-item-wrapper">
            <div class="layout-item-resizer" v-if="item.id == selected">
               <button 
                  class="resizer-grid resizer-top-left" 
                  @mousedown.stop="resize($event, item.id, ['top', 'left'])"
                  :style="{
                     'border-width': 2 / zoom + 'px',
                     padding: 4 / zoom + 'px',
                     top: -12 / zoom + 'px',
                     left: -12 /zoom + 'px',
                  }"
               />
               <button 
                  class="resizer-grid resizer-top" 
                  @mousedown.stop="resize($event, item.id, ['top'])"
                  :style="{
                     'border-width': 2 / zoom + 'px',
                     padding: 4 / zoom + 'px',
                     top: -12 / zoom + 'px',
                     left: `calc(50% - ${6 / zoom}px)`,
                  }"
               />  
               <button 
                  class="resizer-grid resizer-top-right"
                  @mousedown.stop="resize($event, item.id, ['top', 'right'])"
                  :style="{
                     'border-width': 2 / zoom + 'px',
                     padding: 4 / zoom + 'px',
                     top: -12 / zoom + 'px',
                     right: -12 /zoom + 'px',
                  }"
               />
               <button 
                  class="resizer-grid resizer-left" 
                  @mousedown.stop="resize($event, item.id, ['left'])"
                  :style="{
                     'border-width': 2 / zoom + 'px',
                     padding: 4 / zoom + 'px',
                     top: `calc(50% - ${6 / zoom}px)`,
                     left: -12 /zoom + 'px',
                  }"
               />  
               <button 
                  class="resizer-grid resizer-right" 
                  @mousedown.stop="resize($event, item.id, ['right'])"
                  :style="{
                     'border-width': 2 / zoom + 'px',
                     padding: 4 / zoom + 'px',
                     top: `calc(50% - ${6 / zoom}px)`,
                     right: -12 /zoom + 'px',
                  }"
               />                   
               <button 
                  class="resizer-grid resizer-bottom-left" 
                  @mousedown.stop="resize($event, item.id, ['bottom', 'left'])"
                  :style="{
                     'border-width': 2 / zoom + 'px',
                     padding: 4 / zoom + 'px',
                     bottom: -12 / zoom + 'px',
                     left: -12 /zoom + 'px',
                  }"
               />  
               <button 
                  class="resizer-grid resizer-bottom" 
                  @mousedown.stop="resize($event, item.id, ['bottom'])"
                  :style="{
                     'border-width': 2 / zoom + 'px',
                     padding: 4 / zoom + 'px',
                     bottom: -12 / zoom + 'px',
                     left: `calc(50% - ${6 / zoom}px)`,
                  }"
               />   
               <button 
                  class="resizer-grid resizer-bottom-right" 
                  @mousedown.stop="resize($event, item.id, ['bottom', 'right'])"
                  :style="{
                     'border-width': 2 / zoom + 'px',
                     padding: 4 / zoom + 'px',
                     bottom: -12 / zoom + 'px',
                     right: -12 /zoom + 'px',
                  }"
               />
            </div>
            <div class="layout-item-content">
               <div 
                  class="layout-item-header"
                  @drop.stop
               >
                  {{item.name}}   
               </div>   
               <div 
                  class="layout-item-canvas"
                  @drop.stop="dropInside"
               >
                  <div 
                     class="layout-item"
                     v-for="(component, index) of list.filter(el => el.parent == item.id)" :key="index"
                     :style="{
                        left: component.coord[0] + 'px',
                        top: component.coord[1] + 'px',
                        width: component.width + 'px',
                        height: component.height + 'px',
                        'border-width': 2 / zoom + 'px'
                     }"
                     :data-id="component.id"
                     @click.stop.prevent="select($event)"
                     @mousedown.stop
                  >
                     <div class="layout-item-wrapper" >
                        <div class="layout-item-resizer" v-if="component.id == selected">
                           <button 
                              class="resizer-grid resizer-top-left" 
                              @mousedown.stop="resize($event, component.id, ['top', 'left'])"
                              :style="{
                                 'border-width': 2 / zoom + 'px',
                                 padding: 4 / zoom + 'px',
                                 top: -12 / zoom + 'px',
                                 left: -12 /zoom + 'px',
                              }"
                           />
                           <button 
                              class="resizer-grid resizer-top" 
                              @mousedown.stop="resize($event, component.id, ['top'])"
                              :style="{
                                 'border-width': 2 / zoom + 'px',
                                 padding: 4 / zoom + 'px',
                                 top: -12 / zoom + 'px',
                                 left: `calc(50% - ${6 / zoom}px)`,
                              }"
                           />  
                           <button 
                              class="resizer-grid resizer-top-right"
                              @mousedown.stop="resize($event, component.id, ['top', 'right'])"
                              :style="{
                                 'border-width': 2 / zoom + 'px',
                                 padding: 4 / zoom + 'px',
                                 top: -12 / zoom + 'px',
                                 right: -12 /zoom + 'px',
                              }"
                           />
                           <button 
                              class="resizer-grid resizer-left" 
                              @mousedown.stop="resize($event, component.id, ['left'])"
                              :style="{
                                 'border-width': 2 / zoom + 'px',
                                 padding: 4 / zoom + 'px',
                                 top: `calc(50% - ${6 / zoom}px)`,
                                 left: -12 /zoom + 'px',
                              }"
                           />  
                           <button 
                              class="resizer-grid resizer-right" 
                              @mousedown.stop="resize($event, component.id, ['right'])"
                              :style="{
                                 'border-width': 2 / zoom + 'px',
                                 padding: 4 / zoom + 'px',
                                 top: `calc(50% - ${6 / zoom}px)`,
                                 right: -12 /zoom + 'px',
                              }"
                           />                   
                           <button 
                              class="resizer-grid resizer-bottom-left" 
                              @mousedown.stop="resize($event, component.id, ['bottom', 'left'])"
                              :style="{
                                 'border-width': 2 / zoom + 'px',
                                 padding: 4 / zoom + 'px',
                                 bottom: -12 / zoom + 'px',
                                 left: -12 /zoom + 'px',
                              }"
                           />  
                           <button 
                              class="resizer-grid resizer-bottom" 
                              @mousedown.stop="resize($event, component.id, ['bottom'])"
                              :style="{
                                 'border-width': 2 / zoom + 'px',
                                 padding: 4 / zoom + 'px',
                                 bottom: -12 / zoom + 'px',
                                 left: `calc(50% - ${6 / zoom}px)`,
                              }"
                           />   
                           <button 
                              class="resizer-grid resizer-bottom-right" 
                              @mousedown.stop="resize($event, component.id, ['bottom', 'right'])"
                              :style="{
                                 'border-width': 2 / zoom + 'px',
                                 padding: 4 / zoom + 'px',
                                 bottom: -12 / zoom + 'px',
                                 right: -12 /zoom + 'px',
                              }"
                           />
                        </div>
                        <div class="layout-item-content">
                           <div class="layout-item-header" @drop.stop>{{component.id}}</div>   
                           <div class="layout-item-canvas" @drop.stop></div>
                        </div>
                     </div>

                  </div>
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
      let item;
      try {
         item = JSON.parse(e.dataTransfer.getData('screen'));
      } catch (err) {
         console.log(err);
         return;
      }
      const scrollX = this.$el.scrollLeft;
      const scrollY = this.$el.scrollTop;
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
      const focusEl: any = this.$el;
      focusEl.focus();
   }

   private dropInside(e: any): void {
      let item;
      try {
         item = JSON.parse(e.dataTransfer.getData('item')); 
      } catch (err) {
         console.log(err);
         return;
      }
      // console.log(e.target)
      const centerX = item.width/2;
      const centerY = item.height/2;
      const scrollY = e.target.scrollTop;
      item.coord = new Array();
      let posX = e.offsetX;
      if (posX < 0) { posX = 0 }
      let posY = e.offsetY ;
      if (posY < 0) { posY = 0 }
      item.coord.push(posX);
      item.coord.push(posY + scrollY);
      item.id = ++this.id;
      const id = e.target.offsetParent.offsetParent.offsetParent.dataset.id;
      item.parent = id;
      // const index = this.list.findIndex(item => item.id == id);
      this.list.push(item);
   }

   private select (e: MouseEvent): void {
      const target: any = e.target;
      const parent: any = target.offsetParent.offsetParent.offsetParent;
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
      const id: number = e.target.offsetParent.offsetParent.offsetParent.dataset.id;
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
      border-style: solid;
      border-color: black;
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
         display: flex;
         flex-flow: column nowrap;
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

      &-canvas {
         flex: 1 1 auto;
         overflow: auto;
         position: relative;
      }
   }

   .resizer {
      &-grid{
         position: absolute;
         box-sizing: border-box;
         border-style: dashed;
         border-color: grey;
         height: 0;
         outline: none;
         background: transparent;
         
         &:hover {
            border-color: red;
         }
      }
   }
</style>
