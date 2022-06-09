import Select from 'react-select'
import {useState, useEffect} from "react";

const WarPicker = (props) => {

    const create_option_list = (list) => {
        return list.map((item) => {
            return {
                value: item,
                label: item.name
            }
        })
    }

    const [minimal_date, setMinimalDate] = useState(1970);
    const [war_selects_list, setWarSelectsList] = useState(create_option_list(props.list));

    const date_range_selects = [
        {value: 1970, label: 'Wars from 1970'},
        {value: 1980, label: 'Wars from 1980'},
        {value: 1990, label: 'Wars from 1990'},
        {value: 2000, label: 'Wars from 2000'},
        {value: 2010, label: 'Wars from 2010'},
    ]

    const get_year_from_string = (str) => {
        return parseInt(str.split('-')[0]);
    }

    useEffect(() => {
        setWarSelectsList(create_option_list(props.list.filter(item => get_year_from_string(item.startDate) >= minimal_date)));
    }, [props.list, minimal_date])

    const handleDateRangeChange = (selected_option) => {
        setMinimalDate(selected_option.value);
    }

    return (
        <div>

            <Select options={date_range_selects}
                    onChange={(selected_option) => handleDateRangeChange(selected_option)}
                    defaultValue={date_range_selects[0]}
            />

            {
                props.list.length > 0 &&
                <Select
                    options={war_selects_list}
                    defaultValue={war_selects_list[0]}
                    onChange={(selected_option) => props.setPickedList(selected_option.map(item => item.value))}
                    isMulti
                />
            }
            {
                props.list.length === 0 &&
                <div className="mt-1 mx-1 text-white">
                    {props.no_data_message}
                </div>
            }
        </div>
    );
}

export default WarPicker;