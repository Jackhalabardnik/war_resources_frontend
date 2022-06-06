import RNavbar from "../RNavBar/rnavbar";
import MainApp from "../MainApp/mainapp";

const Main = () => {

    return (
        <div className="vh-100 overflow-hidden d-flex flex-column justify-content-between">
            <RNavbar/>
            <MainApp/>
        </div>
    )
}
export default Main