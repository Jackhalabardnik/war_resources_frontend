import {useState} from "react"
import axios from "axios"
import {Alert, Button, ButtonGroup, FloatingLabel, Form} from "react-bootstrap"
import {useFormik} from 'formik';
import * as yup from "yup";

const signupValidationSchema = yup.object().shape({
    username: yup.string().required().label('Username'),
    email: yup.string().email().required().label('Email'),
    password: yup.string().required().label('Password'),
    role: yup.string().label('Role')
});

const Signup = () => {
    const [error, setError] = useState('')

    const formik = useFormik({
        initialValues: {
            username: '',
            email: '',
            password: '',
            role: '[BASIC]',
        },
        validationSchema: signupValidationSchema,
        onSubmit: values => {
            axios.post("http://localhost:8080/api/user/save", values)
                .then(response => {
                    localStorage.setItem("token", response.data.Authorization);
                    window.location = "/";
                })
                .catch(error => {
                    if (error.response && error.response.status >= 400 && error.response.status <= 500) {
                        setError(error.response.data.message)
                    }
                })
        },
    });

    return (
        <div>
            <Form onSubmit={formik.handleSubmit} noValidate className="px-3">
                <div>
                    <FloatingLabel controlId="inputUserName" label="Username" className="mb-3">
                        <Form.Control
                            type="text"
                            name="username"
                            placeholder="Username"
                            onChange={formik.handleChange}
                            value={formik.values.username}
                            isInvalid={formik.touched.username && !!formik.errors.username}
                            className="shadow-none"
                        />
                        <Form.Control.Feedback type="invalid"
                                               className="fw-bold">{formik.errors.username}</Form.Control.Feedback>
                    </FloatingLabel>
                    <FloatingLabel controlId="inputUserName" label="Email" className="mb-3">
                        <Form.Control
                            type="email"
                            name="email"
                            placeholder="Email"
                            onChange={formik.handleChange}
                            value={formik.values.email}
                            isInvalid={formik.touched.email && !!formik.errors.email}
                            className="shadow-none"
                        />
                        <Form.Control.Feedback type="invalid"
                                               className="fw-bold">{formik.errors.email}</Form.Control.Feedback>
                    </FloatingLabel>
                    <FloatingLabel controlId="inputPassword" label="Password" className="mb-3">
                        <Form.Control
                            type="password"
                            name="password"
                            placeholder="Password"
                            onChange={formik.handleChange}
                            value={formik.values.password}
                            isInvalid={formik.touched.password && !!formik.errors.password}
                            className="shadow-none"
                        />
                        <Form.Control.Feedback type="invalid"
                                               className="fw-bold">{formik.errors.password}</Form.Control.Feedback>
                    </FloatingLabel>
                    <Form.Group className="mb-3">
                        <ButtonGroup className="mb-3 d-flex" id="inputAccountType">
                            <Button
                                name="role"
                                variant="outline-dark"
                                className="shadow-none"
                                active={formik.values.role === '[BASIC]'}
                                value={'[BASIC]'}
                                onClick={formik.handleChange}>
                                Basic
                            </Button>
                            <Button
                                name="role"
                                variant="outline-dark"
                                className="shadow-none"
                                active={formik.values.role === '[PREMIUM]'}
                                value={'[PREMIUM]'}
                                onClick={formik.handleChange}>
                                Premium
                            </Button>
                        </ButtonGroup>
                    </Form.Group>
                    <Button type="submit" variant="primary" className="col-12">Sign Up Now</Button>
                </div>
            </Form>
            {error && <Alert variant="danger" className="text-center m-2">Error: {error}</Alert>}
        </div>);
};
export default Signup