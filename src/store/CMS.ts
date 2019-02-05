import http from './axios';

export default {
   namespaced: true,
   state: {
      screenList: [
         {
            type: 'screen',
            name: 'cms?effect=0&addParam=0',
            width: 400,
            height: 320,
            id: -1,
            coord: [40, 40],
            active: true,
         }
      ],
      cmsList: new Array(),
      screen: {
         type: 'screen',
         typeName: 'Экран',
         width: 400,
         height: 320,
         active: false,
      },
      block: {
         type: 'block',
         width: 160,
         height: 150,
      },
      weblook: new Array(),
   },
   getters: {
      getScreenList(state: any) { return state.screenList},
      getScreen(state: any) { return state.screen },
      getBlock(state: any) { return state.block},
      getWebLook(state: any) { return state.weblook },
      getCMSlist(state: any) { return state.cmsList}
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
         const list = state.cmsList.filter((el: any) => el.effect === payload);
         for (const item of list) { item.effect = 0; }
      },
      changeScreenId(state: any, payload: any): void {
         const CMSindex = state.cmsList.findIndex((el: any) => el.id === payload.id);
         state.cmsList[CMSindex].effect = payload.id;
         const ScreenIndex = state.screenList.findIndex((el: any) => el.id === payload.value);
         const screen = state.screenList[ScreenIndex];
         screen.id = payload.id;
         screen.name = `cms?cmsId=${payload.id}&effect=1`;
         screen.active = true;
      },
      saveWebLook(state: any, payload: any) {
         state.weblook = payload; 
      },
   },
   actions: {
      asyncGetLook: async (context: any) => {
         try { 
            const {data} = await http.get('get/get_web_look_from_manual?manual=web_look');
            console.log({data})
            context.commit('saveWebLook', data);
         } catch(err) {
            console.log(err);
         }
      },
      asyncGetEffect: async (context: any) => {
         try {
            const {data} = await http.get('get/get_web_effect_from_manual?manual=web_effect');
            console.log({data});
         } catch (err) {
            console.log(err)
         }
      },
   }
};
