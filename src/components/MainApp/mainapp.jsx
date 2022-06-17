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

    const [firstPickedResource, setFirstPickedResource] = useState(null);
    const [secondPickedResource, setSecondPickedResource] = useState(null);


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
        let labels_array = []

        if (first_price_index === -1) {
            console.log(resource.prices)
        }

        for (let i = first_price_index; i < first_price_index + war_length; i++) {
            price_array.push(resource.prices[i].price)
            labels_array.push(`Day ${i+1}->` + parse_date(resource.prices[i].date))
        }

        return [price_array, labels_array];
    }

    const parse_resource_request = (resource, pickedWar, setError) => {
        let data = {}
        let labels = []
        const is_data_available = resource.prices.length > 0

        if (is_data_available) {
            let [price_array, labels_array] = get_resource_prices(pickedWar, resource);
            data = {
                price: price_array,
                type: resource.name,
                war: pickedWar.name,
            }
            labels = labels_array
            setError('')
        } else {
            setError('There is no data for the selected resource and war')
        }

        return {
            labels: labels,
            data: data
        }
    }

    const load_chart_data = (setChartData, pickedWar, resource, setError) => {
        const token = localStorage.getItem("token")

        if (token) {
            const start_date = parse_date(pickedWar.startDate)
            const end_date = pickedWar.endDate ? parse_date(pickedWar.endDate) : parse_date(new Date())

            axios.get(`http://localhost:8080/api/resources/id/${resource.id}?start_date=${start_date}&end_date=${end_date}`, {headers: {"authorization": `${token}`}})
                .then((response) => {
                    setChartData(parse_resource_request(response.data, pickedWar, setError))
                }).catch((error) => {
                console.log(error)
            })
        }
    }

    useEffect(() => {
        if (firstPickedResource && pickedFirstWar) {
            load_chart_data(setFirstChartData, pickedFirstWar, firstPickedResource, setFirstChartError)
        } else {
            setFirstChartData({
                labels: [],
                data: {}
            })
        }
        // eslint-disable-next-line
    }, [firstPickedResource, pickedFirstWar]);

    useEffect(() => {
        if (secondPickedResource && pickedSecondWar) {
            load_chart_data(setSecondChartData, pickedSecondWar, secondPickedResource, setSecondChartError)
        } else {
            setSecondChartData({
                labels: [],
                data: {}
            })
        }
        // eslint-disable-next-line
    }, [secondPickedResource, pickedSecondWar]);

    return (
        <div className="d-flex flex-column">
            <div className="d-flex justify-content-evenly flex-md-row flex-column my-1">
                <ResourcePicker
                    list={resourcesList}
                    setFirstPickedResource={setFirstPickedResource}
                    setSecondPickedResource={setSecondPickedResource}
                />
                <WarPicker
                    list={warList}
                    setPickFirst={setPickedFirstWar}
                    setPickSecond={setPickedSecondWar}
                />
            </div>
            <div className="d-flex overflow-scroll">
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
    );
};
export default MainApp;