<template>
  <div id="constructor">
    <main-menu @newproject="initialize()" @initByID="asyncGetCMSbyId({
      id: $event,
      callback: clearHistory,
    })"/>
    <panel-left :width="panel.left" @resize="panelResize({dir: 'left', val: $event})" v-if="init">
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
          <layout-b-l :left="panel.left"/>
        </app-canvas>
        <panel-right :width="panel.right" :height="canvasHeight" @resize="panelResize({dir: 'right', val: $event})" v-if="init"/> 
      </div>
      <!-- <panel-footer :height="panel.right" :width="canvasWidth + panel.right" @resize="panelResize({dir: 'footer', val: $event})"/> -->
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { mapGetters, mapActions, mapMutations} from 'vuex';
import { history, snapshot } from '@/mixins';
import MainMenu from '@/components/PanelMenu.vue';
import PanelLeft from '@/components/PanelLeft.vue';
import PanelRight from '@/components/PanelRight.vue';
import PanelFooter from '@/components/PanelFooter.vue';
import AppCanvas from '@/components/PanelCanvas.vue';
import Accordion from '@/components/PanelAccordion.vue';
import LayoutBL from '@/components/CMSLayout.vue';

@Component ({
  components: { MainMenu, PanelLeft, PanelRight, PanelFooter, AppCanvas, Accordion, LayoutBL },
  mixins: [ history, snapshot ],
  computed: {
    ...mapGetters('CMS', {
      weblook: 'getWebLook', 
      system_id: 'getSystemID',
      init: 'getInitStatus',
      panel: 'getPanel',
    }),
  },
  methods: { 
    ...mapActions('CMS', ['asyncGetLook', 'asyncGetEffect', 'asyncGetCMSbyId', 'asyncGetID']), 
    ...mapMutations('CMS', {
      addFirstScreen: 'initNewProject', 
      clearAll: 'clearAll',
      panelResize: 'panelResize',
    }),
  },
})

export default class UMLDesigner extends Vue {
  public panel!: any;
  private windowWidth: number = window.innerWidth;
  private windowHeight: number = window.innerHeight;
  private asyncGetLook!: any;
  private asyncGetEffect!: any;
  private asyncGetID!: any;
  private asyncGetCMSbyId!: any;
  private weblook!: any[];
  private screen!: any;
  private block!: any;
  private system_id!: any;
  private addFirstScreen!: any;
  private clearAll!: any;
  private init!: boolean;
  private panelResize!: any;
  private clearHistory!: any;
  private saveSnapshot!: any;

  private get components(): any[] {
    const newArr: any[] = new Array();
    for (const item of this.weblook) {
      const newItem = {
        params: {
          type: 'CMS',
          width: 160,
          height: 150,
        },
        props: {
          systems_id: this.system_id,
          look: item.id,
          effect: '',
        }
      }
      newArr.push(newItem);
    }
    return newArr;
  }

  private get canvasWidth(): number {
    return this.windowWidth - this.panel.left - this.panel.right;
  }

  private get canvasHeight(): number {
    return this.windowHeight - this.panel.footer - 30;
  }

  public initialize() {
    const init = () => {
      this.addFirstScreen();
      this.asyncGetID();
      this.panelResize({dir: 'left', val: 240});
      this.panelResize({dir: 'right', val: 240});
    }
    if (!this.init) {
      init();
    } else {
      this.clearAll();
      init();
      this.clearHistory();
    }
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

