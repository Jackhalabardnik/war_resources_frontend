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

const hsv2rgb = (h,s,v) =>
{
    let f= (n,k=(n+h/60)%6) => v - v*s*Math.max( Math.min(k,4-k,1), 0);
    return [f(5),f(3),f(1)];
}

const golden_ratio = 0.618033988749895;

const BasicChart = (props) => {

    const get_color = () => {

        let hue = (Math.random() + golden_ratio);
        hue = hue > 1 ? hue - 1 : hue;
        const saturation = 0.8;
        const value = 0.95;
        const rgb = hsv2rgb(hue*360, saturation, value);
        const rgb_string = `rgb(${rgb[0]*255}, ${rgb[1]*255}, ${rgb[2]*255})`

        console.log(hue, rgb, rgb_string)

        return rgb_string

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
        datasets: props.list.data.map((data) => {
            const label_color = get_color()
            return {
                label: `${data.war} -> ${data.type}`,
                data: data.price,
                pointRadius: 0,
                borderColor: label_color,
                backgroundColor: label_color,
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