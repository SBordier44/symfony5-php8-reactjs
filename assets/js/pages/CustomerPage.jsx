import React, {useEffect, useState} from "react";
import Field from "../components/forms/Field";
import {Link} from "react-router-dom";
import customersAPI from "../services/customersAPI";
import {toast} from "react-toastify";
import FormContentLoader from "../components/loaders/FormContentLoader";
import {faSave, faSignInAlt} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

const CustomerPage = ({history, match}) => {

    const {id = "new"} = match.params

    const emptyCustomerModel = {
        lastName: '',
        firstName: '',
        email: '',
        company: ''
    }

    const [customer, setCustomer] = useState(emptyCustomerModel)
    const [errors, setErrors] = useState(emptyCustomerModel)
    const [editing, setEditing] = useState(false)
    const [loading, setLoading] = useState(false)

    const fetchCustomer = async id => {
        try {
            const {firstName, lastName, email, company} = await customersAPI.find(id)
            setCustomer({firstName, lastName, email, company})
            setLoading(false)
        } catch (error) {
            console.error(error.response)
            toast.error('Une erreur est survenue lors de la récupération du client 😒')
            history.replace('/customers')
        }
    }

    useEffect(() => {
        if (id !== "new") {
            setLoading(true)
            setEditing(true)
            fetchCustomer(id)
        }
    }, [id]);

    const handleChangeField = ({currentTarget}) => {
        setCustomer({
            ...customer,
            [currentTarget.name]: currentTarget.value
        })
    }

    const handleSubmit = async event => {
        event.preventDefault()

        try {
            if (editing) {
                await customersAPI.edit(id, customer)
                toast.success('Client modifié avec succès')
            } else {
                await customersAPI.create(customer)
                toast.success('Client créé avec succès')
                history.replace('/customers')
            }
            setErrors(emptyCustomerModel)
        } catch ({response}) {
            const {violations} = response.data
            if (violations) {
                const apiErrors = {}
                violations.map(({propertyPath, message}) => {
                    apiErrors[propertyPath] = message
                })
                setErrors(apiErrors)
            } else {
                console.error(response)
            }
            toast.error('Une erreur est survenue 😒')
        }
    }

    return (
        <>
            {editing && <h1>Modification d'un client</h1> || <h1>Création d'un client</h1>}
            {loading && <FormContentLoader/>}
            {!loading && <form onSubmit={handleSubmit}>
                <Field name="lastName"
                       label="Nom de famille"
                       placeholder="Nom de famille du client"
                       value={customer.lastName}
                       onChange={handleChangeField}
                       required={true}
                       error={errors.lastName}
                />
                <Field name="firstName"
                       label="Prénom"
                       placeholder="Prénom du client"
                       value={customer.firstName}
                       onChange={handleChangeField}
                       required={true}
                       error={errors.firstName}
                />
                <Field name="email"
                       label="Email"
                       placeholder="Adresse Email du client"
                       value={customer.email}
                       onChange={handleChangeField}
                       required={true}
                       error={errors.email}
                />
                <Field name="company"
                       label="Entreprise"
                       placeholder="Entreprise du client"
                       value={customer.company}
                       onChange={handleChangeField}
                       required={true}
                       error={errors.company}
                />
                <div className="form-group">
                    <button type="submit" className="btn btn-info btn-sm">
                        <FontAwesomeIcon icon={faSave} size="lg" className="mr-1"/>Enregistrer
                    </button>
                    <Link to="/customers" className="btn btn-link btn-sm mt-1 ml-4">Retour à la liste</Link>
                </div>
            </form>}
        </>
    )
}

export default CustomerPage
