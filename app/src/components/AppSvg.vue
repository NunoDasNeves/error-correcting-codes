<template>
  <svg version="1.1"
       baseProfile="full"
       xmlns="https://www.w3.org/2000/svg">
       <slot></slot>
  </svg>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'

@Component
export default class AppSvg extends Vue {

}
</script>
