<template>
   <div class="select">
      <div class="list-wrapper" v-if="show" @click.stop="show = false"></div>
      <label class="select-label" @click="show = !show">
      <span>{{label}}</span>
      <div class="select-button">
         <span class="select-text">{{(selected === '') ? 'Нет' : selected}}</span>
      </div>
      </label>
      <template v-if="show">
         <div 
            class="option-list"
            @mouseover="focus()"
            @mousewheel.stop
            tabindex="0"
         >
            <div class="option-item" value="" @click="select('')">
               Нет
            </div>
            <div 
               class="option-item"
               v-for="(option, index) of options"
               :key="index"
               @click="select(option.id)"
            >
               <!-- {{(option[name] &lt; 0) ? -(option[name]) : option.name}} -->
               {{option.id}}
            </div>
         </div>
      </template>
      {{console}}
   </div>
</template>

<script lang="ts">
import {Vue, Component} from 'vue-property-decorator';
@Component({
   props: {
      options: {
         type: Array,
         default: [],
      },
      selected: {
         type: [String, Number],
         required: true,
      },
      label: {
         type: String,
         default: ''
      },
      name: {
         type: [String, Number],
         required: true,
      }
   }
})
export default class ElSelect extends Vue{
   private show: boolean = false;
   private selected!: any;
   private options!: any;

   private select(v: any): void {
      console.log(v);
      this.show = false;
      this.$emit('select', v);
   }

   private focus(): void {
      const el: any = this.$el;
      el.focus();
   }

   private get console(): any {
      console.log(this.options)
      return
   }
}
</script>


<style lang="scss" scoped>
   .select {
      width: 100%;
      position: relative;
      display: flex;

      &-label {
         width: 100%;
         height: 30px;
         display: flex;
         justify-content: space-between;
         align-items: center;
         cursor: pointer;
         padding: 0 10px;
         user-select: none;
      }

      &-button {
         user-select: none;
         position: relative;
         display: flex;
         justify-content: center;
         align-items: center;
         height: 100%;
         box-sizing: border-box;
         // border: 1px solid #b3b3b3;
         width: 40px;
      }

      &-icon {
         position: absolute;
         top: 0;
         right: 0;
         padding: 0 5px;
      }
   }

   .option-list {
      margin-top: 30px;
      user-select: none;
      position: fixed;
      z-index: 100000000;
      width: auto;
      min-width: 156px;
      max-height: 200px;
      overflow-x: hidden;
      overflow-y: auto;
      background-color: snow;
      outline: 2px solid grey;
   }

   .option-item {
      user-select: none;
      padding: 5px;
      text-align: left;

      &:hover {
         background-color: #b3b3b3;
      }
   }

   .list-wrapper {
      position: fixed;
      // z-index: -1;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      // background-color: red;
   }
</style>
