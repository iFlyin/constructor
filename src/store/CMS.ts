import http from './axios';
import intersect from 'path-intersection';

export default {
   namespaced: true,
   state: {
      systems_id: 'New system',
      selected: 0,
      selectedType: 'none',
      screenList: [
         {
            type: 'screen',
            name: 'Главный экран',
            width: 400,
            height: 320,
            props: { id: -1 },
            coord: [40, 40],
            active: true,
         }
      ],
      cmsList: new Array(),
      weblook: new Array(),
      webeffect: new Array(),
      effect2screen: {
         1: 'Экран с плитками',
         2: 'Экран с фильтрами',
         3: 'Экран с параметрами',
         4: 'Экран с задачами',
         5: 'Экран мастер-деталь',
         6: 'Экран таблица-мемо',
         7: 'Экран таблица-поля',
         8: 'Экран таблица-мемо',
         10: 'Статичная страница',
         21: 'Экран дерево-поля ',
         22: 'Экран поиска документа',
         27: 'Экран просмотра документа',
      },
      prop_type: {
         systems_id: {
            desc: 'Cистема (подсистема), в которой используется данный раздел/СЭМД', 
            type: 'el-readonly',
         },
         id: {
            desc: 'Код элемента(уник.)',
            type: 'el-readonly',
         },
         parent_id: {
            desc: 'Код родительского элемента веб-приложения',
            type: 'el-readonly',
         },
         name: {
            desc: 'Экранное краткое наименование элемента при прорисовке веб-интерфейса',
            type: 'el-input',
         },
         fullname: {
            desc: 'Экранное полное наименование элемента при прорисовке веб-интерфейса', 
            type: 'el-input',
         },
         description: {
            desc: 'Описание элемента',
            type: 'el-textarea',
         },
         look: {
            desc: 'Как нарисовать элемент на экране',
            type: 'el-readonly'
         },
         effect: {
            desc: 'Что делать по инициации элемента',
            type: 'el-select',
         },
         add_params: {
            desc: 'Дополнительные параметры прорисовки веб-приложения',
            type: 'el-textarea'
         },
         group_number: {
            desc: 'Порядковый номер элемента внутри группы с заданным parent_id',
            type: 'el-input-number'
         },
         d_start: { 
            desc: 'Дата создания записи в РИИСЗ',
            type: 'el-datepicker',
         },
         d_fin: {
            desc: 'Дата логического удаления записи при обновлении/удалении данных в РИИСЗ',
            type: 'el-datepicker',
         },
         d_modif: {
            desc: 'Дата актуализации записи при любом обновлении данных в РИИСЗ',
            type: 'el-datepicker',
         },
         db_function_name: {
            desc: 'Наименование функции БД, вызываемой из данного веб-элемента',
            type: 'el-textarea',
         },
         db_function_params: {
            desc: 'Параметры функции db_function_name',
            type: 'el-textarea',
         },
         fields_list: {
            desc: 'Список полей для хранеия списка заголовков таблицы',
            type: 'el-textarea',
         },
         gui_icon: {
            desc: 'Наименование ресурса веб-приложения, соответствующего иконке элемента',
            type: 'el-select',
         },
         check_right: {
            desc: 'Код права, наличие которого у пользователя, разрешает доступ к данному веб-элементу',
            type: 'el-select',
         },
      },
      prop_default: {
         d_start: null,
         f_fin: null,
         d_modif: null,
         name: 'Имя компонента',
         fullname: 'Имя компонента',
         description: null,
         group_number: null,
         db_function_name: null,
         db_function_params: null,
         fields_list: null,
         gui_icon: null,
         add_params: null,
         check_right: null,
      },
      effectLink: [1, 2, 3, 4, 5, 6, 7, 8, 10, 21, 22, 27],
   },
   getters: {
      getScreenList(state: any) { return state.screenList},
      getScreen(state: any) { return state.screen },
      getBlock(state: any) { return state.block},
      getWebLook(state: any) { return state.weblook },
      getWebEffect(state: any) { return state.webeffect },
      getCMSlist(state: any) { return state.cmsList},
      getProp(state: any) { return state.prop_default },
      getPropList(state: any) { return state.prop_type },
      getSelected(state: any) { return state.selected },
      getSelectedType(state: any) { return state.selectedType },
      getSystemID (state: any) { return state.systems_id },
   },
   mutations: {
      add2screenList(state: any, payload: any): void {
         state.screenList.push(payload);
      },
      delFromScreenList(state: any, payload: any): void {
         state.screenList.splice(payload, 1);
      },
      deleteCMS(state: any, payload: any): void {
         state.cmsList.splice(payload, 1);
      },
      clearCMSeffect(state: any, payload: any):void {
         const index = state.cmsList.findIndex((el: any) => el.props.id === payload);
         if (index > -1) {state.cmsList[index].effect = ''; }
      },
      changeScreenId(state: any, payload: any): void {
         const CMSindex = state.cmsList.findIndex((el: any) => el.props.id === payload.id);
         const effect = state.cmsList[CMSindex].effect;

         if (payload.value != '') {
            const index = state.screenList.findIndex((el: any) => el.props.id === payload.value);
            const screen = state.screenList[index];
            screen.props.id = payload.id;
            screen.name = state.effect2screen[effect];
         }
      },
      saveWebLook(state: any, payload: any) {
         state.weblook = payload; 
      },
      saveWebEffect(state: any, payload: any) {
         state.webeffect = payload;
      },
      setCMSeffect(state: any, payload: any) {
         const CMSindex = state.cmsList.findIndex((el: any) => el.props.id == payload.id);
         const CMSpath = state.cmsList[CMSindex];
         CMSpath.effect = payload.v;
         const parentIndex = state.screenList.findIndex((el: any) => el.props.id === CMSpath.props.parent_id);
         const parentPath = state.screenList[parentIndex];
         const parent = {
            X: parentPath.coord[0],
            Y: parentPath.coord[1],
            W: parentPath.width,
            H: parentPath.height,
         }

         const CMS = {
            X: CMSpath.coord[0] + parent.X,
            Y: CMSpath.coord[1] + parent.Y,
            W: CMSpath.width,
            H: CMSpath.height,
         };
         const CMScenter = {
            X: CMS.X + (CMS.W /2),
            Y: CMS.Y + (CMS.H /2),
         }
         
         const path1 = rectConstructor(parent.X, parent.Y, parent.W, parent.H);
         const path2 = lineConstructor(CMScenter.X, CMScenter.Y, CMScenter.X, CMScenter.Y + 10000);

         let X = ((CMScenter.X - 200) > 0) ? (CMScenter.X - 200) : 0;
         let Y = intersect(path1, path2)[0].y + 100;
         
         const effect = CMSpath.effect;
         const check = state.effect2screen.hasOwnProperty(effect);

         const childIndex = state.screenList.findIndex((el: any) => el.props.id === payload.id);

         if (childIndex != -1) {
            X = state.screenList[childIndex].coord[0];
            Y = state.screenList[childIndex].coord[1];
            clear(payload.id);
         }
         
         if (check) {
            const newScreen = {
               type: 'screen',
               // typeName: 'Экран',
               width: 400,
               height: 320,
               active: true,
               props: { id: payload.id },
               coord: [X, Y],
               name: state.effect2screen[effect],
            }
            state.screenList.push(newScreen);
         }

         function rectConstructor(x: number, y: number, w: number, h: number): string {
            return `M${x},${y}L${x + w},${y}L${x + w},${y + h}L${x},${y + h}Z`;
         }

         function lineConstructor(x1: number, y1: number, x2: number, y2: number): string {
            return `M${x1},${y1}L${x2},${y2}`
         }

         function clear (id: any) {
            const list = state.cmsList.filter((el: any) => el.props.parent_id == id);
            if (list.length > 0) {
               for (const child of list) {
                  clear(child.props.id);
                  const childIndex = state.cmsList.findIndex((el: any) => el.props.id == child.id);
                  state.cmsList.splice(childIndex, 1);
               }
            }
            const newIndex = state.screenList.findIndex((item: any) => item.props.id == id);
            if (newIndex !== -1) {
               state.screenList.splice(newIndex, 1);
            }
         }
      },
      setSelected(state: any, payload: any) {
         state.selected = payload.id;
         state.selectedType = payload.type;
         // const index = state.cmsList.findIndex((cms: any) => cms.props.id == payload.id);
         // console.log(state.cmsList[index]);
      },
      setValue(state: any, payload: any) {
         const key = payload.key;
         const value = payload.v;
         const index = state.cmsList.findIndex((cms: any) => cms.props.id == payload.id);
         const cms = state.cmsList[index];
         cms[key] = value;
      }
   },
   actions: {
      asyncGetLook: async (context: any) => {
         try { 
            const {data} = await http.get('get/get_web_look_from_manual?manual=web_look');
            context.commit('saveWebLook', data);
         } catch(err) {
            console.log(err);
         }
      },
      asyncGetEffect: async (context: any) => {
         try {
            const {data} = await http.get('get/get_web_effect_from_manual?manual=web_effect');
            context.commit('saveWebEffect', data);
         } catch (err) {
            console.log(err);
         }
      },
      asyncGetCMS: async (context: any) => {
         try {
            const {data}: any = await http.get('get/get_cms');
            const sortById: any[] = {data}.data.sort((a: any, b: any)=>{
               if (a.id < b.id) {
                  return -1;
               } else if (a.id > b.id) {
                  return 1;
               } else {
                  return console.log("ошибка ID не могут быть равными")
               }
            })
            const length = sortById.length
            const lastID = sortById[length-1].id;
            // console.log(lastID);
         } catch (err) {
            console.log(err);
         }
      }
   }
};
