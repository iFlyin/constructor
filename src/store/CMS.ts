import http from './axios';
import intersect from 'path-intersection';
// import { weblook, webeffect } from './localhost';

export default {
   namespaced: true,
   state: {
      init: false,
      panel: {
         left: 0,
         right: 0,
         // footer: 0,
      },
      systems_list: [
         {
            uuid: '57f7d380-15bc-4bf4-9137-27182bb69826',
            name: 'РИИСЗ',
         },
         {
            uuid: 'b8a99645-0bd6-4052-a0f8-aaf612328274',
            name: 'СИСЗЛ',
         },
         {
            uuid: 'fe0b9fbc-0b8b-4a3a-96ee-332ae84b5fa8',
            name: 'ИС МВ',
         },
         {
            uuid: '1cb87d64-6bb1-4762-abc9-f9f5a81291a7',
            name: 'Паллиативная помощь',
         },
      ],
      systems_id: 'New system',
      selected: 0,
      selectedType: 'none',
      id: 0,
      zoom: 1,
      screenList: new Array(),
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
         24: 'Внутренний фрэйм',
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
         name: 'Новый CMS',
         fullname: null,
         description: null,
         group_number: null,
         db_function_name: null,
         db_function_params: null,
         fields_list: null,
         gui_icon: null,
         add_params: null,
         check_right: null,
      },
   },
   getters: {
      getInitStatus(state: any) { return state.init },
      getPanel(state: any) { return state.panel},
      getSystemsList(state: any) { return state.systems_list },
      getScreenList(state: any) { return state.screenList},
      getID(state: any) { return state.id },
      getZoom(state: any) {return state.zoom },
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
      getLookName: (state: any) => (id: number) => {
         const index = state.weblook.findIndex((el: any) => el.id === id);
         return (index > -1)
            ? state.weblook[index].name
            : 'Без внешнего вида';
      },
      getEffectName: (state: any) => (id: number) => {
         const index = state.webeffect.findIndex((el: any) => el.id === id);
         return (index > -1)
            ? state.webeffect[index].name
            : 'Не задан';
      }
   },
   mutations: {
      panelResize(state: any, payload: any): void {
         state.panel[payload.dir] = payload.val;
      },
      setID(state: any, payload: any): void {
         state.id = payload;
      },
      setZoom(state: any, payload: any): void {
         const clearZoom = Math.round((state.zoom * 10));
         const event = payload.e;
         // const layout = payload.el;
         // const realWidth = layout.clientWidth * state.zoom;
         // const realHeight = layout.clientHeight * state.zoom;
         // const mouseX = event.clientX - state.panel.left;
         // const mouseY = event.clientY - 30;
         // const offsetX = (mouseX / realWidth) * 100;
         // const offsetY = (mouseY / realHeight) * 100;

         if (event.deltaY > 0) {
            if (clearZoom === 3) {
               state.zoom = 0.3;
            } else {
               state.zoom -= 0.1;
            }
         }
         if (event.deltaY < 0) {
            if (clearZoom === 15) {
               state.zoom = 1.5;
            } else {
               state.zoom += 0.1;
               // const newClientW = (realWidth / state.zoom ) / 2;
               // const newClientH = (realHeight / state.zoom ) / 2;
               // const centerX = layout.clientWidth / 100 * offsetX;
               // const centerY = layout.clientHeight / 100 * offsetY;
               // const scrollX = (centerX - newClientW) > 0
               //    ? centerX - newClientW
               //    : 0;
               // const scrollY = (centerY - newClientH) > 0
               //    ? centerY - newClientH
               //    : 0;
               // layout.scrollLeft += scrollX;
               // layout.scrollTop += scrollY;
            }
         }
      },
      add2screenList(state: any, payload: any): void {
         state.screenList.push(payload);
      },
      add2cmsList(state: any, payload: any): void {
         state.cmsList.push(payload.item);
         payload.callback();
      },
      delFromScreenList(state: any, payload: any): void {
         state.screenList.splice(payload, 1);
      },
      deleteCMS(state: any, payload: any): void {
         state.cmsList.splice(payload, 1);
      },
      clearCMSeffect(state: any, payload: any):void {
         const index = state.cmsList.findIndex((el: any) => el.props.id === payload);
         if (index > -1) {state.cmsList[index].props.effect = ''; }
      },
      changeScreenId(state: any, payload: any): void {
         const CMSindex = state.cmsList.findIndex((el: any) => el.props.id === payload.id);
         const effect = state.cmsList[CMSindex].props.effect;

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
         CMSpath.props.effect = payload.v;
         const parentID = CMSpath.props.parent_id;
         const fixParentID = (parentID) ? parentID : -1;
         const parentIndex = state.screenList.findIndex((el: any) => el.props.id === fixParentID);
         const parentPath = state.screenList[parentIndex];
         const parent = {
            X: parentPath.params.X,
            Y: parentPath.params.Y,
            W: parentPath.params.width,
            H: parentPath.params.height,
         };

         const CMS = {
            X: CMSpath.params.X + parent.X,
            Y: CMSpath.params.Y + parent.Y,
            W: CMSpath.params.width,
            H: CMSpath.params.height,
         };

         const CMScenter = {
            X: CMS.X + (CMS.W /2),
            Y: CMS.Y + (CMS.H /2),
         };

         const path1 = rectConstructor(parent.X, parent.Y, parent.W, parent.H);
         const path2 = lineConstructor(CMScenter.X, CMScenter.Y, CMScenter.X, CMScenter.Y + 10000);

         let X = ((CMScenter.X - 200) > 0) ? (CMScenter.X - 200) : 0;
         let Y = intersect(path1, path2)[0].y + 100;
         const effect = CMSpath.props.effect;
         const check = state.effect2screen.hasOwnProperty(effect);
         // добавить луки и add params!!!

         const childIndex = state.screenList.findIndex((el: any) => el.props.id === payload.id);

         if (childIndex != -1) {
            X = state.screenList[childIndex].params.X;
            Y = state.screenList[childIndex].params.Y;
            clear(payload.id);
         }

         if (check) {
            const newScreen = {
               props: {
                  id: payload.id,
                  name: state.effect2screen[effect],
               },
               params: {
                  type: 'Screen',
                  X,
                  Y,
                  width: 400,
                  height: 320,
               },
            }
            state.screenList.push(newScreen);
         }

         if (payload.callback) { payload.callback(); }

         function rectConstructor(x: number, y: number, w: number, h: number): string {
            return `M${x},${y}L${x + w},${y}L${x + w},${y + h}L${x},${y + h}Z`;
         }

         function lineConstructor(x1: number, y1: number, x2: number, y2: number): string {
            return `M${x1},${y1}L${x2},${y2}`;
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
         cms.props[key] = value;
         payload.callback();
      },
      initNewProject(state: any) {
         state.init = true;
         state.screenList.push({
            props: { 
               id: -1,
               name: 'Главный экран',
            },
            params: {
               type: 'Screen',
               X: 120,
               Y: 40,
               width: 400,
               height: 320,
            }
         })
      },
      clearAll(state: any) {
         state.systems_id = 'New system';
         state.selected = 0;
         state.zoom = 1;
         state.selectedType = 'none';
         state.screenList = new Array();
         state.cmsList = new Array();
      },
      setSystemId(state: any, payload: any) {
         state.systems_id = payload;
      },
      pushAll(state: any, payload: any) {
         (function pushNew (parent_id: any) {
            const CMS: any[] = payload.filter((el: any) => el.parent_id == parent_id);
            for(let i = 0; i < CMS.length; i++) {
               const item = {
                  params: {
                     type: 'CMS',
                     width: 160,
                     height: 150,
                     X: 10,
                     Y: 10,
                  },
                  props: CMS[i],
               }
               state.cmsList.push(item);
               pushNew(CMS[i].id);
            }
         })(null);
         // console.log(state.cmsList)
      },
      saveToFile(state: any, payload: any) {
         console.log(payload);
         const json = {
            cms: state.cmsList,
            screen: state.screenList,
         };
         const el = payload;
         const filename = 'obj.json';
         const blob = new Blob([JSON.stringify(json)], { type: 'application/json' });
         el.setAttribute('href', window.URL.createObjectURL(blob));
         el.setAttribute('download', filename);
         el.dataset.downloadurl = ['application/json', filename, window.URL.createObjectURL(blob)].join(':');
      },
      loadFromFile(state: any, payload: any) {
         const file = payload.file.target.files[0];
         const reader = new FileReader();
         reader.onload = (e: any) => {
            const json = JSON.parse(e.target.result);
            state.cmsList = json.cms;
            state.screenList = json.screen;
            payload.callback();
         };
         reader.readAsText(file);
      },
      saveToService(state: any) {
         for (const CMS of state.cmsList) {
            const obj = JSON.stringify(CMS.props);
            console.log(obj);
         }
      },
   },
   actions: {
      asyncGetLook: async (context: any) => {
         try { 
            const {data} = await http.get('get/get_web_look_from_manual?manual=web_look');
            context.commit('saveWebLook', data);
         } catch(err) {
            console.log(err);
            // context.commit('saveWebLook', weblook);
            // console.log(weblook);
         }
      },
      asyncGetEffect: async (context: any) => {
         try {
            const {data} = await http.get('get/get_web_effect_from_manual?manual=web_effect');
            context.commit('saveWebEffect', data);
         } catch (err) {
            console.log(err);
            // context.commit('saveWebEffect', webeffect);
         }
      },
      asyncGetID: async (context: any) => {
         try {
            const resp: any = await http.get('get/get_cms');
            const sortById: any[] = resp.data.sort((a: any, b: any)=>{
               if (a.id < b.id) {
                  return -1;
               } else if (a.id > b.id) {
                  return 1;
               } else {
                  return console.log("ошибка ID не могут быть равными")
               }
            })
            const length = sortById.length;
            const lastID = sortById[length - 1].id;
            context.commit('setID', lastID);
         } catch (err) {
            console.log(err);
         }
      },
      asyncGetCMSbyId: async (context: any, payload: any) => {
         try {
            const id = payload.id;
            context.commit('clearAll');
            const resp: any = await http.get(`/get/get_cms?systems_id=${id}`);
            context.commit('setSystemId', id);
            context.commit('initNewProject');
            context.commit('panelResize', {dir: 'left', val: 240});
            context.commit('panelResize', {dir: 'right', val: 240});
            context.commit('pushAll', resp.data);
            const data = context.getters.getCMSlist;
            for (const obj of data) {
               context.commit('setCMSeffect', {
                  v: obj.props.effect,
                  id: obj.props.id,
               });
            }
            payload.callback();
            // clear();
            // console.log(data);
         } catch (err) {
            console.log(err);
         }
      }
   }
};
