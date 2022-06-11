import axios from "axios";
import {useEffect, useState} from "react";
import {Button} from "react-bootstrap";
import {Link} from "react-router-dom";
import Login from "../Login/login";

const RNavBar = (props) => {

    const [userData, setUserData] = useState("")

    useEffect(() => {
        const token = localStorage.getItem("token")
        if (token) {
            axios.get(`http://localhost:8080/api/user`, {headers: {"authorization": `${token}`}})
                .then((response) => {
                    setUserData(response.data)
                }).catch((error) => {
                console.log(error)
            })
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token")
        window.location.reload()
    }

    const token = localStorage.getItem("token")

    return (
        <div className="bg-dark">
            <nav
                className="bg-light bg-opacity-10 d-flex justify-content-between flex-column flex-md-row align-items-center">
                <Link to={props.mainlink ? props.mainlink : "/"}
                      className="ms-md-2 my-3 text-white text-center text-decoration-none fs-3 fw-bold">
                    War resources
                </Link>

                {token ?
                    <div className="d-flex flex-column flex-md-row justify-content-md-center mx-3 align-items-center">
                        <div
                            className={"text-white fs-5 fw-bold" + (window.location.pathname === "/user" ? "me-0 me-md-4" : "")}>
                            {userData.username}
                        </div>
                        {
                            window.location.pathname !== "/user" &&
                            <Link to="/user" className="m-3">
                                <Button variant="outline-light">
                                    Settings
                                </Button>
                            </Link>
                        }
                        <Button onClick={handleLogout} variant="outline-light mb-3 mb-md-0">
                            Log out
                        </Button>
                    </div>
                    :
                    <Login/>
                }
            </nav>
        </div>
    )
}
export default RNavBar