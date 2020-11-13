const GlobalReucer = (state, action) => {
    switch (action.type) {
        case 'ADD_INGREDIENT':
            return {
                ...state,
                ingredients: [...state.ingredients, action.payload],
            };
        case 'REMOVE_INGREDIENT':
            return {
                ...state,
                ingredients: state.ingredients.filter(
                    (ingr) => ingr !== action.payload
                ),
            };
        default:
            break;
    }
};

export default GlobalReucer;
