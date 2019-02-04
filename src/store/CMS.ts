import http from './axios';

export default {
   namespaced: true,
   state: {
      // components: [
      //    {
      //       type: 'screen',
      //       name: 'Экран',
      //       width: 200,
      //       height: 120
      //    },
      //    {
      //       type: 'item',
      //       name: 'Компонент',
      //       width: 120,
      //       height: 80,
      //       effect: 0,
      //    }
      // ],
      screen: {
         type: 'screen',
         typeName: 'Экран',
         width: 400,
         height: 320
      },
      block: {
         type: 'block',
         width: 160,
         height: 150,
      },
      weblook: new Array(),
   },
   getters: {
      // getComponents(state: any): void { return state.components; },
      getScreen(state: any): void { return state.screen },
      getBlock(state: any): void { return state.block},
      getWebLook(state: any): void { return state.weblook }
   },
   mutations: {
      saveWebLook(state: any, payload: any) {
         state.weblook = payload; 
         // console.log(state.weblook);
      }
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
      }
   }
};
