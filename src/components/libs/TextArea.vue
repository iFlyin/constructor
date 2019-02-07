<template>
   <textarea :style="{resize: 'vertical'}" :disabled="!val"></textarea>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
@Component({ props: { val: { required: true } } })
export default class TextArea extends Vue {} 
</script>