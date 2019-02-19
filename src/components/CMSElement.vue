<template>
    <div 
        :class="{'layout-cms': true, 'layout-cms-active': isSelected}" 
        :style="layoutCMSstyle"
        @click.stop.prevent="select({ id: item.props.id, type: 'CMS' })"
    >
        <div 
            class="layout-cms-header" 
            @mousedown.stop="movement($event, item.props.id)" 
            v-html="lookName(item.props.look)"
        />
        <div class="layout-cms-content">
            <div class="layout-cms-row">
                <div class="layout-cms-id" :style="{'border-width' : 1 / zoom + 'px'}" v-html="item.props.id"/>
                <div class="layout-cms-name" v-html="item.props.name"/>
            </div>
            <div class="layout-cms-row">
                <!-- переписать на стандартный селект!!! -->
                <el-select 
                    :options="webEffect"
                    :selected="item.props.effect"
                    :label="'Эффект'"
                    :name="'name'"
                    @select="setEffect({
                               v: $event,
                               id: item.props.id,
                    }), effect = $event"
                />
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { mapGetters, mapMutations } from 'vuex';
// заменить на универсальный!!!
import ElSelect from '@/components/libs/Select.vue';

// вынести в файл интерфейсов
interface cmsStyle {
    'z-index': string;
    'top': string;
    'left': string;
    'width': string;
    'border-width': string;
}

@Component({
    components: { ElSelect },
    props: { item: { type: Object, required: true, } },
    computed: {
        ...mapGetters('CMS', {
            cmsList: 'getCMSlist',
            screenList: 'getScreenList',
            zoom: 'getZoom',
            selected: 'getSelected',
            lookName: 'getLookName',
            // перенести или нет
            webEffect: 'getWebEffect',
            panel: 'getPanel'
        }),
    },
    methods: {
        ...mapMutations('CMS', {
            setEffect: 'setCMSeffect',
            select: 'setSelected',
            setXY: 'setXY',
        }),
    },
})
export default class CMSElement extends Vue {
    // описать интерфейс СMS!!!
    public item!: any;
    public zoom!: number;
    // переделать объект селекта и описать его интерфейс!!!
    public selected!: number;
    public panel!: any;
    public cmsList!: any;
    public screenList!: any;

    // описать эффекты и вынести их дальше!!!
    public webEffect!: any[];
    
    // описать функции...
    public setEffect!: any;
    public select!: any;
    public lookName!: any;

    public get isSelected(): boolean { return this.item.props.id === this.selected; }
    public get layoutCMSstyle(): cmsStyle {
        return {
            'z-index': this.item.props.id === this.selected
                ? '1000000'
                : '',
            'top': this.item.params.Y + 'px',
            'left': this.item.params.X + 'px',
            'width': this.item.params.width + 'px',
            'border-width': 2 / this.zoom + 'px',
        }
    }

    private movement(e: any, id: any): void {
        const that = this;
        const layout = this.$parent.$parent.$el;
        const parent_id = this.item.props.parent_id === null
            ? -1
            : this.item.props.parent_id;
        const index = this.cmsList.findIndex((item: any) => item.props.id === id);
        const parentIndex = this.screenList.findIndex((el: any) => el.props.id === parent_id);
        const parent = this.screenList[parentIndex];
        const parentOffsetX: number = parent.params.X;
        const parentOffsetY: number = parent.params.Y + 40;
        const scrollX = layout.scrollLeft;
        const scrollY = layout.scrollTop;
        const offsetX = e.offsetX;
        const offsetY = e.offsetY;

        const el: any = this.$el;
        const cmsHeight = el.offsetHeight;
        // console.log(cmsHeight);
        
        // 4 значение бордера!!!
        const maxX = parent.params.width - this.item.params.width - (4 / this.zoom);
        // расчитать высоту!
        const maxY = (parent.params.height - 40) - cmsHeight - (5 / this.zoom);
      
        function move(e: MouseEvent): void {
            let x = (e.clientX - offsetX - that.panel.left) / that.zoom  + scrollX - parentOffsetX;
            if (x < 0) { x = 0; }
            if (x > maxX) { x = maxX}
            let y = (e.clientY - 30 - offsetY) / that.zoom + scrollY - parentOffsetY;
            if (y < 0) { y = 0; }
            if (y > maxY) { y = maxY}
            // заменить на seter vuex
            that.cmsList[index].params.X = x;
            that.cmsList[index].params.Y = y;
        }

        function clean(this: any, e: MouseEvent): void {
            this.removeEventListener('mousemove', move);
            this.removeEventListener('mouseup', clean);
        }

        window.addEventListener('mousemove', move);
        window.addEventListener('mouseup', clean);
    }
}
</script>

<style lang="scss" scoped>

.layout-cms {
    box-sizing: border-box;
    position: absolute;
    z-index: 100;
    background-color: #2c3e50;
    border-style: solid;
    border-color: transparent;
    border-radius: 10px;
    color: #fff;
    box-shadow: 0 2px 8px rgba(0, 0, 0, .33);

    &-active {
        border-color: red !important;
    }

    &-header {
        box-sizing: border-box;
        overflow: hidden;
        display: flex;
        justify-content: center;
        min-height: 40px;
        max-height: 80px;
        padding: 10px;
        cursor: move;
        user-select: none;
    }
      
    &-content {
        display: flex;
        flex-flow: column nowrap;
    }

    &-row {
        overflow: hidden;
        display: flex;
         
        &:first-child{
            background-color: #fff;
            color: #2c3e50;
        }
    }

    &-id {
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 5px;
        // border-style: solid;
        // border-color: #2c3e50;
        border-right: 1px solid #2c3e50;
    }

    &-name {
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 5px;  
    }

}

</style>
