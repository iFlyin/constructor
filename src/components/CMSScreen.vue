<template>
   <div>
      <div 
         class="layout-item"
         :style="{
            'z-index': (childSelected) 
               ? '1000000' : (item.props.id == selected)
               ? '1111' : '',
            left: (item.coord[0]) + 'px',
            top: item.coord[1] + 'px',
            width: item.width + 'px',
            height: item.height + 'px',
            'border-width': 2 / zoom + 'px',
            'border-color': (item.active) ? '#2c3e50' : 'grey',
            'border-style': (item.active) ? 'solid' : 'dashed'
         }"
         @click.stop.prevent="$emit('select', {
            id: item.props.id,
            type: 'Screen'
         })"
      >
         <div class="layout-item-wrapper">
            <screen-resize 
               v-if="item.props.id == selected"
               :zoom="zoom"
               :id="item.props.id"
               @resize="$emit('resize', $event)"
            />
            <div class="layout-item-content">
               <div 
                  class="layout-item-header"
                  @drop.stop
                  @mousedown.stop.prevent="$emit('movement', {
                     event: $event,
                     id: item.props.id,
                     type: 'screen',
                  })"
               >
                  {{ (item.props.id &lt; 0) ? -(item.props.id) : '' }} {{item.name || 'Пустой экран'}}
                  <!-- {{svg}} -->
               </div>   
               <div 
                  class="layout-item-canvas"
                  @dragover.stop="$event.preventDefault()"
                  @drop.stop="(item.active) ? $emit('drop', {
                     event: $event,
                     id: item.props.id,
                  }) : ''"
                  @mousedown.stop.prevent
               >  
                  <cms-element
                     v-for="(component, id) of childsList" :key="id"
                     :item="component"
                     :zoom="zoom"
                     :list="list"
                     :screenList="screenList"
                     @select="$emit('select', $event)"
                     @movement="movement($event)"
                     @change="$emit('change', $event)"
                  />
               </div>
            </div>  
         </div>
      </div>
      <div class="svg-wrapper" @resize="console(e)">
         <svg 
            xmlns="http://www.w3.org/2000/svg"
            width="100%"
            height="100%"
            :style="{
               position: 'relative',
               'z-index': 1000,
               overflow: 'visible',
            }"
            class="svg"
         >
            <defs>
               <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="0" refY="3.5" orient="auto">
                 <polygon 
                     :points="`0 0, ${10 * zoom} 3.5, 0 7`"
                     fill="#2c3e50"
                 />
               </marker>
            </defs>
            <path
               v-for="(line, index) of lines" :key="index"
               :d="line"
               :stroke="(item.props.id == selected) ? 'red' : '#2c3e50'"
               :stroke-width="1.2 / zoom"
               marker-end="url(#arrowhead)"
            />
         </svg>
      </div>
   </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import CmsElement from './CMSElement.vue';
import intersect from 'path-intersection';
import ScreenResize from './ScreenResize.vue';

@Component({
   components: {CmsElement, ScreenResize},
   props: {
      selected: {
         type: Number,
         required: true,
      },
      item: {
         type: Object,
         required: true,
      },
      zoom: {
         type: Number,
         required: true,
      },
      list: {
         type: Array,
         required: true,
      },
      screenList: {
         type: Array,
         required: true,
      }
   }
})
export default class CMSScreen extends Vue {
   private selected!: number;
   // добавить интерфейс объектов
   private item!: any;
   private list!: any[];
   private screenList!: any[];
   // private el: any = window.document.querySelector('.svg-wrapper');
   // private svg: any = {
   //    w: this.el.scrollWidth,
   //    h: this.el.scrollHeight,
   // }
   
   private get X(): number { return this.item.coord[0]; }
   private get Y(): number { return this.item.coord[1]; }
   private get width(): number { return this.item.width; }
   private get height(): number { return this.item.height; }
   private get centerX(): number { return this.X + (this.width / 2); }
   private get centerY(): number { return this.Y + (this.height); }
   private get path(): string { return this.rectConstructor(this.X, this.Y, this.width, this.height); }

   private get childsList(): any[] {
      const screen = this.item.props.id;
      const fixId = (screen === - 1) ? '' : screen;
      return this.list.filter(el => el.props.parent_id == fixId);
   }

   private get childSelected(): boolean {
      let result = false;
      // if (this.item.id == this.selected) {
      //    return result = true;
      // }
      for (const child of this.childsList) {
         if (child.props.id == this.selected) {
            return result = true;
         }
      }
      return result;
   }

   private get lines(): any[] {
      const availableScreen = this.screenList.filter(el => el.active === true);  
      const childWithEffect = this.childsList.filter(el => {
         for (const screen of availableScreen) {
            if (el.props.id == screen.props.id) { return true }
         }
      });
      const lines: any = new Array();
      for (const obj of childWithEffect) {
         const name = "id" + obj.props.id;
         const arr = new Array();
         const startX = obj.coord[0] + (obj.width / 2) + this.X;
         const startY = obj.coord[1] + (obj.height / 2) + this.Y + 40;
         const targetInd = availableScreen.findIndex(el => el.props.id == obj.props.id);
         const targetObj = availableScreen[targetInd];
         const targetX = targetObj.coord[0] - 10;
         const targetY = targetObj.coord[1] - 10;
         const targetW = targetObj.width + 20;
         const targetH = targetObj.height + 20;

         const targetPath = this.rectConstructor(targetX, targetY, targetW, targetH);
         const path = `M${startX},${startY} L${targetX + (targetW/2)},${targetY + (targetH/2)}`;
         const realStartX = intersect(path, this.path)[0].x;
         const realStartY = intersect(path, this.path)[0].y;
         const realEndX = intersect(path, targetPath)[0].x;
         const realEndY = intersect(path, targetPath)[0].y;
         const realPath = this.lineConstructor(startX, startY, realEndX, realEndY);
         lines.push(realPath);
      }
      
      return lines;
   }

   private resize(e: any): void {
      const parentX = this.item.coord[0];
      const parentY = this.item.coord[1] + 40;
      e.parentOffset = [parentX, parentY];
      this.$emit('resize', e);
   }

   private movement(e: any): void {
      const parentX = this.item.coord[0];
      const parentY = this.item.coord[1] + 40;
      e.parentOffset = [parentX, parentY];
      this.$emit('movement', e);
   }

   private rectConstructor(x: number, y: number, w: number, h: number): string {
      return `M${x},${y}L${x + w},${y}L${x + w},${y + h}L${x},${y + h}Z`;
   }

   private lineConstructor(x1: number, y1: number, x2: number, y2: number): string {
      return `M${x1},${y1}L${x2},${y2}`
   }
}
</script>

<style lang="scss" scoped>
   .layout-item {
      border-style: solid;
      border-color: #2c3e50;
      box-sizing: border-box;
      z-index: 1001;
      position: absolute;

      &-wrapper {
         width: 100%;
         height: 100%;
         // background: #fff;
         position: relative;
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
         border-bottom: 1px solid #2c3e50;
         display: flex;
         justify-content: center;
         align-items: center;
         user-select: none;
         cursor: move;
         background-color: #2c3e50;
         color: #fff;
      }

      &-canvas {
         flex: 1 1 auto;
         overflow: auto;
         position: relative;
      }
   }

   .svg-wrapper {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 99%;
   }

</style>
