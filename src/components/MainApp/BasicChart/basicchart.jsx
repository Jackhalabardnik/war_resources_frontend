const BasicChart = (props) => {
    // .sort((a, b) => new Date(a) - new Date(b))
    return (
        <div>
            {
                props.list.length > 0 &&
                <ul>
                    {props.list.map((resource, resource_index) => (
                        <li key={resource_index}>
                            {resource.name}
                            <ul className="ms-2">
                                {resource.prices.sort((a, b) => new Date(a.date) - new Date(b.date)).map((price, price_index) => (
                                    <li key={price_index}>
                                        {price.date} -> {price.price}
                                    </li>
                                ))}
                            </ul>
                        </li>
                    ))}
                </ul>
            }
        </div>
    )
}

export default BasicChart;