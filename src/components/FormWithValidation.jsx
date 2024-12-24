import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import './FormWithValidation.css';

// Масив міст України
const cities = [
    "Київ", "Одеса", "Львів", "Харків", "Дніпро", "Запоріжжя", "Черкаси", "Чернігів", "Івано-Франківськ", "Житомир",
    "Кривий Ріг", "Миколаїв", "Луцьк", "Тернопіль", "Хмельницький", "Полтава", "Рівне", "Суми", "Кропивницький",
    "Чернівці", "Вінниця", "Луганськ", "Кам'янець-Подільський", "Ужгород", "Севастополь", "Маріуполь"
];
const europeanCountries = [
    "Австрія", "Албанія", "Андорра", "Бельгія", "Болгарія", "Боснія і Герцеговина", "Велика Британія", "Вірменія",
    "Греція", "Грузія", "Данія", "Естонія", "Ірландія", "Ісландія", "Італія", "Кіпр", "Косово", "Латвія", "Литва",
    "Люксембург", "Мальта", "Молдова", "Нідерланди", "Німеччина", "Норвегія", "Північна Македонія", "Польща",
    "Португалія", "Румунія", "Росія", "Сербія", "Словаччина", "Словенія", "Туреччина", "Угорщина", "Фінляндія",
    "Франція", "Хорватія", "Чехія", "Чорногорія", "Швейцарія", "Швеція"
];

const schema = yup.object().shape({
    tab: yup
        .string()
        .required('Тип форми є обов’язковим'),
    from: yup
        .string()
        .when("tab", {
            is: "withinUkraine",
            then: (schema) => schema.required('Поле "Звідки" є обов\'язковим'),
            otherwise: (schema) => schema.notRequired(),
        }),
    to: yup
        .string()
        .when("tab", {
            is: "withinUkraine",
            then: (schema) => schema.required('Поле "Куди" є обов\'язковим'),
            otherwise: (schema) => schema.notRequired(),
        }),
    destinationCountry: yup
        .string()
        .when("tab", {
            is: "abroad",
            then: (schema) => schema.required('Поле "Країна призначення" є обов\'язковим'),
            otherwise: (schema) => schema.notRequired(),
        }),
    type: yup
        .string()
        .required('Тип відправлення є обов\'язковим'),
});

const FormWithValidation = () => {
    const { register, handleSubmit, formState: { errors }, setValue, watch, reset } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            tab: "withinUkraine",
        },
    });

    const [tab, setTab] = useState('withinUkraine');

    const onSubmit = (data) => {
        console.log("Дані форми:", { ...data, tab });
        if (tab === "abroad" && !data.destinationCountry) {
            console.error("Країна призначення не вибрана");
        }
    };

    const handleTabChange = (newTab) => {
        setTab(newTab);
        setValue("tab", newTab);

        if (newTab === "withinUkraine") {
            reset({ tab: "withinUkraine", from: "", to: "", type: "" });
        } else {
            reset({ tab: "abroad", destinationCountry: "", type: "" });
        }
    };


    return (
        <div className="form-container">
            <h2 className="form-title">Розрахунок вартості</h2>
            <div className="tabs">
                <button
                    className={`tab ${tab === 'withinUkraine' ? 'active' : ''}`}
                    onClick={() => handleTabChange('withinUkraine')}
                >
                    В межах України
                </button>
                <button
                    className={`tab ${tab === 'abroad' ? 'active' : ''}`}
                    onClick={() => handleTabChange('abroad')}
                >
                    За кордон
                </button>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="form-layout">
                {tab === 'withinUkraine' && (
                    <div className="form-section">
                        <h3 className="form-subtitle">1. Маршрут</h3>
                        <div className="form-group-row">
                            <div className="form-group">
                                <label htmlFor="from" className="form-label">Звідки:</label>
                                <select id="from" {...register("from")} className="form-input">
                                    <option value="">Оберіть місто</option>
                                    {cities.map((city, index) => (
                                        <option key={index} value={city}>{city}</option>
                                    ))}
                                </select>
                                {errors.from && <p className="form-error">{errors.from.message}</p>}
                            </div>
                            <div className="form-group">
                                <label htmlFor="to" className="form-label">Куди:</label>
                                <select id="to" {...register("to")} className="form-input">
                                    <option value="">Оберіть місто</option>
                                    {cities.map((city, index) => (
                                        <option key={index} value={city}>{city}</option>
                                    ))}
                                </select>
                                {errors.to && <p className="form-error">{errors.to.message}</p>}
                            </div>
                        </div>
                    </div>
                )}

                {tab === 'abroad' && (
                    <div className="form-section">
                        <h3 className="form-subtitle">1. Країна призначення</h3>
                        <div className="form-group">
                            <label htmlFor="destinationCountry" className="form-label">Країна призначення:</label>
                            <select
                                id="destinationCountry"
                                {...register("destinationCountry")}
                                className="form-input"
                            >
                                <option value="">Оберіть країну</option>
                                {europeanCountries.map((country, index) => (
                                    <option key={index} value={country}>{country}</option>
                                ))}
                            </select>
                            {errors.destinationCountry && (
                                <p className="form-error">{errors.destinationCountry.message}</p>
                            )}
                        </div>
                    </div>
                )}

                <div className="form-section">
                    <h3 className="form-subtitle">2. Тип відправлення</h3>
                    <div className="form-group-row">
                        <label className="form-radio">
                            <input type="radio" value="Посилка" {...register("type")} />
                            Посилка
                        </label>
                        <label className="form-radio">
                            <input type="radio" value="Документи" {...register("type")} />
                            Документи
                        </label>
                        <label className="form-radio">
                            <input type="radio" value="Лист" {...register("type")} />
                            Лист
                        </label>
                    </div>
                    {errors.type && <p className="form-error">{errors.type.message}</p>}
                </div>
                <button type="submit" className="form-button">Розрахувати</button>
            </form>
        </div>
    );
};

export default FormWithValidation;
