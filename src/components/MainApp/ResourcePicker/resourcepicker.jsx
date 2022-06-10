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
                    onChange={(selected_option) => props.setPickedList(selected_option.value)}
                />
            }
            {
                props.list.length === 0 &&
                <div className="mt-1 mx-1 text-white">
                    Loading...
                </div>
            }
        </div>
    );
}

export default ResourcePicker;