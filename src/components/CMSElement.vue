<template>
   <div
      class="layout-cms"
      :class="{'layout-cms-active': selected == item.props.id}"
      :style="{
         'z-index': (item.props.id == selected) ? '1000000' : '',
         left: (item.params.X) + 'px',
         top: item.params.Y + 'px',
         width: item.params.width + 'px',
         'border-width': 2 / zoom + 'px',
      }"
      @click.stop.prevent="$emit('select', {
         id: item.props.id,
         type: 'CMS',
      })"
   >
      <div class="layout-cms-wrapper">
         <div class="layout-cms-content">
            <div 
               class="layout-cms-header"
               @drop.stop
               @mousedown.stop.prevent="$emit('movement', {
                  event: $event,
                  id: item.props.id,
               })"
            >
               {{weblookName(item.props.look)}}
            </div>   
            <div 
               class="layout-cms-canvas"
               @drop.stop="$emit('drop', {
                  event: $event,
                  id: item.props.id,
               })"
               @mousedown.stop
            >
               <div class="layout-cms-row">
                  <div 
                     class="layout-cms-id"
                     :style="{'border-width' : 1 / zoom + 'px'}"
                  >{{item.props.id}}</div>
                  <div 
                     class="layout-cms-name" 
                     :contenteditable="editable" 
                     @dblclick="editable = true"
                  >
                     {{item.props.name}}
                  </div>
               </div>
               <div class="layout-cms-row">
                  <el-select 
                     :options="webEffect"
                     :selected="item.props.effect"
                     :label="'Эффект'"
                     :name="'name'"
                     @select="setEffect({
                        v: $event,
                        id: item.props.id,
                     }), effect = $event"
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
      list: {
         type: Array,
         required: true,
      },
      screenList: {
         type: Array,
         required: true,
      }
   },
   computed: {...mapGetters('CMS', {
      webEffect: 'getWebEffect',
      selected: 'getSelected',
      weblookName: 'getLookName',
   })},
   methods: {...mapMutations('CMS', {setEffect: 'setCMSeffect'})}
})
export default class CMSElement extends Vue {
   private editable = false;
   private item!: any;
   private webEffect!: any[];
   private setEffect!: any;
   private effect: any = '';
   private linkTo: string = '';

   // private checkLink(e: any, id: number): void {
   //    if (e) {
   //       this.$emit('change', {
   //          value: e,
   //          id: id,
   //       })
   //       this.linkTo = e;
   //    } else {
   //       this.linkTo = '';
   //    }
   // }
}
</script>

<style lang="scss" scoped>
   .layout-cms {
      border-style: solid;
      border-color: #2c3e50;
      background-color: #2c3e50;
      box-sizing: border-box;
      z-index: 100;
      position: absolute;
      border-radius: 10px;
      color: #fff;
      box-shadow: 0 2px 8px rgba(0, 0, 0, .33);

      &-wrapper {
         width: 100%;
         height: 100%;
         position: relative;
      }
      
      &-content {
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
         // border-top: 1px solid #fff;
         &:first-child{
            background-color: #fff;
            color: #2c3e50;
         }
      }

      &-id {
         padding: 5px;
         border-right: 2px solid #2c3e50;
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

