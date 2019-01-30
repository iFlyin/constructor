export const businessLogic = {
   namespaced: true,
   state: {
      components: [
         {
            type: 'screen',
            name: 'Экран',
            width: 200,
            height: 120
         },
         {
            type: 'item',
            name: 'Компонент',
            width: 120,
            height: 80
         }
      ]
   },
   getters: {
      getComponents(state: any): void { return state.components; },
   },
};
