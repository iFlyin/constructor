<template>
   <div>
   <input type="date" :value="val" :disabled="(val === null)" @input="$emit('change', $event.target.value)">
   </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
@Component({ props: { val: { required: true } } })
export default class DatePicker extends Vue {
   private val!: any;

   // private check(e: any): any{
   //    return console.log(e);
   // }
} 
</script>