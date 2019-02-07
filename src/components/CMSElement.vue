<template>
   <div
      class="layout-item"
      :class="{'layout-item-active': selected == item.id}"
      :style="{
         'z-index': (item.id == selected) ? '1000000' : '',
         left: (item.coord[0]) + 'px',
         top: item.coord[1] + 'px',
         width: item.width + 'px',
         
         'border-width': 2 / zoom + 'px',
      }"
      @click.stop.prevent="$emit('select', {
         id: item.id,
         type: 'CMS',
      })"
   >
      <div class="layout-item-wrapper">
         <div class="layout-item-content">
            <div 
               class="layout-item-header"
               @drop.stop
               @mousedown.stop.prevent="$emit('movement', {
                  event: $event,
                  id: item.id,
               })"
            >
               {{item.typeName}}
            </div>   
            <div 
               class="layout-item-canvas"
               @drop.stop="$emit('drop', {
                  event: $event,
                  id: item.id,
               })"
               @mousedown.stop
            >
               <div class="layout-item-row">
                  <div class="layout-item-id">{{item.id}}</div>
                  <div 
                     class="layout-item-name" 
                     :contenteditable="editable" 
                     @dblclick="editable = true"
                     @keyup.delete.stop
                  >
                     {{item.name}}
                  </div>
               </div>
               <div class="layout-item-row">
                  <el-select 
                     :options="effectAvailable"
                     :selected="item.effect"
                     :label="'Эффект'"
                     :name="'name'"
                     @select="setEffect({
                        v: $event,
                        id: item.id,
                     }), effect = $event"
                  />
               </div>
               <div class="layout-item-row" v-if="!item.link && linkAvailable">
                  <el-select
                     :options="screenList.filter(el => el.id < -1)"
                     :label="'Переход'"
                     :name="'id'"
                     :selected="linkTo"
                     @select="checkLink($event, item.id)"
                  />
               </div>
            </div>
         </div>
      </div>
   
   </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { mapGetters, mapMutations } from 'vuex';
import ElSelect from '@/components/libs/Select.vue';

@Component({
   components: { ElSelect },
   props: {
      item: {
         type: Object,
         required: true,
      },
      zoom: {
         type: Number,
         required: true,
      },
      selected: {
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
   },
   computed: {...mapGetters('CMS', {webEffect: 'getWebEffect'})},
   methods: {...mapMutations('CMS', {setEffect: 'setCMSeffect'})}
})
export default class CMSElement extends Vue {
   private editable = false;
   private item!: any;
   private webEffect!: any[];
   private setEffect!: any;
   private effect: any = '';
   private linkTo: string = '';
   private effectLink: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 19, 21, 22, 27];

   private get linkAvailable(): boolean {
      let result = false;
      for (const i of this.effectLink) {
         if (i == this.effect) {
            return result = true;
         }
      }
      return result;
   }

   private get effectAvailable(): any[] {
      let result = this.webEffect;
      if (this.item.link) {
         return result = this.webEffect.filter((el: any) => {
            return (this.effectLink.findIndex((item: any) => item == el.id) !== -1);
         })
      } 
      return result
   }

   private checkLink(e: any, id: number): void {
      if (e) {
         this.$emit('change', {
            value: e,
            id: id,
         })
         this.linkTo = e;
      } else {
         this.linkTo = '';
      }
   }
}
</script>

<style lang="scss" scoped>
   .layout-item {
      border-style: solid;
      border-color: black;
      box-sizing: border-box;
      z-index: 100;
      position: absolute;
      border-radius: 10px;
      // overflow: hidden;

      &-wrapper {
         width: 100%;
         height: 100%;
         position: relative;
      }
      
      &-content {
         background-color: #fff;;
         border-radius: 10px;
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
         // border-top: 1px solid black;
         display: flex;
         justify-content: center;
         align-items: center;
         user-select: none;
         cursor: move;
      }

      &-canvas {
         flex: 1 1 auto;
         overflow: auto;
         position: relative;
      }

      &-active {
        border-color: red !important;
      }

      &-row {
         display: flex;
         justify-content: space-between;
         border-top: 1px solid #000;
      }

      &-id {
         padding: 5px;
         border-right: 1px solid black;
         display: flex;
         justify-content: center;
         align-items: center;
      }

      &-name {
         padding: 5px;
         display: flex;
         justify-content: center;
         align-items: center;
      }
   }
</style>

