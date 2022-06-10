import {
    CategoryScale,
    Chart as ChartJS,
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

const hsv2rgb = (h, s, v) => {
    let f = (n, k = (n + h / 60) % 6) => v - v * s * Math.max(Math.min(k, 4 - k, 1), 0);
    return [f(5), f(3), f(1)];
}

const golden_ratio = 0.618033988749895;

const BasicChart = (props) => {

    const get_color = () => {

        let hue = (Math.random() + golden_ratio);
        hue = hue > 1 ? hue - 1 : hue;
        const saturation = 0.8;
        const value = 0.95;
        const rgb = hsv2rgb(hue * 360, saturation, value);
        return `rgb(${rgb[0] * 255}, ${rgb[1] * 255}, ${rgb[2] * 255})`

    }

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: {
                display: props.list.labels.length > 0,
                position: 'top',
            },
            title: {
                display: true,
                text: `${props.list.data.war ? props.list.data.war : 'No data'}`,
            },
        },
        maintainAspectRatio: true,
    }

    const label_color = get_color()

    let chartData = props.list.labels.length > 0 ?
        {
            labels: props.list.labels,
            datasets: [{
                label: `${props.list.data.type ? props.list.data.type : 'Your legend'}`,
                data: props.list.data.price,
                pointRadius: 0,
                borderColor: label_color,
                backgroundColor: label_color,
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
        <div className="w-100">
            {
                chartData && !props.chartError &&
                <Line options={chartOptions} data={chartData} type={"bar"} className="bg-white rounded-2"/>
            }
            {
                props.chartError &&
                <div className="text-center">
                    <h1>{props.chartError}</h1>
                </div>
            }
        </div>
    )
}

export default BasicChart;