import { useHttp } from "../../hooks/http.hook";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import classNames from 'classnames';

import { filterChanged, fetchFilters} from './filtersSlice';
import Spinner from '../spinner/Spinner';
// Задача для этого компонента:
// Фильтры должны формироваться на основании загруженных данных
// Фильтры должны отображать только нужных героев при выборе
// Активный фильтр имеет класс active
// Изменять json-файл для удобства МОЖНО!
// Представьте, что вы попросили бэкенд-разработчика об этом

const HeroesFilters = () => {

    const {filters, filtersLoadingStatus, activeFilter} = useSelector(state => state.filters);
    const dispatch = useDispatch();
    const {request} = useHttp();

    // Запит на сервер для отримання фільтрів і послідовної зміни
    useEffect(() => {
        dispatch(fetchFilters(request));
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[]);

    if (filtersLoadingStatus === 'loading') {
        return <Spinner/>;
    } else if (filtersLoadingStatus === 'error'){
        return <h5 className="text-center mt-5">Loading error</h5>
    }

    const renderFilters = (arr) => {
        if (arr.length === 0) {
            return <h5 className="text-center mt-5">Фильтры не найдены</h5>
        }
        // Дані в json-файлі розширив класами і текстом
        return arr.map(({name, label, className}) => {
            //  Використовуємо бібліотеку класнейм і формуємо класи динамічно
             const btnClass = classNames('btn', className, {
                 'active': name === activeFilter     
             });
    
             return <button
                        key={name}
                        id={name}
                        className={btnClass}
                        onClick={()=> dispatch(filterChanged(name))}
                        >{label}</button>
        });
    }
    

    const elements = renderFilters(filters);

    return (
        <div className="card shadow-lg mt-4">
            <div className="card-body">
                <p className="card-text">Отфильтруйте героев по элементам</p>
                <div className="btn-group">
                   {elements}
                </div>
            </div>
        </div>
    )
}

export default HeroesFilters;