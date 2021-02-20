import React, {useState} from "react";
import Field from "../components/forms/Field";
import {Link} from "react-router-dom";
import usersAPI from "../services/usersAPI";
import {toast} from "react-toastify";

const RegisterPage = ({history}) => {

    const emptyUserModel = {
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        passwordConfirm: ''
    }

    const [user, setUser] = useState(emptyUserModel)
    const [errors, setErrors] = useState(emptyUserModel)

    const handleChangeField = ({currentTarget}) => {
        setUser({
            ...user,
            [currentTarget.name]: currentTarget.value
        })
    }

    const handleSubmit = async event => {
        event.preventDefault()

        const apiErrors = {}
        if (user.password !== user.passwordConfirm) {
            apiErrors.passwordConfirm = "Les mots de passe ne correspondent pas !"
            setErrors(apiErrors)
            toast.error('Une erreur est survenue')
            return
        }

        try {
            await usersAPI.register(user)
            setErrors(emptyUserModel)
            toast.success("Vous êtes maintenant inscrit ! 😄")
            history.replace('/login')
        } catch ({response}) {
            const {violations} = response.data
            if (violations) {
                violations.map(({propertyPath, message}) => {
                    apiErrors[propertyPath] = message
                })
                setErrors(apiErrors)
            } else {
                console.error(response)
            }
            toast.error('Une erreur est survenue')
        }
    }

    return (
        <>
            <h1 className="mb-5">Inscription</h1>
            <form className="pt-2" onSubmit={handleSubmit}>
                <Field
                    type="text"
                    name="firstName"
                    label="Prénom"
                    placeholder="Votre Prénom"
                    error={errors.firstName}
                    value={user.firstName}
                    onChange={handleChangeField}
                    required={true}
                />
                <Field
                    type="text"
                    name="lastName"
                    label="Nom de famille"
                    placeholder="Votre nom de famille"
                    error={errors.lastName}
                    value={user.lastName}
                    onChange={handleChangeField}
                    required={true}
                />
                <Field
                    type="email"
                    name="email"
                    label="Adresse Email"
                    placeholder="Votre adresse Email"
                    error={errors.email}
                    value={user.email}
                    onChange={handleChangeField}
                    required={true}
                />
                <Field
                    type="password"
                    name="password"
                    label="Mot de passe"
                    placeholder="Votre Mot de passe"
                    error={errors.password}
                    value={user.password}
                    onChange={handleChangeField}
                    required={true}
                />
                <Field
                    type="password"
                    name="passwordConfirm"
                    label="Mot de passe (Confirmation)"
                    placeholder="Votre Mot de passe (Confirmation)"
                    error={errors.passwordConfirm}
                    value={user.passwordConfirm}
                    onChange={handleChangeField}
                    required={true}
                />
                <div className="form-group">
                    <button className="btn btn-success btn-sm" type="submit">
                        Confirmation
                    </button>
                    <Link to="login" className="ml-4 mt-1 btn btn-link btn-sm">J'ai déjà un compte</Link>
                </div>
            </form>
        </>
    )
}

export default RegisterPage
