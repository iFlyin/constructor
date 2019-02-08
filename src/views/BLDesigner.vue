<template>
  <div id="constructor">
    <main-menu/>
    <panel-left :width="LeftWidth" @resize="LeftWidth = $event">
      <accordion :list="[
        {
          name: 'СMS-web_look',
          list: components,
          d$d: true,
        },
      ]"/>
    </panel-left>
    <div class="flex-column">
      <div class="flex-row">
        <app-canvas :width="canvasWidth" :height="canvasHeight">
          <layout-b-l :left="LeftWidth"/>
        </app-canvas>
        <panel-right :width="RightWidth" :height="canvasHeight" @resize="RightWidth = $event"/> 
      </div>
      <!-- <panel-footer :height="FooterHeight" :width="canvasWidth + RightWidth" @resize="FooterHeight = $event"/> -->
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { mapGetters } from 'vuex';
import { mapActions } from 'vuex';
import MainMenu from '@/components/PanelMenu.vue';
import PanelLeft from '@/components/PanelLeft.vue';
import PanelRight from '@/components/PanelRight.vue';
import PanelFooter from '@/components/PanelFooter.vue';
import AppCanvas from '@/components/Canvas.vue';
import Accordion from '@/components/Accordion.vue';
import LayoutBL from '@/components/CMSLayout.vue';

@Component ({
  components: { MainMenu, PanelLeft, PanelRight, PanelFooter, AppCanvas, Accordion, LayoutBL },
  computed: {
    ...mapGetters('CMS', {
      weblook: 'getWebLook', 
      // screen: 'getScreen',
      // block: 'getBlock',
      system_id: 'getSystemID',
    }),
  },
  methods: { ...mapActions('CMS', ['asyncGetLook', 'asyncGetEffect', 'asyncGetCMS']) },
})

export default class UMLDesigner extends Vue {
  private LeftWidth: number = 240;
  private RightWidth: number = 240;
  private FooterHeight: number = 0;
  private windowWidth: number = window.innerWidth;
  private windowHeight: number = window.innerHeight;
  private asyncGetLook!: any;
  private asyncGetEffect!: any;
  private asyncGetCMS!: any;
  private weblook!: any[];
  private screen!: any;
  private block!: any;
  private system_id!: any;

  private get components(): any[] {
    const newArr: any[] = new Array();
    for (const item of this.weblook) {
      const newItem = {
        type: 'block',
        width: 160,
        height: 150,
    
        typeName: item.name,
        constName: item.const_name,
        effect: '',
        props: {
          systems_id: this.system_id,
          look: item.id,
        }
      }
      newArr.push(newItem);
    }
    return newArr;
  }

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

  private created(): void {
    this.asyncGetLook();
    this.asyncGetEffect();
    this.asyncGetCMS();
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
    // &-element {
    //   // flex: 1 1 auto;
    // }

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

