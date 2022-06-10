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
    const [pickedResource, setPickedResource] = useState(null);


    const [pickedFirstWar, setPickedFirstWar] = useState(null);
    const [firstChartData, setFirstChartData] = useState({
        labels: [],
        data: {}
    });
    const [firstChartError, setFirstChartError] = useState('');

    const [pickedSecondWar, setPickedSecondWar] = useState(null);
    const [secondChartData, setSecondChartData] = useState({
        labels: [],
        data: {}
    });
    const [secondChartError, setSecondChartError] = useState('');

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

    const parse_resource_request = (resource, pickedWar, setError) => {
        let data = {}
        let labels = []
        const is_data_available = resource.prices.length > 0

        if (is_data_available) {
            let price_array = get_resource_prices(pickedWar, resource);
            data = {
                price: price_array,
                type: resource.name,
                war: pickedWar.name,
            }
            labels = Array.from(Array(data.price.length).keys()).map(day => `Day ${day + 1}`)
            setError('')
        } else {
            setError('There is no data for the selected resource and war')
        }

        return {
            labels: labels,
            data: data
        }
    }

    const load_chart_data = (setChartData, pickedWar, setError) => {
        const token = localStorage.getItem("token")

        if (token) {
            const start_date = parse_date(pickedWar.startDate)
            const end_date = parse_date(pickedWar.endDate)

            axios.get(`http://localhost:8080/api/resources/id/${pickedResource.id}?start_date=${start_date}&end_date=${end_date}`, {headers: {"authorization": `${token}`}})
                .then((response) => {
                    setChartData(parse_resource_request(response.data, pickedWar, setError))
                }).catch((error) => {
                console.log(error)
            })
        }
    }

    useEffect(() => {
        if (pickedResource && pickedFirstWar) {
            load_chart_data(setFirstChartData, pickedFirstWar, setFirstChartError)
        } else {
            setFirstChartData({
                labels: [],
                data: {}
            })
        }
        // eslint-disable-next-line
    }, [pickedResource, pickedFirstWar]);

    useEffect(() => {
        if (pickedResource && pickedSecondWar) {
            load_chart_data(setSecondChartData, pickedSecondWar, setSecondChartError)
        } else {
            setSecondChartData({
                labels: [],
                data: {}
            })
        }
        // eslint-disable-next-line
    }, [pickedResource, pickedSecondWar]);

    return (
        <div className="vh-100 overflow-scroll ">
            <div className=" d-flex flex-md-row flex-column h-100">
                <div className="col-xl-3 col-md-4 col-12 m-1">
                    <ResourcePicker
                        list={resourcesList}
                        pickedList={pickedResource}
                        setPickedList={setPickedResource}
                    />
                    <WarPicker
                        list={warList}
                        setPickFirst={setPickedFirstWar}
                        setPickSecond={setPickedSecondWar}
                    />
                </div>
                <div className="col-xl-9 col-md-8 col-12 m-1 d-flex">
                    <BasicChart
                        list={firstChartData}
                        chartError={firstChartError}
                    />
                    <BasicChart
                        list={secondChartData}
                        chartError={secondChartError}
                    />
                </div>
            </div>
        </div>
    );
};
export default MainApp;