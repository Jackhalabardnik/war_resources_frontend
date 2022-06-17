import {
    CategoryScale,
    Chart as ChartJS,
    Ticks,
    Legend,
    LinearScale,
    LineElement,
    PointElement,
    Title,
    Tooltip
} from "chart.js";
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

    const get_color = (resource) => {
        switch (resource) {
            case 'gold':
                return '#ffc700';
            case 'silver':
                return '#888888';
            default:
                return '#000000';
        }
    }

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: {
                display: false,
            },
            title: {
                display: true,
                text: `${props.list.data.war ? props.list.data.war : 'No data'}`,
            },
        },
        scales: {
            y: {
                ticks: {
                    callback: function(value, index, ticks) {
                        return value.toFixed(2) + " $";
                    }
                }
            },
            x: {
                ticks: {
                    callback: function(value) {
                        return this.getLabelForValue(value).split('-')[0];
                    }
                }
            }
        },
        maintainAspectRatio: true,
    }

    let chartData = props.list.labels.length > 0 ?
        {
            labels: props.list.labels,
            datasets: [{
                label: `${props.list.data.type}`,
                data: props.list.data.price,
                backgroundColor: get_color(props.list.data.type),
                borderColor: get_color(props.list.data.type),
                pointRadius: 0,
                tension: 0.1,
                spanGaps: true,
            }]
        } :
        {
            labels: [],
            datasets: [{
            }]
        };

    return (
        <div className="w-100 mx-2">
            {
                chartData &&
                <Line options={chartOptions} data={chartData} type={"bar"} className="mx-1"/>
            }
            {
                props.chartError &&
                <div className="text-center alert-danger mt-1 rounded-2">
                    {props.chartError}
                </div>
            }
        </div>
    )
}

export default BasicChart;