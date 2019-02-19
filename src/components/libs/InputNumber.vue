<template>
   <input :disabled="(val === '')" :value="val" type="number" step="1" min="1" @change="$emit('change', $event.target.value)">
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
@Component({ props: { val: { required: true } } })
export default class DatePicker extends Vue {} 
</script>
