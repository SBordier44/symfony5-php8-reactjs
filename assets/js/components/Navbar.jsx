import React, {useContext} from "react";
import authAPI from "../services/authAPI";
import {NavLink} from "react-router-dom";
import AuthContext from "../contexts/AuthContext";
import {toast} from "react-toastify";
import {faEdit, faSignInAlt, faSignOutAlt} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

const Navbar = ({history}) => {

    const {isAuthenticated, setIsAuthenticated} = useContext(AuthContext)

    const handleLogout = () => {
        authAPI.logout()
        setIsAuthenticated(false)
        toast.success('Vous êtes désormais déconnecté ! 😀')
        history.push('/login')
    }

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <NavLink className="navbar-brand" to="/">SymReact</NavLink>
            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarColor03"
                    aria-controls="navbarColor03" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"/>
            </button>
            <div className="collapse navbar-collapse" id="navbarColor03">
                <ul className="navbar-nav mx-auto">
                    <li className="nav-item">
                        <NavLink className="nav-link" to="/customers">Clients</NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink className="nav-link" to="/invoices">Factures</NavLink>
                    </li>
                </ul>
                <ul className="navbar-nav ml-auto">
                    {(!isAuthenticated && (
                        <>
                            <li className="nav-item">
                                <NavLink to="/register" className="btn btn-link btn-sm mt-1 mr-1">Inscription</NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink to="/login" className="btn btn-info btn-sm">
                                    <FontAwesomeIcon icon={faSignInAlt} size="lg" className="mr-1"/>Connexion
                                </NavLink>
                            </li>
                        </>
                    )) || (
                        <li className="nav-item">
                            <button className="btn btn-danger btn-sm" onClick={handleLogout}>
                                Déconnexion<FontAwesomeIcon icon={faSignOutAlt} size="lg" className="ml-1"/>
                            </button>
                        </li>
                    )}
                </ul>
            </div>
        </nav>
    )
};

export default Navbar
