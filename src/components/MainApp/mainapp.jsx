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
        const war_end_date = new Date(war.endDate)
        let price_array = []
        for(let date = war_start_date; date <= war_end_date; date.setDate(date.getDate() + 1)) {
            const resource_price = resource.prices.find(price => {
                return parse_date(price.date) === parse_date(date)
            })
            if (resource_price) {
                price_array.push(resource_price.price)
            } else {
                price_array.push(null)
            }
        }

        return price_array;
    }

    const parse_resource_requests = (resource_requests) => {
        const request_data = resource_requests.map(request => request.data)
        const array_of_prices = []
        pickedWarList.forEach(war => {
            request_data.forEach(resource => {
                let price_array = get_resource_prices(war, resource);
                array_of_prices.push({
                    price: price_array,
                    type: resource.name,
                    war: war.name,
                })
            })
        })
        const longest_war_in_days = Math.max(...array_of_prices.map(price => price.price.length))
        const labels = Array.from(Array(longest_war_in_days).keys()).map(day => `Day ${day + 1}`)

        return {
            labels: labels,
            data: array_of_prices
        }
    }

    const parse_resource_prices = (resource_prices) => {
        return pickedWarList.map((war, war_index) => {
            return {
                label: war.name,
                data: resource_prices.prices
                    .filter(price => parse_date(price.date) >= parse_date(war.startDate) && parse_date(price.date) <= parse_date(war.endDate))
                    .sort((a, b) => new Date(a.date) - new Date(b.date))
                    .map((price, price_index) => {
                        return {
                            day: price_index + 1,
                            price: price.price
                        }
                    })
            }
        })
    }

    useEffect(() => {
        if(pickedResourcesList.length > 0 && pickedWarList.length > 0) {
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
                <div className="m-3 h-75 w-100 me-5">
                    <BasicChart
                        list={resourcesChartData}
                        />
                </div>
            </div>
        </div>
    );
};
export default MainApp;