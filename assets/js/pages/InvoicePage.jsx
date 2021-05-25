import React, {useEffect, useState} from 'react'
import Field from "../components/forms/Field";
import invoicesAPI from "../services/invoicesAPI";
import {Link} from "react-router-dom";
import Select from "../components/forms/Select";
import customersAPI from "../services/customersAPI";
import {toast} from "react-toastify";
import FormContentLoader from "../components/loaders/FormContentLoader";
import {faSave} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

const InvoicePage = ({history, match}) => {

    const {id = "new"} = match.params

    const emptyInvoiceModel = {
        amount: '',
        customer: '',
        status: ''
    }

    const [invoice, setInvoice] = useState({...emptyInvoiceModel, status: 'SENT'})
    const [errors, setErrors] = useState(emptyInvoiceModel)
    const [editing, setEditing] = useState(false)
    const [customers, setCustomers] = useState([])
    const [loading, setLoading] = useState(true)

    const handleFieldChange = ({currentTarget}) => {
        setInvoice({
            ...invoice,
            [currentTarget.name]: currentTarget.value
        })
    }

    const fetchInvoice = async id => {
        try {
            const {amount, customer, status, chrono} = await invoicesAPI.find(id)
            setInvoice({amount, customer: customer.id, status, chrono})
        } catch (error) {
            console.error(error.response)
            toast.error('Une erreur est survenue lors de la récupération de la facture 😒')
            history.replace('/invoices')
        }
    }

    const fetchCustomers = async () => {
        try {
            const data = await customersAPI.findAll()
            setCustomers(data)
            if (!invoice.customer && id === 'new') {
                setInvoice({...invoice, customer: data[0].id})
            }
        } catch (error) {
            console.error(error.response)
            toast.error('Une erreur est survenue lors de la récupération des clients 😒')
        }
    }

    useEffect(() => {
        if (customers.length) {
            if (id !== 'new' && invoice.customer.amount !== '') {
                setLoading(false)
            } else {
                setLoading(false)
            }
        }
    }, [invoice, customers]);


    useEffect(() => {
        if (id !== "new") {
            setEditing(true)
            fetchInvoice(id)
        }
    }, [id]);

    useEffect(() => {
        fetchCustomers()
    }, []);


    const handleSubmit = async event => {
        event.preventDefault()

        try {
            if (editing) {
                await invoicesAPI.edit(id, invoice)
                toast.success('Facture modifiée avec succès')
            } else {
                await invoicesAPI.create(invoice)
                toast.success('Facture créée avec succès')
                history.replace('/invoices')
            }
            setErrors(emptyInvoiceModel)
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
            toast.error("Une erreur est survenue lors de l'enregistrement' 😒")
        }
    }

    return (
        <>
            {editing && <h1 className="mb-4">Modification de la facture #{invoice.chrono}</h1>
            || <h1 className="mb-4">Création d'une facture</h1>}
            {loading && <FormContentLoader/>}
            {!loading && <form onSubmit={handleSubmit}>
                <Field
                    name="amount"
                    type="number"
                    placeholder="Montant de la facture"
                    label="Montant"
                    onChange={handleFieldChange}
                    value={invoice.amount}
                    required={true}
                    error={errors.amount}
                />
                <Select
                    name="customer"
                    label="Client"
                    value={invoice.customer}
                    error={errors.customer}
                    onChange={handleFieldChange}
                >
                    {customers.map(customer => <option
                        value={customer.id} key={customer.id}>{customer.firstName} {customer.lastName}</option>)}
                </Select>
                <Select
                    name="status"
                    label="Statut"
                    value={invoice.status}
                    error={errors.status}
                    onChange={handleFieldChange}
                >
                    <option value="SENT">Envoyée</option>
                    <option value="PAID">Payée</option>
                    <option value="CANCELED">Annulée</option>
                </Select>
                <div className="form-group">
                    <button type="submit" className="btn btn-info btn-sm">
                        <FontAwesomeIcon icon={faSave} size="lg" className="mr-1"/>Enregistrer
                    </button>
                    <Link to="/invoices" className="btn btn-link btn-sm mt-1 ml-4">Retour à la liste</Link>
                </div>
            </form>}
        </>
    )
}

export default InvoicePage
