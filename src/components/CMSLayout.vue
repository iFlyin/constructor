<template>
    <div
        class="layout"
        tabindex="0"
        :style="{ zoom: zoom }"
        @drop.stop="drop($event)"
        @click.prevent="select({
            id: 0,
            type: 'none',
        })"
        @keyup.delete="del()"
        @mousewheel.stop.prevent="wheel($event)"
    >
        <cms-screen 
            v-for="(screen, index) of screenList"
            :key="index"
            :item="screen"
            @select="select($event)"
            @movement="movement($event)"
            @resize="resize($event)"
            @drop="drop($event)"
            @change="changeId($event)"
        />
    </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { mapMutations, mapGetters } from 'vuex';
import CmsScreen from '@/components/CMSScreen.vue';
// import intersect  from 'path-intersection';

@Component({
    components: { CmsScreen },
    props: { left: { type: Number, required: true } },
    computed: {
        ...mapGetters('CMS', {
            id: 'getID',
            zoom: 'getZoom',
            screenList: 'getScreenList',
            cmsList: 'getCMSlist',
            // заменить или удалить
            addProps: 'getProp',
            // Объединить в объект
            selected: 'getSelected',
            selectedType: 'getSelectedType',
        }),
    },
    methods: {
        ...mapMutations('CMS', {
            // где нибудь используется еще?
            add2screenList: 'add2screenList',
            // вынести целиком во vuex и вызывать в скрине!!!
            addCMS: 'add2cmsList',
            // нужен еще?
            changeId: 'changeScreenId',
            // 
            deleteScreen: 'delFromScreenList',
            deleteCMS: 'deleteCMS',   
            // используетя ли еще?
            clearEffect: 'clearCMSeffect',         
            select: 'setSelected',
            setID: 'setID',
            setZoom: 'setZoom',
            // пусто?
            setScroll: 'setScroll',
        }),
    },
})

export default class LayoutBL extends Vue {
    // описать интерфейс объекта и придать типу массива
    private screenList!: any[];          // getScreenList
    private add2screenList!: any;       
    private cmsList!: any[];             // getCMSlist
    private addCMS!: any;
    private id!: number;
    private setID: any;
    private left!: number;
    private selected!: number;
    private selectedType!: string;
    private zoom!: number;
    private addProps!: any;
  
   private changeId!: any;
   private deleteScreen!: any;
   private clearEffect!: any;
   private deleteCMS!: any;
   private select!: any;
   private setZoom!: any;

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
      const centerX = item.params.width/2;
      const centerY = item.params.height/2;
      const scrollX = e.target.scrollLeft;
      const scrollY = e.target.scrollTop;
      let posX = e.offsetX / this.zoom - centerX;
      if (posX < 0) { posX = 0 }
      let posY = e.offsetY / this.zoom - centerY;
      if (posY < 0) { posY = 0 }
      item.params.X = posX + scrollX;
      item.params.Y = posY + scrollY;
      this.setID(this.id + 1);
      item.props.id = this.id;
      item.props.parent_id = (id === -1) ? null : id;
      for (const key in this.addProps) { item.props[key] = this.addProps[key]; }
        this.addCMS(item);
      const focusEl: any = this.$el;
      focusEl.focus();
   }

   private del(): void {
      const selected = this.selected;
      const type = this.selectedType;
      let index: any = null;
      const clear = (id: any) => {
         const list = this.cmsList.filter((el: any) => el.props.parent_id == id);
         if (list.length > 0) {
            for (const child of list) {
               clear(child.props.id);
               const childIndex = this.cmsList.findIndex((el: any) => el.props.id == child.props.id);
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
            index = this.cmsList.findIndex((el: any) => el.props.id == selected);
            clear(selected);
            this.deleteCMS(index);
         } else {
            console.log('ошибка');
         }
      }
      this.select({
         id: 0,
         type: 'none',
      });
   }
    // вынести иил перенести в другой компонент или разбить на 2 функции
   private movement(payload: any): void {
    //    console.log(payload);
      const type = payload.type;
      const arr = (type==='Screen') ? this.screenList : this.cmsList;
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
      let parentID: number;
      let parentIndex: number;
      let parent: any;
      let maxX: number;
      let maxY: number;
      if (type!=='Screen') {
         parentID = (arr[index].props.parent_id === null) 
            ? -1
            : arr[index].props.parent_id;
         parentIndex = this.screenList.findIndex((el: any) => el.props.id === parentID)
         parent = this.screenList[parentIndex];
         maxX = parent.params.width - 170;
         maxY = parent.params.height - 180;
      }
      
      function move(e: MouseEvent): void {
         x = (e.clientX - offsetX - that.left) / that.zoom  + scrollX - parentOffsetX;
         if (x < 0) { x = 0; }
         if (maxX) { if (x > maxX) { x = maxX} }
         y = (e.clientY - 30 - offsetY) / that.zoom + scrollY - parentOffsetY;
         if (y < 0) { y = 0; }
         if (maxY) { if (y > maxY) { y = maxY} }
        //  console.log(x + ' : ' + maxX);
         arr[index].params.X = x;
         arr[index].params.Y = y;
      }

      function clean(this: any, e: MouseEvent): void {
         this.removeEventListener('mousemove', move);
         this.removeEventListener('mouseup', clean);
      }

      window.addEventListener('mousemove', move);
      window.addEventListener('mouseup', clean);
   }

    // однозначно перенести в скрин
   private resize(payload: any): void {
      const e: MouseEvent = payload.event;
      // console.log(payload);
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
         const path = that.screenList[index].params;
         const newX = (e.clientX - that.left - parentOffsetX) / that.zoom + scrollX;
         const newY = (e.clientY - 30 - parentOffsetY) / that.zoom + scrollY;
         const minWidth = payload.minWidth;
         const minHeight = payload.minHeight;
         const moveX = e.movementX / that.zoom;
         const moveY = e.movementY / that.zoom;

         if (direction.indexOf('left') !== -1) {
            if (newX > 0) {
               if (path.width - moveX > minWidth) {
                  path.width -= moveX; 
                  path.X = newX;
               } else { path.width =  minWidth; }
            } else {
               path.X = 0;
            }
         } else if (direction.indexOf('right') !== -1) { 
            if (path.width + moveX > minWidth) { path.width += moveX; } else { path.width =  minWidth; }
         }
         
         if (direction.indexOf('top') !== -1) {
            if (newY > 0) {
               if (path.height - moveY > minHeight) { 
                  path.height -= moveY; 
                  path.Y = newY; 
               } else { path.height = minHeight; }
            } else  {
               path.Y = 0;
            }
         } else if (direction.indexOf('bottom') !== -1) { 
            if (path.height + moveY > minHeight) { path.height += moveY; } else { path.height = minHeight; }
         }
      }

      function clean(this: any, e: MouseEvent) {
         this.removeEventListener('mousemove', onResize);
         this.removeEventListener('mouseup', clean);
      }

      window.addEventListener('mousemove', onResize);
      window.addEventListener('mouseup', clean);
   }

   private wheel(e: any) { 
      this.setZoom({
         el: this.$el,
         e: e,
      });
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
