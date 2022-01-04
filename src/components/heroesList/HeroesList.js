import {useHttp} from '../../hooks/http.hook';
import { useEffect, useCallback } from 'react';
import { createSelector } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';
import {CSSTransition, TransitionGroup} from 'react-transition-group';

import { heroDeleted, fetchHeroes, selectAll } from './heroesSlice';
import { useGetHeroesQuery } from '../../api/apiSlice';

import HeroesListItem from "../heroesListItem/HeroesListItem";
import Spinner from '../spinner/Spinner';
// Усложненная задача:
// Удаление идет и с json файла при помощи метода DELETE

const HeroesList = (props) => { 
    const filteredHeroesSelector = createSelector(
        (state) => state.filters.activeFilter,
        selectAll,
        (filter, heroes) => {
            if (filter === 'all') {
                console.log('render')
                return heroes;
            } else {
                return heroes.filter(item => item.element === filter);
            }
        }
    )

    // const filteredHeroes = useSelector(state => {
    //     if (state.filters.activeFilter === 'all') {
    //         return state.heroes.heroes;
    //     }else {
    //         return state.heroes.heroes.filter(item => item.element === state.filters.activeFilter);
    //     }
    // })
    const filteredHeroes = useSelector(filteredHeroesSelector);
    const heroesLoadingStatus = useSelector(state => state.heroes.heroesLoadingStatus);
    const dispatch = useDispatch();
    const {request} = useHttp();
        // eslint-disable-next-line

    useEffect(() => {
        dispatch(fetchHeroes());
        // eslint-disable-next-line
    }, []);

    const onDelete = useCallback ((id) => {
        request(`http://localhost:3001/heroes/${id}`, "DELETE")
        .then(data => console.log(data, "Deleted"))
        .then(dispatch(heroDeleted(id)))
        .catch(err => console.log(err));
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [request])

    if (heroesLoadingStatus === "loading") {
        return <Spinner/>;
    } else if (heroesLoadingStatus === "error") {
        return <h5 className="text-center mt-5">Ошибка загрузки</h5>
    }

    const renderHeroesList = (arr) => {
        if (arr.length === 0) {
            return (
                <CSSTransition
                    timeout={0}
                    classNames='hero'>
                    <h5 className="text-center mt-5">Героев пока нет</h5>
                </CSSTransition>
            )
        }

        return arr.map(({id,  ...props }) => {
            return (
                <CSSTransition
                    key={id}
                    timeout={500}
                    classNames='hero'  >
                    <HeroesListItem {...props} onDelete={ () => onDelete(id)}/>
                </CSSTransition>
            )
        })
    }

    const elements = renderHeroesList(filteredHeroes);
    return (
        <TransitionGroup component='ul'>
            {elements}
        </TransitionGroup>
    )
}
export default HeroesList;