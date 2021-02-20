import React, {useEffect, useState} from "react";
import Pagination from "../components/Pagination";
import customersAPI from "../services/customersAPI";
import {Link, NavLink} from "react-router-dom";
import {toast} from "react-toastify";
import TableRowsLoader from "../components/loaders/TableRowsLoader";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEdit, faPenSquare, faTrash} from "@fortawesome/free-solid-svg-icons";

const CustomersPage = props => {

    const [customers, setCustomers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1)
    const [search, setSearch] = useState('')
    const [loading, setLoading] = useState(true)

    const fetchCustomers = async () => {
        try {
            setCustomers(await customersAPI.findAll())
            setLoading(false)
        } catch (error) {
            console.log(error.response)
            toast.error('Une erreur est survenue lors de la récupération des clients 😒')
        }
    }

    useEffect(() => {
        fetchCustomers();
    }, []);

    const handleDelete = async id => {
        setLoading(true)
        const originalCustomers = [...customers]

        setCustomers(customers.filter(customer => customer.id !== id))

        try {
            await customersAPI.destroy(id)
            toast.success('Client supprimé avec succès !')
            setLoading(false)
        } catch (error) {
            console.error(error.response)
            toast.error('Erreur lors de la suppression du client 😒')
            setCustomers(originalCustomers)
            setLoading(false)
        }
    }

    const handlePageChange = page => {
        setCurrentPage(page)
    }

    const handleSearch = ({currentTarget}) => {
        setSearch(currentTarget.value)
        setCurrentPage(1)
    }

    const itemsPerPage = 10;

    const filteredCustomers = customers.filter(c =>
        c.firstName.toLowerCase().includes(search.toLowerCase())
        || c.lastName.toLowerCase().includes(search.toLowerCase())
        || c.email.toLowerCase().includes(search.toLowerCase())
        || (c.company && c.company.toLowerCase().includes(search.toLowerCase()))
        || (c.owner.email && c.owner.email.toLowerCase().includes(search.toLowerCase()))
    )

    const paginatedCustomers = Pagination.getData(filteredCustomers, currentPage, itemsPerPage)

    return (
        <>
            <div className="mb-3 d-flex justify-content-between align-items-center">
                <h1>Liste des clients</h1>
                <Link to="/customers/new" className="btn btn-primary">Créer un client</Link>
            </div>
            <div className="form-group">
                <input type="text" className="form-control" placeholder="Rechercher..." onChange={handleSearch}
                       value={search}/>
            </div>
            <table className="table table-hover table-sm">
                <thead className="thead-dark">
                <tr>
                    <th scope="col">Client</th>
                    <th scope="col">Proprietaire</th>
                    <th scope="col">Email</th>
                    <th scope="col">Entreprise</th>
                    <th scope="col" className="text-center">Factures</th>
                    <th scope="col" className="text-center">Montant total</th>
                    <th scope="col"/>
                </tr>
                </thead>
                {!loading && (<tbody>
                {paginatedCustomers.map(customer => <tr key={customer.id}>
                    <th scope="row">{customer.firstName} {customer.lastName}</th>
                    <td>{customer.owner.email}</td>
                    <td>{customer.email}</td>
                    <td>{customer.company}</td>
                    <td className="text-center">
                        <span
                            className={"badge badge-pill" + (customer.invoices.length && " badge-success" || " badge-light")}>
                            {customer.invoices.length}
                        </span>
                    </td>
                    <td className="text-center">{customer.totalAmount.toLocaleString()} €</td>
                    <td>
                        <NavLink className="btn text-info" to={"/customers/" + customer.id}>
                            <FontAwesomeIcon icon={faEdit} size="lg"/>
                        </NavLink>
                        <button className="text-danger btn" disabled={customer.invoices.length > 0}
                                onClick={() => handleDelete(customer.id)}>
                            <FontAwesomeIcon icon={faTrash} size="lg"/>
                        </button>
                    </td>
                </tr>)}
                </tbody>)}
            </table>

            {loading && <TableRowsLoader/>}

            {!loading && itemsPerPage < filteredCustomers.length && (
                <Pagination currentPage={currentPage} itemsPerPage={itemsPerPage} length={filteredCustomers.length}
                            onPageChange={handlePageChange}/>)
            }
        </>
    )
};

export default CustomersPage
