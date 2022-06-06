import MenuButton from "../MenuButton/menubutton";

const PickList = (props) => {

    const pick_item = (item) => {
        if (props.pickedList.includes(item)) {
            props.setPickedList(props.pickedList.filter(i => i !== item));
        } else {
            if (props.max_picked_items && props.pickedList.length >= props.max_picked_items) {
                    const new_picked_list = props.pickedList.slice(props.pickedList.length - 1);
                    new_picked_list.push(item);
                props.setPickedList(new_picked_list);
            } else {
                props.setPickedList([...props.pickedList, item]);
            }
        }
    }

    return (
        <ul className="list-unstyled overflow-scroll w-100">
            {
                props.list.length > 0 &&
                props.list.map((resource, index) => (
                    <li key={index} className="mt-1 mx-1">
                        <MenuButton
                            is_highlighted_mode={props.pickedList.includes(resource)}
                            highlighted_bg="bg-dark bg-opacity-25 rounded-1"
                            hover_bg="bg-dark bg-opacity-10 rounded-1"
                            not_highlighted_bg=""
                            main_button_on_click={() => pick_item(resource)}
                            main_button_text={resource.name}
                        />
                    </li>
                ))
            }
            {
                props.list.length === 0 &&
                <li className="mt-1 mx-1 text-white">
                    {props.no_data_message}
                </li>
            }

        </ul>
    )
}

export default PickList;