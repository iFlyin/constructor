<template>
  <div id="constructor">
    <main-menu/>
    <panel-left :width="LeftWidth" @resize="LeftWidth = $event">
      <accordion :list="[
        {
          name: LeftWidth,
          list: components,
          d$d: true,
        },
        {
          name: RightWidth,
          list: [{name: 1}],
        },
        {
          name: FooterHeight,
          list: [],
        }
      ]"/>
    </panel-left>
    <div class="flex-column">
      <div class="flex-row">
        <app-canvas :width="canvasWidth" :height="canvasHeight">
          <layout-b-l :left="LeftWidth"/>
        </app-canvas>
        <panel-right :width="RightWidth" @resize="RightWidth = $event"/> 
      </div>
      <panel-footer :height="FooterHeight" @resize="FooterHeight = $event"/>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { mapGetters } from 'vuex';
import MainMenu from '@/components/MainMenu.vue';
import PanelLeft from '@/components/PanelLeft.vue';
import PanelRight from '@/components/PanelRight.vue';
import PanelFooter from '@/components/PanelFooter.vue';
import AppCanvas from '@/components/Canvas.vue';
import Accordion from '@/components/Accordion.vue';
import LayoutBL from '@/components/LayuotBL.vue';

@Component ({
  components: { MainMenu, PanelLeft, PanelRight, PanelFooter, AppCanvas, Accordion, LayoutBL },
  computed: {
    ...mapGetters('businessLogic', {
      components: 'getComponents',
    }),
  },
})

export default class UMLDesigner extends Vue {
  private LeftWidth: number = 240;
  private RightWidth: number = 200;
  private FooterHeight: number = 132;
  private windowWidth: number = window.innerWidth;
  private windowHeight: number = window.innerHeight;

  private get canvasWidth(): number {
    return this.windowWidth - this.LeftWidth - this.RightWidth;
  }

  private get canvasHeight(): number {
    return this.windowHeight - this.FooterHeight - 30;
  }

  private mounted(): void {
    const that = this;    
    window.addEventListener('resize', function(){
      that.windowWidth = window.innerWidth;
      that.windowHeight = window.innerHeight;
    })
  }
}
</script>

<style lang="scss" scoped>
  #constructor {
    display: flex;
    flex-flow: row wrap;
    width: 100%;
    height: 100%;
    overflow: hidden;
  }

  .flex {
    &-element {
      // flex: 1 1 auto;
    }

    &-column {
      display: flex;
      flex-flow: column nowrap;
    }

    &-row {
      display: flex;
      flex-flow: row nowrap;
    }
  }

</style>
