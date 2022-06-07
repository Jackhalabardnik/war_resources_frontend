import {useState} from "react";

const MenuButton = (props) => {
    const [show_options, setShowOptions] = useState(false);

    return (
        <div
            className={props.is_highlighted_mode ? props.highlighted_bg : props.not_highlighted_bg}
            onPointerEnter={() => setShowOptions(true)}
            onPointerLeave={() => setShowOptions(false)}
            onClick={props.main_button_on_click}
        >
            <div className={"d-flex justify-content-between p-2 text-center align-items-center text-white " + (show_options ? props.hover_bg : "")} >
                    {props.main_button_text}
            </div>
        </div>
    );
}


export default MenuButton;