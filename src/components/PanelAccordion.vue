<template>
   <div class="accordion">
      <div 
         class="accordion-item" 
         :class="(activePanel===index) ? 'accordion-active' : ''"
         v-for="(panel, index) of list" :key="index"
      >
         <div class="accordion-header" @click="activePanel=index">
            {{panel.name}}
         </div>
         <div class="accordion-content">
            <div 
               class="accordion-content-item" 
               v-for="(item, index) of panel.list" 
               :key="index"
               :draggable="panel.d$d"
               @dragstart="dragStart($event, item, item.params.type)"
            >
            {{weblookName(item.props.look)}}
            </div>
         </div>
      </div>
   </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { mapGetters } from 'vuex';

@Component({
   components: {},
   props: {
      list: {
         type: Array,
         required: true,
      }
   },
   computed: {...mapGetters('CMS', { weblookName: 'getLookName' })}
})
export default class Accordion extends Vue {
   private activePanel: number = 0;

   private dragStart(e: any, item: any, type: string) {
      e.dataTransfer.setData(type, JSON.stringify(item));
   }
}
</script>

<style lang="scss" scoped>
   .accordion {
      display: flex;
      flex-flow: column nowrap;
      height: 100%;
      width: 100%;
      overflow: hidden;

      &-item {
         display: flex;
         flex-flow: column nowrap;
         box-sizing: border-box;
         border-top: 1px solid white;
      }

      &-active {
         flex: 1 1 auto;

         & .accordion-content {
            display: block;
            flex: 1 1 auto;
            border-top: 1px solid white;

            &-item {
               padding: 10px;
               outline: 1px dashed #2c3e50;
               margin: 5px;
               user-select: none;
            }
         }
      }

      &-header {
         height: 44px;
         background-color: #2c3e50;
         color: #fff;
         box-sizing: border-box;
         display: flex;
         justify-content: flex-start;
         align-items: center;
         padding: 10px;
         font-size: 15px;
         font-weight: bold;
         user-select: none;
         // box-shadow: 0px -1px 1px 0px rgba(0, 0, 0, .35) inset;
      }

      &-content {
         display: none;
         border-right: 1px solid #2c3e50;
         box-sizing: border-box;
      }
   }
</style>
