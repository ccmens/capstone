import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import {Formik, Form} from 'formik';
import {Button} from 'react-bootstrap';
import {TextField} from '@components/TextField';
import * as Yup from 'yup';

function Login(props) {
    const validate = Yup.object({
        email: Yup.string()
            .email("Must be a valid Email")
            .required("Required"),
        password: Yup.string()
            .required("Required"),
    })

    return (
        <div className="container mt-3">
            <div className="row">
                <div className="col-md-auto">
                    <Formik
                        initialValues={{
                            email: '',
                            password: ''
                        }}
                        validationSchema={validate}
                    >
                        {formik => (
                            <div>
                                <h1 className="my-4 font-weight-bold-display-4">Log In</h1>
                                <Form>
                                    <TextField label="Email" name="email" type="email" />
                                    <TextField label="password" name="password" type="password" />
                                    <Button size="lg" type="submit">Log In</Button>
                                </Form>

                            </div>
                        )}
                    </Formik>
                </div>
            </div>
        </div>
    )
}

export default Login