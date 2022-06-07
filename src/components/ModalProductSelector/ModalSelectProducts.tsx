import { memo } from 'react'
import { Modal } from 'antd'
import ProductCard from '../Product/MiniCard'

interface ModalSelectProductProps {
	visible: boolean;
	products: any[];
	hide: () => void;
	addToCart: (product: any) => void;
}
const ModalSelectProducts = ({ visible, products, hide, addToCart }: ModalSelectProductProps) => {
    return (
		<Modal
			visible={visible}
			onCancel={hide}
			title="Seleccione un producto"
			footer={null}
			width={510}
		>
			{products.map((product: any, index: number) =>
				<ProductCard
					{...product}
					index={index}
					key={product.id}
					product={product}
					clickTrigger={() => {
						addToCart(product)
						hide()
					}}
				/>
			)}
        </Modal>
    );
}

export default memo(ModalSelectProducts);
