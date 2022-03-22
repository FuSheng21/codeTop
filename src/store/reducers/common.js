
const initState = {
    collapse:true,
}

const reducer = function(state=initState,action){
    switch(action.type){
        case 'show_menu':
            return {
                ...state,
                collapse:false
            }
        case 'hide_menu':
            return {
                ...state,
                collapse:true
            }
        default:
            return state;
    }
}

export default reducer;