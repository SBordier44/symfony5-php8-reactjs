import React, {useEffect, useState} from "react";
import Pagination from "../components/Pagination";
import moment from 'moment'
import invoicesAPI from '../services/invoicesAPI'
import {Link, NavLink} from "react-router-dom";
import {toast} from "react-toastify";
import TableRowsLoader from "../components/loaders/TableRowsLoader";
import {faEdit, faTrash} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

const STATUS_CLASSES = {
    PAID: 'success',
    SENT: 'info',
    CANCELED: 'danger'
}

const STATUS_LABELS = {
    PAID: 'Payée',
    SENT: 'Envoyée',
    CANCELED: 'Annulée'
}

const InvoicesPage = props => {

    const [invoices, setInvoices] = useState([])
    const [currentPage, setCurrentPage] = useState(1)
    const [search, setSearch] = useState('')
    const [loading, setLoading] = useState(true)

    const itemsPerPage = 10;

    const fetchInvoices = async () => {
        try {
            setInvoices(await invoicesAPI.fetchAll());
            setLoading(false)
        } catch (error) {
            console.error(error.response)
            toast.error('Une erreur est survenue lors de la récupération des factures 😒')
        }
    }

    useEffect(() => {
        return fetchInvoices()
    }, []);

    const handlePageChange = page => {
        setCurrentPage(page)
    }

    const handleSearch = ({currentTarget}) => {
        setSearch(currentTarget.value)
        setCurrentPage(1)
    }

    const handleDestroy = async id => {
        setLoading(true)

        const originalInvoices = [...invoices]

        setInvoices(invoices.filter(i => i.id !== id))

        try {
            await invoicesAPI.destroy(id)
            toast.success('Facture supprimée avec succès !')
            setLoading(false)
        } catch (error) {
            console.error(error.response)
            toast.error('Erreur lors de la suppresion de la facture')
            setInvoices(originalInvoices)
            setLoading(false)
        }
    }

    const filteredInvoices = invoices.filter(i =>
        i.customer.firstName.toLowerCase().includes(search.toLowerCase())
        || i.customer.lastName.toLowerCase().includes(search.toLowerCase())
        || i.amount.toString().startsWith(search.toLowerCase())
        || i.sentAt.toLowerCase().includes(search.toLowerCase())
        || STATUS_LABELS[i.status].toLowerCase().includes(search.toLowerCase())
    )

    const paginatedInvoices = Pagination.getData(filteredInvoices, currentPage, itemsPerPage)

    const formatDate = (str) => moment(str).format('DD/MM/YYYY')

    return (
        <>
            <div className="mb-3 d-flex justify-content-between align-items-center">
                <h1>Liste des factures</h1>
                <Link to="/invoices/new" className="btn btn-primary btn-sm">Créer une facture</Link>
            </div>
            <div className="form-group">
                <input type="text" className="form-control" placeholder="Rechercher..." onChange={handleSearch}
                       value={search}/>
            </div>
            <table className="table table-hover table-sm">
                <thead className="thead-dark">
                <tr>
                    <th scope="col">Numéro</th>
                    <th scope="col">Client</th>
                    <th scope="col">Date envoi</th>
                    <th scope="col" className="text-center">Statut</th>
                    <th scope="col" className="text-center">Montant</th>
                    <th scope="col"/>
                </tr>
                </thead>
                {!loading && (<tbody>
                {paginatedInvoices.map(invoice =>
                    <tr key={invoice.id}>
                        <th scope="row">{invoice.chrono}</th>
                        <td>
                            <NavLink
                                to={"/customers/" + invoice.customer.id}>{invoice.customer.firstName} {invoice.customer.lastName}</NavLink>
                        </td>
                        <td>{formatDate(invoice.sentAt)}</td>
                        <td className="text-center">
                            <span className={"badge badge-" + STATUS_CLASSES[invoice.status]}>
                                {STATUS_LABELS[invoice.status]}
                            </span>
                        </td>
                        <td className="text-center">{invoice.amount.toLocaleString()} €</td>
                        <td>
                            <NavLink className="btn text-info" to={"/invoices/" + invoice.id}>
                                <FontAwesomeIcon icon={faEdit} size="lg"/>
                            </NavLink>
                            <button className="btn text-danger" onClick={() => handleDestroy(invoice.id)}>
                                <FontAwesomeIcon icon={faTrash} size="lg"/>
                            </button>
                        </td>
                    </tr>
                )}
                </tbody>)}
            </table>

            {loading && <TableRowsLoader/>}

            {!loading && itemsPerPage < filteredInvoices.length && (
                <Pagination currentPage={currentPage} itemsPerPage={itemsPerPage} onPageChange={handlePageChange}
                            length={filteredInvoices.length}/>)
            }
        </>
    )
};

export default InvoicesPage
