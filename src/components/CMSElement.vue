<template>
    <div 
        :class="{'layout-cms': true, 'layout-cms-active': isSelected}" 
        :style="layoutCMSstyle"
        @click.stop.prevent="select({ id: item.props.id, type: 'CMS' })"
    >
        <div class="layout-cms-header" @mousedown.stop="move($event)" v-html="lookName(item.props.look)"/>
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
            zoom: 'getZoom',
            selected: 'getSelected',
            lookName: 'getLookName',
            // перенести или нет
            webEffect: 'getWebEffect',
        }),
    },
    methods: {
        ...mapMutations('CMS', {
            setEffect: 'setCMSeffect',
            select: 'setSelected',
        }),
    },
})
export default class CMSElement extends Vue {
    // описать интерфейс СMS!!!
    public item!: any;
    public zoom!: number;
    // переделать объект селекта и описать его интерфейс!!!
    public selected!: number;

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

    public move(e: MouseEvent): void { this.$emit('movement', { event: e, id: this.item.props.id }); }
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
        border-style: solid;
        border-color: #2c3e50;
    }

    &-name {
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 5px;  
    }

}
</style>
