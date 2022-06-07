import PickList from "./PickList/picklist";
import WarPicker from "./WarPicker/warpicker";
import BasicChart from "./BasicChart/basicchart";
import {useEffect, useState} from "react";
import axios from "axios";
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';

const MainApp = () => {

    const [resourcesList, setResourcesList] = useState([]);
    const [warList, setWarList] = useState([]);
    const [pickedResourcesList, setPickedResourcesList] = useState([]);
    const [pickedWarList, setPickedWarList] = useState([]);
    const [resourcePrices, setResourcePrices] = useState([]);

    useEffect(() => {
        const token = localStorage.getItem("token")
        if (token) {
            axios.get(`http://localhost:8080/api/resources`, {headers: {"authorization": `${token}`}})
                .then((response) => {
                    setResourcesList(response.data)
                }).catch((error) => {
                console.log(error)
            })
            axios.get(`http://localhost:8080/api/wars`, {headers: {"authorization": `${token}`}})
                .then((response) => {
                    setWarList(response.data)
                }).catch((error) => {
                console.log(error)
            })
        }
    }, []);

    const parse_date = (date) => {
        const date_obj = new Date(date)
        return `${date_obj.getFullYear()}-${(date_obj.getMonth() + 1).toString(10).padStart(2, '0')}-${date_obj.getDate().toString(10).padStart(2, '0')}`
    }

    useEffect(() => {
        if(pickedResourcesList.length > 0 && pickedWarList.length > 0) {
            const token = localStorage.getItem("token")
            if (token) {

                const start_date = parse_date(pickedWarList.sort((a, b) => new Date(a.startDate) - new Date(b.endDate))[0].startDate)
                const end_date = parse_date(pickedWarList.sort((a, b) => new Date(b.endDate) - new Date(a.endDate))[0].endDate)

                for (let i = 0; i < pickedResourcesList.length; i++) {
                   axios.get(`http://localhost:8080/api/resources/id/${pickedResourcesList[i].id}?start_date=${start_date}&end_date=${end_date}`, {headers: {"authorization": `${token}`}})
                        .then((response) => {
                            setResourcePrices([response.data])
                        }).catch((error) => {
                        console.log(error)
                    })
                }

            }
        }
    }, [pickedResourcesList, pickedWarList]);

    return (
        <div className="vh-100 overflow-hidden bg-dark bg-opacity-75">
            <div className="vh-100 overflow-hidden d-flex flex-md-row flex-column bg-dark bg-opacity-10">
                <div className="col-1 h-75">
                    <PickList
                        list={resourcesList}
                        no_data_message="No resource data"
                        pickedList={pickedResourcesList}
                        setPickedList={setPickedResourcesList}
                    />
                </div>
                <div className="col-5 h-75 mb-3 overflow-scroll">
                    <WarPicker
                        list={warList}
                        pickedList={pickedWarList}
                        setPickedList={setPickedWarList}
                        max_picked_items={2}
                    />
                </div>
                <div className="col-3 h-75 overflow-scroll mb-3">
                    <BasicChart
                        list={resourcePrices}
                        />
                </div>
            </div>
        </div>
    );
};
export default MainApp;