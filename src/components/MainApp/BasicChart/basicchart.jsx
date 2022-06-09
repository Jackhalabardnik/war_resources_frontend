import {LineElement, PointElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, Title, Tooltip} from "chart.js";
import {Line} from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    LineElement,
    Title,
    Tooltip,
    Legend,
    PointElement
);


const BasicChart = (props) => {

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: `Chart 1`,
            },
        },
        maintainAspectRatio: true,
    }

    let chartData = props.list.labels.length > 0 ? {
        labels: props.list.labels,
        datasets: props.list.data.map((data, index) => {
            return {
                label: `${data.war} -> ${data.type}`,
                data: data.price,
                backgroundColor: 'rgb(255, 99, 132)',
            }
        })
    } : null;

    return (
        <div className="bg-white">
            {/*{*/}
            {/*    props.list.length > 0 &&*/}
            {/*    <ul>*/}
            {/*        {props.list.map((resource, resource_index) => (*/}
            {/*            <li key={resource_index}>*/}
            {/*                {resource.label}*/}
            {/*                <ul className="ms-2">*/}
            {/*                    {resource.data.map((price, price_index) => (*/}
            {/*                        <li key={price_index}>*/}
            {/*                            {price.day} -> {price.price}*/}
            {/*                        </li>*/}
            {/*                    ))}*/}
            {/*                </ul>*/}
            {/*            </li>*/}
            {/*        ))}*/}
            {/*    </ul>*/}
            {/*}*/}
            {
                chartData &&
                <Line options={chartOptions} data={chartData} type={"bar"}/>
            }
        </div>
    )
}

export default BasicChart;