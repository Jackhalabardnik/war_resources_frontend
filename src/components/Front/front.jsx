import Rnavbar from "../RNavBar/rnavbar";
import Signup from "../Signup/signup";

const Front = () => {
    return (
        <div>
            <Rnavbar
                mainlink="/front"
            />
            <div className="d-flex flex-lg-row flex-md-column w-100">
                <div
                    className="d-flex flex-column align-items-center fs-5 align-middle p-4 col-lg-4 col-12">
                    <h4>
                        Welcome to War Resources website!
                    </h4>
                    <div>
                        This war resources API will let you compare prices of resources during wars, day by day.
                        <br/>
                        Please, choose your plan and sign up.
                        <ul className="text-start">
                            <li>
                                Basic - free, only one resource
                            </li>
                            <li>
                                Premium - free, all resources
                            </li>
                        </ul>
                    </div>
                    <div className="my-4 text-dark">
                        <Signup/>
                    </div>

                </div>
                <div className="col-lg-8 col-12 mt-2 pe-1">
                    <img src="/splash.png" alt="splash" className="img-fluid rounded-2"/>
                </div>

            </div>
        </div>
    )
}
export default Front;