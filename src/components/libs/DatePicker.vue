<template>
   <input type="date" :disabled="!val">
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
@Component({ props: { val: { required: true } } })
export default class DatePicker extends Vue {} 
</script>