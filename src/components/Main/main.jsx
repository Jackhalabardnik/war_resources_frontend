import RNavbar from "../RNavBar/rnavbar";
import MainApp from "../MainApp/mainapp";

const Main = () => {

    return (
        <div className="vh-100 overflow-hidden d-flex flex-column justify-content-start w-100">
            <RNavbar/>
            <MainApp/>
        </div>
    )
}
export default Main