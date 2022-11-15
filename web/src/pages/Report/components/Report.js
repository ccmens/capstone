export function Report(props) {
    return(
        <div className='productList'>
            <div key={props.id} className='productCard'>
                <div className='productCard__content'>
                    <h3 className='productName'>{props.name}</h3>
                    <div className='displayStack__1'>
                        <div className='unitLeft'>{props.unitLeft}</div>
                        <div className='productUnit'> units left</div>
                    </div>
                    <div className='displayStack__2'>
                        <div>
                        </div>
                        <div className='productTime'> Update Just Now</div>
                    </div>
                </div>
            </div>
        </div>
    )
}