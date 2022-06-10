import Select from 'react-select'

const ResourcePicker = (props) => {

    const resources_selects_list = props.list.map((item) => {
        return {
            value: item,
            label: item.name
        }
    });

    return (
        <div className="w-100 mx-3 d-flex justify-content-center">
            {
                props.list.length > 0 &&
                <div className="text-center d-flex align-items-center">
                    <div className="me-1">
                        Resource:
                    </div>
                    <Select
                        options={resources_selects_list}
                        onChange={(selected_option) => props.setPickedList(selected_option.value)}
                        className="w-auto"
                    />
                </div>
            }
            {
                props.list.length === 0 &&
                <div className="mt-1 mx-1 text-white text-center">
                    Loading...
                </div>
            }
        </div>
    );
}

export default ResourcePicker;