import React from 'react';
import { useState, useEffect, useRef, useContext } from 'react';
import { GlobalContext } from '../App';

const Searchbar = () => {
    const [displayAuto, setdisplayAuto] = useState(false);
    const [displayIngr, setDisplayIngr] = useState(false);
    const [displayAlert, setDisplayAlert] = useState(false);
    const [alert, setAlert] = useState('');
    const [options, setOptions] = useState([]);
    const [search, setSearch] = useState('');
    const { dispatch, state } = useContext(GlobalContext);
    const [selectedOption, setSelectedOption] = useState(0);

    const wrapperRef = useRef(null);

    const handleSearchChange = (e) => {
        setSearch(e.target.value);
        if (e.target.value.length > 0) setdisplayAuto(true);
    };

    const handleAutocontainer = (currentIngredient) => {
        setSearch('');
        const exists = state.ingredients.find(
            (ingr) => ingr === currentIngredient
        );
        if (!exists) {
            dispatch({ type: 'ADD_INGREDIENT', payload: currentIngredient });
        } else {
            setAlert('Ingredient already added');
            setDisplayAlert(true);
            document.getElementById('ingredients').style.visibility = 'hidden';
            setTimeout(() => {
                document.getElementById('ingredients').style.visibility =
                    'visible';
                setDisplayAlert(false);
            }, 2000);
        }
        if (!displayIngr) setDisplayIngr(true);
        setdisplayAuto(!displayAuto);
    };

    const handleIngredientsClick = (delingr) => {
        dispatch({ type: 'REMOVE_INGREDIENT', payload: delingr });
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleClickOutside = (event) => {
        const { current: wrap } = wrapperRef;
        if (wrap && !wrap.contains(event.target)) {
            setdisplayAuto(false);
        }
    };

    const handleKeyDownSearch = (e) => {
        if (e.keyCode === 38) {
            if (selectedOption === 0) return;
            setSelectedOption(selectedOption - 1);
        }
        if (e.keyCode === 40) {
            if (selectedOption + 1 === options.length) return;
            setSelectedOption(selectedOption + 1);
        }
        if (e.keyCode === 13) {
            const exists = state.ingredients.find(
                (ingr) => ingr === options[selectedOption].name
            );
            if (!exists) {
                dispatch({
                    type: 'ADD_INGREDIENT',
                    payload: options[selectedOption].name,
                });
            } else {
                setAlert('Ingredient already added');
                setDisplayAlert(true);
                document.getElementById('ingredients').style.visibility =
                    'hidden';
                setTimeout(() => {
                    document.getElementById('ingredients').style.visibility =
                        'visible';
                    setDisplayAlert(false);
                }, 2000);
            }
            setSelectedOption(0);
            setSearch('');
            if (!displayIngr) setDisplayIngr(true);
            setdisplayAuto(!displayAuto);
        }
    };

    useEffect(() => {
        if (search.length > 0) {
            fetch(
                'https://api.spoonacular.com/food/ingredients/autocomplete?query=' +
                    search +
                    '&apiKey=' +
                    '0893e6b8f6504b32a6a105b411814153'
            )
                .then((response) => response.json())
                .then((data) => {
                    if (data.status !== 'failure') setOptions(data);
                    else {
                        setAlert(data.message);
                        setDisplayAlert(true);
                        setOptions([]);
                    }
                });
        } else setOptions([]);
    }, [search]);

    return (
        <div className='searchcomp'>
            <div className='searchdiv' ref={wrapperRef}>
                <input
                    className='searchbar'
                    type='text'
                    placeholder='Type your ingredients'
                    value={search}
                    onChange={(e) => handleSearchChange(e)}
                    onClick={() => setdisplayAuto(true)}
                    onKeyDown={(e) => handleKeyDownSearch(e)}
                />
                {displayAuto && (
                    <div className='autocontainer'>
                        {options.map((op, i) => {
                            let className = '';
                            if (i === selectedOption)
                                className = 'selectedoption';
                            return (
                                <span
                                    key={i}
                                    onClick={() => handleAutocontainer(op.name)}
                                    className={className}
                                    onMouseOver={() => setSelectedOption(i)}
                                >
                                    {op.name}
                                </span>
                            );
                        })}
                    </div>
                )}
            </div>
            {displayIngr && (
                <div id='ingredients' className='ingredients'>
                    {state.ingredients.map((ingr, i) => (
                        <span
                            key={i}
                            onClick={() => handleIngredientsClick(ingr)}
                        >
                            {ingr}
                        </span>
                    ))}
                </div>
            )}
            {displayAlert && <h4 className='alert'>{alert}</h4>}
        </div>
    );
};

export default Searchbar;
