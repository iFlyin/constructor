<template>
   <div class="input-view">
      <label class="input-label">{{label}}: </label>
      <components class="input" :is="component" :val="value"/>
   </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import ElReadonly from './ReadOnly.vue';
import ElInput from './Input.vue';
import ElInputNumber from './InputNumber.vue';
import ElTextarea from './TextArea.vue';
import ElDatepicker from './DatePicker.vue';
import ElSelect from './ElSelect.vue';

@Component({
   components: {
      ElReadonly,
      ElInput,
      ElTextarea,
      ElDatepicker,
      ElSelect,
      ElInputNumber,
   },
   props: {
      label: {
         type: String,
         default: 'Имя поля',
      },
      labelWidth: {
         type: Number,
         default: 240,
      },
      component: {
         type: String,
         required: true,
      },
      cms: {
         type: Object,
         required: true,
      }
   }
})
export default class InputView extends Vue {
   private label!: 'string';
   private cms!: any; 

   private get value(): any {
      if (this.cms.props.id) {
         if(this.cms.hasOwnProperty(this.label)) {
            return this.cms[this.label];
         } else {
            return this.cms.props[this.label];
         }
      } else return null;
   }
   // private console() {
   //    console.log(this.cms);
   // }
}
</script>


<style lang="scss" scoped>
   .input-view {
      display: flex;
      flex-flow: row wrap;
      align-items: flex-start;
      box-sizing: border-box;
      padding: 5px 20px;
      border: 1px dashed grey;
      margin: 5px;
   }

   .input-label {
      box-sizing: border-box;
      padding: 5px 0;
   }

   .input {
      box-sizing: border-box;
      padding: 5px 0;
   }

</style>
