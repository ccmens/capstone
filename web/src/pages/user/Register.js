import 'bootstrap/dist/css/bootstrap.min.css'

import React from 'react'
import {Formik, Form} from 'formik'
import {Button} from 'react-bootstrap'
import {TextField} from '@components/TextField'
import * as Yup from 'yup'

const Register = (props) => {
    const validate = Yup.object({
        firstName: Yup.string()
            .required("Required"),
        lastName: Yup.string()
            .required("Required"),
        email: Yup.string()
            .email("Must be a valid email")
            .required("Required"),
        password: Yup.string()
            .min(4, "Password must be at least 4 characters")
            .required("Required"),
        confirmPassword: Yup.string()
            .oneOf([Yup.ref('password'), null], 'Password must match')
            .required("Required"),
    })

    return (
        <div className="container mt-3">
            <div className="row">
                <div className="col-md-5">
                    <Formik
                        initialValues={{
                            firstName: '',
                            lastName: '',
                            email: '',
                            password: '',
                            confirmPassword: ''
                        }}
                        validationSchema={validate}
                    >
                        {formik => (
                            <div>
                                <h1 className="my-4 font-weight-bold-display-4">Sign Up</h1>
                                <Form>
                                    <TextField label="First Name" name="firstName" type="text"/>
                                    <TextField label="Last Name" name="lastName" type="text"/>
                                    <TextField label="Email" name="email" type="email"/>
                                    <TextField label="Password" name="password" type="password"/>
                                    <TextField label="Confirm Password" name="confirmPassword" type="password"/>
                                    <Button size="lg" type="submit">Register</Button>
                                </Form>
                            </div>
                        )}
                    </Formik>
                </div>
            </div>
        </div>
    )
}

export default Register;