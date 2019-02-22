<template>
   <div class="svg-wrapper">
      <div 
         class="layout-item"
         :style="{
            'z-index': (childSelected) 
                ? '1000000' : isSelected 
                    ? '1111' : '',
            left: item.params.X + 'px',
            top: item.params.Y + 'px',
            width: item.params.width + 'px',
            height: item.params.height + 'px',
            'border-width': 2 / zoom + 'px',
            'border-color': '#2c3e50',
            'border-style': 'solid'
         }"
         @click.stop.prevent="select({ id: item.props.id, type: 'Screen' })"
      >
         <div class="layout-item-wrapper">
            <screen-resize v-if="isSelected" :zoom="zoom" @resize="resize($event)"/>
            <div class="layout-item-content">
               <div class="layout-item-header" @drop.stop @mousedown.stop="movement($event)" :style="{
                  background: isSelected ? '#009688' : '#2c3e50'
               }">
                  <!-- вынести в getter!!! -->
                  {{ (item.props.id &lt; 0) ? -(item.props.id) : '' }} {{item.props.name || 'Пустой экран'}}
               </div>   
               <div 
                   class="layout-item-canvas"
                   @mousedown.stop.prevent
                   @dragover.stop.prevent
                   @drop.stop="drop({
                       event: $event,
                       id: item.props.id,
                   })"
               >  
                  <cms-element 
                      v-for="(component, id) of childsList" 
                      :key="id" :item="component"
                      :data-id="component.props.id"
                  />
               </div>
            </div>  
         </div>
      </div>
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
                  fill="#009688"
              />
            </marker>
         </defs>
         <path
            v-for="(line, index) of lines" :key="index"
            :d="line"
            :stroke="isSelected ? '#009688' : '#2c3e50'"
            :stroke-width="1.2 / zoom"
            marker-end="url(#arrowhead)"
         />
      </svg>
   </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { mapGetters, mapMutations } from 'vuex';
import { snapshot } from '@/mixins';
import CmsElement from './CMSElement.vue';
import intersect from 'path-intersection';
import ScreenResize from './CMSResize.vue';

@Component({
    components: {CmsElement, ScreenResize},
    props: { item: { type: Object, required: true } },
    mixins: [ snapshot ],
    computed: {
        ...mapGetters('CMS', {
            id: 'getID',
            cmsList: 'getCMSlist',
            zoom: 'getZoom',
            screenList: 'getScreenList',
            selected: 'getSelected',
            addProps: 'getProp',
            panel: 'getPanel',
        }),
    },
    methods: {
        ...mapMutations('CMS', {
            setID: 'setID',
            addCMS: 'add2cmsList',
            select: 'setSelected',
        })
    }
})
export default class CMSScreen extends Vue {
   private el!: any;
   private item!: any;
   private selected!: number;
   // добавить интерфейс объектов
   private zoom!: any;
   private cmsList!: any[];
   private screenList!: any[];
   public panel!: any;
   public setID!: any;
   public addCMS!: any;
   public addProps!: any;
   public id!: any;
   public saveSnapshot!: any;
   
   private get X(): number { return this.item.params.X; }
   private get Y(): number { return this.item.params.Y; }
   private get width(): number { return this.item.params.width; }
   private get height(): number { return this.item.params.height; }
   private get centerX(): number { return this.width / 2; }
   private get centerY(): number { return this.height / 2; }
   private get path(): string { return this.rectConstructor(this.X, this.Y, this.width, this.height); }

   public get isSelected(): boolean { return this.item.props.id === this.selected; }

   private get childsList(): any[] {
      const screen = this.item.props.id;
      const fixId = (screen === - 1) ? null : screen;
      return this.cmsList.filter(el => el.props.parent_id == fixId);
   }

    // поправить при зуме!!!
   private get minWidth(): number {
      let minWidth = 300;
      for (const child of this.childsList) {
         const childMaxX = child.params.X + 160 + (10 * this.zoom);
         if (childMaxX > minWidth) { minWidth = childMaxX; }
      }
      // console.log(minWidth);
      return minWidth;
   }

   private get minHeight(): number {
      let minHeight = 200;
      if (this.childsList.length > 0) {
         for (const child of this.childsList) {
            const el: any = this.$el.querySelector(`div[data-id="${child.props.id}"]`);
            const childMaxY = child.params.Y + el.offsetHeight + 40 + (8 / this.zoom);
            if (childMaxY > minHeight) { minHeight = childMaxY; }
         }
      }
      // console.log(minHeight);
      return minHeight;
   }

   private get childSelected(): boolean {
      let result = false;
      for (const child of this.childsList) {if (child.props.id == this.selected) {return result = true;}}
      return result;
   }

    // убрать ошибки!!!
   private get lines(): any[] {
      //ЦМС соответствует экран!
      const childWithEffect = this.childsList.filter(el => {
         for (const screen of this.screenList) {
            if (el.props.id == screen.props.id) { return true }
         }
      });
      const lines: any = new Array();
      for (const obj of childWithEffect) {
         // const name = "id" + obj.props.id;
         // const arr = new Array();
         const startX = obj.params.X + (obj.params.width / 2) + this.X;
         const startY = obj.params.Y + (obj.params.height / 2) + this.Y + 40;
         const targetInd = this.screenList.findIndex(el => el.props.id == obj.props.id);
         const targetObj = this.screenList[targetInd];
         const targetX = targetObj.params.X - 10;
         const targetY = targetObj.params.Y - 10;
         const targetW = targetObj.params.width + 20;
         const targetH = targetObj.params.height + 20;

         const targetPath = this.rectConstructor(targetX, targetY, targetW, targetH);
         const path = `M${startX},${startY} L${targetX + (targetW/2)},${targetY + (targetH/2)}`;
         // const intersect = intersect(path, targetPath);
         // const realStartX = intersect(path, this.path)[0].x;
         // const realStartY = intersect(path, this.path)[0].y;
         if(intersect(path, targetPath).length) {
            const realEndX = intersect(path, targetPath)[0].x;
            const realEndY = intersect(path, targetPath)[0].y;
            const realPath = this.lineConstructor(startX, startY, realEndX, realEndY);
            lines.push(realPath);
         }
      }
      return lines;
   }

   private resize(payload: any): void {
      const that = this;
      const layout = this.$parent.$el;
      const e = payload.event;
      const direction: string[] = payload.direction;
      const id = this.item.props.id;
      const index = this.screenList.findIndex(item => item.props.id == id);
      const scrollX = layout.scrollLeft;
      const scrollY = layout.scrollTop;

      function onResize(e: MouseEvent) {
         const path = that.screenList[index].params;
         const newX = (e.clientX - that.panel.left) / that.zoom + scrollX;
         const newY = (e.clientY - 30) / that.zoom + scrollY;
         const minWidth = that.minWidth;
         const minHeight = that.minHeight;
         const moveX = e.movementX / that.zoom;
         const moveY = e.movementY / that.zoom;

         if (direction.indexOf('left') !== -1) {
            if (newX > 0) {
               if (path.width - moveX > minWidth) {
                  path.width -= moveX; 
                  path.X = newX;
               } else { path.width =  minWidth; }
            } else { path.X = 0; }
         } else if (direction.indexOf('right') !== -1) { 
            if (path.width + moveX > minWidth) { path.width += moveX; } else { path.width =  minWidth; }
         }
         
         if (direction.indexOf('top') !== -1) {
            if (newY > 0) {
               if (path.height - moveY > minHeight) { 
                  path.height -= moveY; 
                  path.Y = newY; 
               } else { path.height = minHeight; }
            } else  { path.Y = 0; }
         } else if (direction.indexOf('bottom') !== -1) { 
            if (path.height + moveY > minHeight) { path.height += moveY; } else { path.height = minHeight; }
         }
      }

      function clean(this: any, e: MouseEvent) {
         this.removeEventListener('mousemove', onResize);
         this.removeEventListener('mouseup', clean);
         that.saveSnapshot();
      }

      window.addEventListener('mousemove', onResize);
      window.addEventListener('mouseup', clean);
   }

   private movement(e: any): void {
      const that = this;
      const layout = this.$parent.$el;
      const index = this.screenList.findIndex(el => el.props.id === this.item.props.id);
      const scrollX = layout.scrollLeft;
      const scrollY = layout.scrollTop;
      const offsetX = e.offsetX;
      const offsetY = e.offsetY;
      
      function move(e: MouseEvent): void {
         let x = (e.clientX - offsetX - that.panel.left) / that.zoom  + scrollX;
         if (x < 0) { x = 0; }
         let y = (e.clientY - 30 - offsetY) / that.zoom + scrollY;
         if (y < 0) { y = 0; }
         // заменить... с хард кода
         that.screenList[index].params.X = x;
         that.screenList[index].params.Y = y;
      }

      function clean(this: any, e: MouseEvent): void {
         this.removeEventListener('mousemove', move);
         this.removeEventListener('mouseup', clean);
         that.saveSnapshot();
      }

      window.addEventListener('mousemove', move);
      window.addEventListener('mouseup', clean);
   }

   private drop(payload: any): void {
      const e: any = payload.event;
      const id: number = payload.id;
      let item;
      try {
         item = JSON.parse(e.dataTransfer.getData('CMS')); 
      } catch (err) {
         console.log(err);
         return;
      }
      // console.log(item)
      const centerX = item.params.width/2;
      const centerY = item.params.height/2;
      let posX = e.offsetX / this.zoom - centerX;
      const rightX = posX + item.params.width;
      if (posX < 0) { posX = 0 }
      if (rightX > this.width) { posX = this.width - item.params.width - (4 / this.zoom); }
      let posY = e.offsetY / this.zoom - centerY;
      const bottomY = posY + item.params.height;
      if (posY < 0) { posY = 0 }
      // 70 костыль, потому как точную высоту не узнать!
      if (bottomY > (this.height - 40)) { posY = (this.height - 70) - item.params.height - (4 / this.zoom); }
      item.params.X = posX;
      item.params.Y = posY;
      this.setID(this.id + 1);
      item.props.id = this.id;
      item.props.parent_id = (id === -1) ? null : id;
      // console.log(this.addProps)
      for (const key in this.addProps) { item.props[key] = this.addProps[key];}
      this.addCMS({
         item: item,
         callback: this.saveSnapshot,
      });
      const focusEl: any = this.$el;
      focusEl.focus();
      // this.saveSnapshot();
   }

   private rectConstructor(x: number, y: number, w: number, h: number): string {
      return `M${x},${y}L${x + w},${y}L${x + w},${y + h}L${x},${y + h}Z`;
   }

   private lineConstructor(x1: number, y1: number, x2: number, y2: number): string {
      return `M${x1},${y1}L${x2},${y2}`
   }

   // private mounted() {
   //    const that = this;
   //    this.el = this.$el.firstChild;
   //    this.el.addEventListener('wheel', function(this: any, e: any) {
   //      if(this.offsetHeight < that.minHeight) {
   //       //   добавить функцию задающию размер!!!
   //          // that.item.params.height = that.minHeight;
   //          console.log('бум!');
   //      };
   //    })
   // }
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
         // border-bottom: 1px solid #2c3e50;
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
