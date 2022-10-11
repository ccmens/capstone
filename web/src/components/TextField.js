import './TextField.css'

import React from 'react'
import { useField, ErrorMessage } from 'formik'

export const TextField = ( { label, ...props} ) => {
    const [field, meta] = useField(props);

    return (
        <div className='mb-2'>
            <label htmlFor={field.name}>{label}</label>
            <input className={`form-control shadow-none ${meta.touched && meta.error && 'is-invalid'}`}
                    {...field} {...props}
            />
            <ErrorMessage 
                component="span"
                className="d-block invalid-feedback"
                name={field.name} />
        </div>
    )
}