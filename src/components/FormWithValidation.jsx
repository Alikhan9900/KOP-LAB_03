import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import "./FormWithValidation.css";

const schema = yup.object().shape({
    name: yup.string().required("Ім'я є обов'язковим").min(2, "Ім'я має містити мінімум 2 символи"),
    email: yup
        .string()
        .email("Некоректний email")
        .required("Email є обов'язковим"),
    age: yup
        .number()
        .typeError("Вік має бути числом")
        .positive("Вік має бути додатнім числом")
        .integer("Вік має бути цілим числом")
        .required("Вік є обов'язковим"),
});

const FormWithValidation = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(schema),
    });

    const onSubmit = (data) => {
        console.log("Дані форми:", data);
    };

    return (
        <div className="form-container">
            <h2 className="form-title">Форма з валідацією</h2>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="form-group">
                    <label htmlFor="name">Ім'я:</label>
                    <input id="name" {...register("name")} className="form-input" />
                    {errors.name && <p className="form-error">{errors.name.message}</p>}
                </div>

                <div className="form-group">
                    <label htmlFor="email">Email:</label>
                    <input id="email" {...register("email")} className="form-input" />
                    {errors.email && <p className="form-error">{errors.email.message}</p>}
                </div>

                <div className="form-group">
                    <label htmlFor="age">Вік:</label>
                    <input id="age" type="number" {...register("age")} className="form-input" />
                    {errors.age && <p className="form-error">{errors.age.message}</p>}
                </div>

                <button type="submit" className="form-button">Надіслати</button>
            </form>
        </div>
    );
};

export default FormWithValidation;
