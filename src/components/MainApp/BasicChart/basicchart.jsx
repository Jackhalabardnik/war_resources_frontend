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

    const get_color = (index, type) => {
        if (type === 'oil') {
            return `rgb(${75 + index * 20}, 192, 192)`
        } else if (type === 'gold') {
            return `rgb(75, ${120 + index * 20}, 192)`
        } else if (type === 'silver') {
            return `rgb(75, 192, ${120 + index * 20})`
        }
    }

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: `War resources prices`,
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
                pointRadius: 1,
                pointBorderColor: `rgb(0,0,0)`,
                borderColor: get_color(index, data.type),
                backgroundColor: get_color(index, data.type),
                tension: 0.1,
                spanGaps: true,
            }
        })
    } : null;

    return (
        <div className="bg-white">
            {
                chartData &&
                <Line options={chartOptions} data={chartData} type={"bar"}/>
            }
        </div>
    )
}

export default BasicChart;