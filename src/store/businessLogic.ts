export const businessLogic = {
   namespaced: true,
   state: {
      components: [
         {
            name: 'Экран',
            width: 200,
            height: 120
         },
         // {
         //    name: 'ЦМС'
         // }
      ]
   },
   getters: {
      getComponents(state: any): void { return state.components; },
   },
};
