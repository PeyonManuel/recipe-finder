import React from 'react';
import { useContext, useEffect, useState, useRef } from 'react';
import { GlobalContext } from '../App';
import './RecipeList.css';

require('dotenv').config();

const RecipeList = () => {
    const { state } = useContext(GlobalContext);
    const [fetchedRecipes, setFetchedRecipes] = useState([]);
    const [searchNumber, setSearchNumber] = useState(12);
    const firstRenderIngredients = useRef(true);
    const firstRenderNumbers = useRef(true);
    const spoonacularKey = process.env.REACT_APP_SPOONACULAR_API_KEY;
    const handleLoadMoreClick = () => {
        document.getElementById('loading').style.opacity = 1;
        setTimeout(
            () => (document.getElementById('loading').style.opacity = 0),
            2500
        );
        switch (searchNumber) {
            case 12:
                setSearchNumber(48);
                break;
            case 48:
                setSearchNumber(100);
                break;
            default:
                break;
        }
    };
    const fetchFunction = () => {
        const ingredientsQuery = state.ingredients.join();
        fetch(
            'https://api.spoonacular.com/recipes/findByIngredients?' +
                'apiKey=' +
                spoonacularKey +
                '&ingredients=' +
                ingredientsQuery +
                '&number=' +
                searchNumber
        )
            .then((response) => response.json())
            .then((data) => setFetchedRecipes(data))
            .catch((error) => {
                setFetchedRecipes([]);
                console.log(error);
            });
        document.getElementById('loading').style.opacity = 1;
        setTimeout(
            () => (document.getElementById('loading').style.opacity = 0),
            1000
        );
    };

    useEffect(() => {
        if (!firstRenderIngredients.current) {
            if (searchNumber === 12) fetchFunction();
            else setSearchNumber(12);
        } else firstRenderIngredients.current = false;
    }, [state.ingredients]); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        if (!firstRenderNumbers.current) fetchFunction();
        else firstRenderNumbers.current = false;
    }, [searchNumber]); // eslint-disable-line react-hooks/exhaustive-deps

    const redirectToRecipe = (id) => {
        fetch(
            'https://api.spoonacular.com/recipes/' +
                id +
                '/information' +
                '?apiKey=' +
                spoonacularKey
        )
            .then((response) => response.json())
            .then((data) => window.open(data.sourceUrl, '_blank'))
            .catch((error) => console.log(error));
    };
    return (
        <>
            {fetchedRecipes.length > 0 ? (
                <div className='recipelist'>
                    {fetchedRecipes.map((recipe, i) => {
                        const {
                            id,
                            title,
                            image,
                            missedIngredients,
                            usedIngredients,
                        } = recipe;

                        return (
                            <div
                                className='recipewrapper'
                                onClick={() => redirectToRecipe(id)}
                            >
                                <span key={i} className='recipe'>
                                    <div className='imgdiv'>
                                        <img src={image} alt='' />
                                    </div>

                                    <h4>{title}</h4>
                                    {missedIngredients.length > 0 ? (
                                        <>
                                            <span className='usedingredients ingr'>
                                                <b>
                                                    {'Your ingredients used: '}
                                                </b>
                                                {usedIngredients
                                                    .map((used) => used.name)
                                                    .join(', ')}
                                                .
                                            </span>

                                            <span className='misingredients ingr'>
                                                <b>{'Missing ingredients: '}</b>
                                                {missedIngredients
                                                    .map(
                                                        (missing) =>
                                                            missing.name
                                                    )
                                                    .join(', ')}
                                                .
                                            </span>
                                        </>
                                    ) : (
                                        <span className='usedingredients ingr'>
                                            <b>You have al the ingredients!</b>
                                        </span>
                                    )}
                                </span>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <h1 className='startText'>
                    Start adding your ingredients so we can find you some
                    recipes
                </h1>
            )}
            {fetchedRecipes.length > 0 ? (
                searchNumber < 100 ? (
                    <button
                        className='loadmorebtn'
                        onClick={() => handleLoadMoreClick()}
                    >
                        Load more recipes
                    </button>
                ) : (
                    <button className='grayedbtn'>Load more recipes</button>
                )
            ) : (
                <p></p>
            )}
            <h4 id='loading'>Loading...</h4>
        </>
    );
};

export default RecipeList;
