import { Typography } from 'antd'

import './MiniCard.scss'
import { format } from '../../helper'
const { Text, Title } = Typography

interface MiniCardProps {
    id: number;
    name: string;
    barcode: string;
    reference: string;
    price: number;
    index: number;
    clickTrigger: any;
}
const MiniCard = ({ id, name, barcode, reference, price, index, clickTrigger }: MiniCardProps) => {
    return (
        <div
            className="product-mini-card"
            onClick={clickTrigger}
        >
            <Title level={3}>#{index + 1}</Title>

            <Title level={5}>{name.substr(0, 16)}</Title>
            <br />
            
            <Text>ID: {id}</Text>
            <br />

            <Text>Bar: {barcode}</Text>
            <br />
            
            <Text>Ref: {reference}</Text>
            <br />
            
            <Title
                level={2}
                className='product-price'
            >
                $ {format.cash(price)}
            </Title>
        </div>
    );
}

export default MiniCard;
