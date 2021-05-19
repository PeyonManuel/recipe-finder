import React from 'react';
import Header from './Components/Header';
import Searchbar from './Components/Searchbar';
import RecipeList from './Components/RecipeList';
import GlobalReducer from './GlobalReducer';

require('dotenv').config();

export const GlobalContext = React.createContext();

function App() {
    const defaultState = {
        ingredients: [],
    };

    const [state, dispatch] = React.useReducer(GlobalReducer, defaultState);

    return (
        <GlobalContext.Provider value={{ dispatch: dispatch, state: state }}>
            <Header />
            <div className="column flex-center">
            <Searchbar />
            <RecipeList />
            </div>

        </GlobalContext.Provider>
    );
}

export default App;
