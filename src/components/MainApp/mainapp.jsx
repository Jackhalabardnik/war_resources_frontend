import PickList from "./PickList/picklist";
import {useEffect, useState} from "react";
import axios from "axios";
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import {DateRangePicker} from 'react-date-range';
import {Alert} from "react-bootstrap";

const MainApp = () => {

    const [resourcesList, setResourcesList] = useState([]);
    const [warList, setWarList] = useState([]);
    const [selectionRange, setSelectionRange] = useState({
        startDate: new Date(),
        endDate: new Date(),
        key: 'selection',
    })
    const [selectionRangeError, setSelectionRangeError] = useState("");
    const [pickedResourcesList, setpickedResourcesList] = useState([]);
    const [pickedWarList, setpickedWarList] = useState([]);
    const [pickedResourcesPricesList, setPickedResourcesPricesList] = useState([]);
    const [resourcePrices, setResourcePrices] = useState([]);

    const handleSelect = (ranges) => {
        if (ranges.selection.startDate > new Date()) {
            ranges.selection.startDate = new Date();
            ranges.selection.endDate = new Date();
            setSelectionRangeError("You can't select future start and end date!");
        } else if (ranges.selection.endDate > new Date()) {
            ranges.selection.endDate = new Date();
            setSelectionRangeError("You can't select future end date!");
        } else {
            setSelectionRangeError("");
        }
        setSelectionRange(ranges.selection);
    }

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
        if(pickedResourcesList.length > 0 && selectionRange) {
            const token = localStorage.getItem("token")
            if (token) {
                for (let i = 0; i < pickedResourcesList.length; i++) {
                    axios.get(`http://localhost:8080/api/resources/id/${pickedResourcesList[i].id}?start_date=${parse_date(selectionRange.startDate)}&end_date=${parse_date(selectionRange.endDate)}`, {headers: {"authorization": `${token}`}})
                        .then((response) => {
                            setResourcePrices([...resourcePrices,response.data])
                        }).catch((error) => {
                        console.log(error)
                    })
                }

            }
        }
    }, [pickedResourcesList, selectionRange]);

    return (
        <div className="vh-100 overflow-hidden">
            <div className="vh-100 overflow-hidden d-flex flex-md-row flex-column">
                <div className="col-1 h-50 overflow-scroll my-3">
                    <PickList
                        list={resourcesList}
                        no_data_message="No resource data"
                        pickedList={pickedResourcesList}
                        setPickedList={setpickedResourcesList}
                    />
                </div>
                <div className="col-3 h-50 overflow-scroll mb-3">
                    <PickList
                        list={warList}
                        no_data_message="No war data"
                        max_picked_items={2}
                        pickedList={pickedWarList}
                        setPickedList={setpickedWarList}
                    />
                </div>
                <div className="m-1 p-1">
                    <DateRangePicker
                        ranges={[selectionRange]}
                        onChange={handleSelect}
                    />
                    {
                        selectionRangeError &&
                        <Alert variant="danger">
                            {selectionRangeError}
                        </Alert>
                    }
                </div>
                <div className="col-3 h-50 overflow-scroll mb-3">
                    <PickList
                        list={resourcePrices}
                        no_data_message="No prices data"
                        max_picked_items={2}
                        pickedList={pickedResourcesPricesList}
                        setPickedList={setPickedResourcesPricesList}
                    />
                </div>
            </div>
        </div>
    );
};
export default MainApp;