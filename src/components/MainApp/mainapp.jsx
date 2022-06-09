import WarPicker from "./WarPicker/warpicker";
import ResourcePicker from "./ResourcePicker/resourcepicker";
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
    const [chartError, setChartError] = useState('');
    const [chartWarning, setChartWarning] = useState([]);
    const [resourcesChartData, setResourcesChartData] = useState({
        labels: [],
        data: {}
    });

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

    const get_resource_prices = (war, resource) => {
        const war_start_date = new Date(war.startDate)
        const war_length = (new Date(war.endDate) - new Date(war.startDate)) / (1000 * 60 * 60 * 24)

        let first_price_index = resource.prices.findIndex(price => {
            return parse_date(price.date) === parse_date(war_start_date)
        })

        if (first_price_index === -1) {
            return null;
        }

        let price_array = []

        if (first_price_index === -1) {
            console.log(resource.prices)
        }

        for (let i = first_price_index; i < first_price_index + war_length; i++) {
            price_array.push(resource.prices[i].price)
        }

        return price_array;
    }

    const parse_resource_requests = (resource_requests) => {
        const request_data = resource_requests.map(request => request.data)
        const array_of_prices = []
        let labels = []
        const is_data_available = request_data.find(resource => resource.prices.length > 0)
        let warning_data = []

        if (is_data_available) {
            pickedWarList.forEach(war => {
                request_data.forEach(resource => {
                    if (resource.prices.length > 0) {
                        let price_array = get_resource_prices(war, resource);
                        if (price_array) {
                            array_of_prices.push({
                                price: price_array,
                                type: resource.name,
                                war: war.name,
                            })
                        } else {
                            warning_data.push(`${resource.name} has no prices for ${war.name}`)
                        }
                    } else {
                        warning_data.push(`${resource.name} has no prices for ${war.name}`)
                    }
                })
            })
            const longest_war_in_days = Math.max(...array_of_prices.map(price => price.price.length))
            labels = Array.from(Array(longest_war_in_days).keys()).map(day => `Day ${day + 1}`)
            setChartError('')
            setChartWarning(warning_data)
        } else {
            setChartError('There is no data for the selected resources and wars')
        }

        return {
            labels: labels,
            data: array_of_prices
        }
    }

    useEffect(() => {
        if (pickedResourcesList.length > 0 && pickedWarList.length > 0) {
            const token = localStorage.getItem("token")
            if (token) {

                const start_date = parse_date(pickedWarList.sort((a, b) => new Date(a.startDate) - new Date(b.endDate))[0].startDate)
                const end_date = parse_date(pickedWarList.sort((a, b) => new Date(b.endDate) - new Date(a.endDate))[0].endDate)

                let resource_requests = [];

                for (let i = 0; i < pickedResourcesList.length; i++) {
                    resource_requests.push(axios.get(`http://localhost:8080/api/resources/id/${pickedResourcesList[i].id}?start_date=${start_date}&end_date=${end_date}`, {headers: {"authorization": `${token}`}}))
                }

                axios.all(resource_requests).then(axios.spread((...responses) => {
                    setResourcesChartData(parse_resource_requests(responses))
                })).catch((error) => {
                    console.log(error)
                })

            }
        } else {
            setResourcesChartData({
                labels: [],
                data: {}
            })
        }
        // eslint-disable-next-line
    }, [pickedResourcesList, pickedWarList]);

    return (
        <div className="vh-100 overflow-hidden bg-dark bg-opacity-75">
            <div className="vh-100 overflow-hidden d-flex flex-md-row flex-column bg-dark bg-opacity-10">
                <div className="col-2 h-75">
                    <ResourcePicker
                        list={resourcesList}
                        pickedList={pickedResourcesList}
                        setPickedList={setPickedResourcesList}
                    />
                </div>
                <div className="col-3 h-75 mb-3 overflow-scroll">
                    <WarPicker
                        list={warList}
                        pickedList={pickedWarList}
                        setPickedList={setPickedWarList}
                    />
                </div>
                <div className="m-3 h-75 w-100 me-5">
                    <BasicChart
                        list={resourcesChartData}
                        chartError={chartError}
                        chartWarning={chartWarning}
                    />
                </div>
            </div>
        </div>
    );
};
export default MainApp;