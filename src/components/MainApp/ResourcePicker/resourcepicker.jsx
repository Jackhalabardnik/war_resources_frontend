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
                <div className="text-center d-flex align-items-center flex-column">
                    <div className="d-flex align-items-center">
                        <div className="me-3">
                            <div className="px-1">
                                Resource for war 1
                            </div>
                            <Select
                                options={resources_selects_list}
                                onChange={(selected_option) => props.setFirstPickedResource(selected_option.value)}
                                className="w-auto"
                            />
                        </div>
                        <div>
                            <div className="px-1">
                                Resource for war 2
                            </div>
                            <Select
                                options={resources_selects_list}
                                onChange={(selected_option) => props.setSecondPickedResource(selected_option.value)}
                                className="w-auto"
                            />
                        </div>
                    </div>
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