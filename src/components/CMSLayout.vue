<template>
   <div 
      class="layout"
      @dragover.stop="$event.preventDefault()"
      @drop.stop="drop($event)"
      @click.prevent="select(0)"
      @keyup.delete="del()"
      tabindex="0"
      @mousewheel.prevent="wheel($event)"
      :style="{ zoom: zoom }"
   >
      <cms-screen 
         v-for="(item, index) of list.filter(el => el.type === 'screen')"
         :key="index"
         :selected="selected"
         :item="item"
         :zoom="zoom"
         :list="list"
         @select="select($event)"
         @movement="movement($event)"
         @resize="resize($event)"
         @drop="dropInside($event)"
         @change="change($event)"
      />
      {{list}}
   </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { mapMutations, mapGetters } from 'vuex';
import intersect  from 'path-intersection';
import CmsScreen from '@/components/CMSScreen.vue';

@Component({
   components: { CmsScreen },
   props: {
      left: {
         type: Number,
         required: true,
      }
   },
   computed: {
      ...mapGetters('CMS', []),
   },
   methods: {
      ...mapMutations('CMS', []),
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

   private dropInside(payload: any): void {
      
      const e: any = payload.event;
      const id: number = payload.id;
      let item;
      try {
         item = JSON.parse(e.dataTransfer.getData('block')); 
      } catch (err) {
         console.log(err);
         return;
      }
      // console.log(item);
      const centerX = item.width/2;
      const centerY = item.height/2;
      const scrollX = e.target.scrollLeft;
      const scrollY = e.target.scrollTop;
      item.coord = new Array();
      let posX = e.offsetX / this.zoom - centerX;
      if (posX < 0) { posX = 0 }
      let posY = e.offsetY / this.zoom - centerY;
      if (posY < 0) { posY = 0 }
      item.coord.push(posX + scrollX);
      item.coord.push(posY + scrollY);
      item.id = ++this.id;
      item.parent = id;
      this.list.push(item);
      const focusEl: any = this.$el;
      focusEl.focus();
   }

   private select(id: number): void {
      this.selected = id;
      // const focusEl: any = this.$el;
      // focusEl.focus();
   }

   private del(): void {
      let index = null;
      if (this.selected != 0) {
         index = this.list.findIndex(item => item.id == this.selected);
         const childsArr = this.list.filter(item => item.parent == this.selected);
         const effectArr = this.list
            .filter(item => item.type === "item")
            .filter(item => item.effect === this.selected);

         if (index || index === 0) {
            for (const item of effectArr) {
               item.effect = 0;
            }
            for (const item of childsArr) {
               const id = item.id;
               const childIndex = this.list.findIndex(item => item.id == id);
               this.list.splice(childIndex, 1);
            }
            this.list.splice(index, 1);
            this.selected = 0;
         }
      }
   }

   private movement(payload: any): void {
      const e = payload.event;
      let parentOffsetX: number = 0;
      let parentOffsetY: number = 0;
      if (payload.hasOwnProperty('parentOffset')){
         parentOffsetX = payload.parentOffset[0];
         parentOffsetY = payload.parentOffset[1];
      }
      const id = payload.id;
      const scrollX = this.$el.scrollLeft;
      const scrollY = this.$el.scrollTop;
      const index = this.list.findIndex(item => item.id == id);
      let x: number;
      let y: number;
      const that = this;
      const offsetX = e.offsetX;
      const offsetY = e.offsetY;
      
      function move(e: MouseEvent): void {
         x = (e.clientX - offsetX - that.left) / that.zoom  + scrollX - parentOffsetX;
         if (x < 0) { x = 0; }
         y = (e.clientY - 30 - offsetY) / that.zoom + scrollY - parentOffsetY;
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

   private resize(payload: any): void {
      const e: MouseEvent = payload.event;
      let parentOffsetX: number = 0;
      let parentOffsetY: number = 0;
      if (payload.hasOwnProperty('parentOffset')){
         parentOffsetX = payload.parentOffset[0];
         parentOffsetY = payload.parentOffset[1];
      }
      const id: number = payload.id;
      const direction: string[] = payload.direction
      const that = this;
      const index = this.list.findIndex(item => item.id == id);
      const scrollX = that.$el.scrollLeft;
      const scrollY = that.$el.scrollTop;

      function onResize(e: MouseEvent) {
         const newX = (e.clientX - that.left - parentOffsetX) / that.zoom + scrollX;
         const newY = (e.clientY - 30 - parentOffsetY) / that.zoom + scrollY;

         if (direction.indexOf('left') !== -1) {
            if (newX > 0) {
               that.list[index].coord.splice(0, 1, newX);
               that.list[index].width -= e.movementX / that.zoom;
            } else {
               that.list[index].coord.splice(0, 1, 0);
            }
         } else if (direction.indexOf('right') !== -1) { 
            that.list[index].width += e.movementX / that.zoom;
         }
         
         if (direction.indexOf('top') !== -1) {
            if (newY > 0) {
               that.list[index].coord.splice(1, 1, newY);
               that.list[index].height -= e.movementY / that.zoom;
            } else  {
               that.list[index].coord.splice(1, 1, 0);
            }
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
            if (this.$el.scrollWidth > this.$el.clientWidth) {
               console.log('scroll - top')
            }
         }
      }
   }

   private change(e: any): void {
      const index = this.list.findIndex(el => el.id == e.id);
      this.list[index].effect = e.value;
   }
}
</script>


<style lang="scss" scoped>
   .layout {
      min-width: 100%;
      min-height: 100%;
      display: flex;
      z-index: 1;
      position: relative;
      outline: none;
      overflow: auto;
   }

   .line-container {
      top: 0;
      left: 0;
      position: absolute;
      width: 100%;
      height: 100%;
      background-color: green;
   }
</style>
