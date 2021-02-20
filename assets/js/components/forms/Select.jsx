import React from 'react'

const Select = ({name, label, value = "", onChange, error = "", required = false, children}) => {
    return (
        <div className="form-group">
            <label htmlFor={name}>{label}</label>
            <select className={"form-control" + (error && " is-invalid")}
                    name={name} id={name}
                    onChange={onChange}
                    value={value}
                    required={required}>
                {children}
            </select>
            {error && <p className="invalid-feedback">
                {error}
            </p>}
        </div>
    )
}

export default Select
