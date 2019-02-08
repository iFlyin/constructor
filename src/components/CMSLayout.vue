<template>
   <div 
      class="layout"
      @drop.stop="drop($event)"
      @click.prevent="select({
         id: 0,
         type: 'none',
      })"
      @keyup.delete="del()"
      tabindex="0"
      @mousewheel.prevent="wheel($event)"
      :style="{ zoom: zoom }"
   >
      <cms-screen 
         v-for="(item, index) of screenList"
         :key="index"
         :selected="selected"
         :item="item"
         :zoom="zoom"
         :list="list"
         :screenList="screenList"
         @select="select($event)"
         @movement="movement($event)"
         @resize="resize($event)"
         @drop="drop($event)"
         @change="changeId($event)"
      />
      <!-- {{list}} -->
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
      ...mapGetters('CMS', {
         screenList: 'getScreenList',
         list: 'getCMSlist',
         addProps: 'getProp',
         selected: 'getSelected',
         selectedType: 'getSelectedType',
      }),
   },
   methods: {
      ...mapMutations('CMS', {
         add2screenList: 'add2screenList',
         changeId: 'changeScreenId',
         deleteScreen: 'delFromScreenList',
         clearEffect: 'clearCMSeffect',
         deleteCMS: 'deleteCMS',
         select: 'setSelected',
      }),
   }
})

export default class LayoutBL extends Vue {
   // описать интерфейс объекта и придать типу массива
   private list!: any[];
   private id: number = 0;
   private screenId: number = -1;
   private left!: number;
   private selected!: number;
   private selectedType!: string;
   private zoom: number = 1;
   private screenList!: any[];
   private addProps: any;
   private add2screenList!: any;
   private changeId!: any;
   private deleteScreen!: any;
   private clearEffect!: any;
   private deleteCMS!: any;

   private drop(payload: any): void {
      const e: any = payload.event;
      const id: number = payload.id;
      let item;
      try {
         item = JSON.parse(e.dataTransfer.getData('block')); 
      } catch (err) {
         console.log(err);
         return;
      }
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
      item.props.id = ++this.id;
      item.props.parent_id = id;
      for (const key in this.addProps) { item.props[key] = this.addProps[key]; }
      this.list.push(item);
      const focusEl: any = this.$el;
      focusEl.focus();
   }

   private del(): void {
      const selected = this.selected;
      const type = this.selectedType;
      let index: any = null;
      const clear = (id: any) => {
         const list = this.list.filter((el: any) => el.props.parent_id == id);
         if (list.length > 0) {
            for (const child of list) {
               clear(child.props.id);
               const childIndex = this.list.findIndex((el: any) => el.props.id == child.props.id);
               this.deleteCMS(childIndex);
            }
         }
         const newIndex = this.screenList.findIndex(item => item.props.id == id);
         if (newIndex !== -1) {
            this.deleteScreen(newIndex);
         }
      }
      if (selected != 0 && selected !=-1) {
         if (type === 'Screen') {
            this.clearEffect(selected);
            clear(selected);
         } else if (type === 'CMS') {
            index = this.list.findIndex((el: any) => el.props.id == selected);
            clear(selected);
            this.deleteCMS(index);
         } else {
            console.log('ошибка');
         }
      }
   }

   private movement(payload: any): void {
      const type = payload.type;
      const arr = (type==='screen') ? this.screenList : this.list;
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
      const index = arr.findIndex(item => item.props.id == id);
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
         arr[index].coord = [x, y];
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
      const index = this.screenList.findIndex(item => item.props.id == id);
      const scrollX = that.$el.scrollLeft;
      const scrollY = that.$el.scrollTop;

      function onResize(e: MouseEvent) {
         const newX = (e.clientX - that.left - parentOffsetX) / that.zoom + scrollX;
         const newY = (e.clientY - 30 - parentOffsetY) / that.zoom + scrollY;

         if (direction.indexOf('left') !== -1) {
            if (newX > 0) {
               that.screenList[index].coord.splice(0, 1, newX);
               that.screenList[index].width -= e.movementX / that.zoom;
            } else {
               that.screenList[index].coord.splice(0, 1, 0);
            }
         } else if (direction.indexOf('right') !== -1) { 
            that.screenList[index].width += e.movementX / that.zoom;
         }
         
         if (direction.indexOf('top') !== -1) {
            if (newY > 0) {
               that.screenList[index].coord.splice(1, 1, newY);
               that.screenList[index].height -= e.movementY / that.zoom;
            } else  {
               that.screenList[index].coord.splice(1, 1, 0);
            }
         } else if (direction.indexOf('bottom') !== -1) { 
            that.screenList[index].height += e.movementY / that.zoom;
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
      console.log(e);
      const index = this.list.findIndex(el => el.props.id == e.id);
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
