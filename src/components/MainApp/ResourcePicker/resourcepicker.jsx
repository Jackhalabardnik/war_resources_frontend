import Select from 'react-select'

const ResourcePicker = (props) => {

    const resources_selects_list = props.list.map((item) => {
        return {
            value: item,
            label: item.name
        }
    });

    return (
        <div>
            {
                props.list.length > 0 &&
                <Select
                    options={resources_selects_list}
                    defaultValue={resources_selects_list[0]}
                    onChange={(selected_option) => props.setPickedList(selected_option.map(item => item.value))}
                    isMulti
                />
            }
        </div>
    );
}

export default ResourcePicker;