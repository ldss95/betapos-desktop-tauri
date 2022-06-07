import { memo } from 'react'

import './Product.scss'

const Product = ({ data, products, setProducts }: any) => {
	const handleAdd = () => {
		const product =
			products.find((product: any) => product.productId === data.productId) ||
			{ productId: data.productId, quantity: 0, price: data.price }
		
		if (product.quantity < data.quantity) {
			product.quantity++
		
			setProducts([
				...products.filter((product: any)=> product.productId !== data.productId),
				product
			])
		}
	}

	const handleRemove = () => {
		const product = products.find((product: any) => product.productId === data.productId)
		
		if (product && product.quantity > 0) {
			product.quantity--
		
			setProducts([
				...products.filter((product: any) => product.productId !== data.productId),
				product
			])
		}
	}

	const returned = () => {
		const product = products.find((product: any) => product.productId === data.productId)
		return (product) ? product.quantity: 0
	}

	return (
		<div className='product-credit-note'>
			{(returned() > 0) &&
				<span className="returned">{returned()}</span>
			}
			<span className='quantity'>{data.quantity}</span>
			<span className='name'>{data.product.name}</span>
			<div className="icons">
				<span
					className='icon'
					onClick={handleRemove}
				>
					-
				</span>
				<span
					className='icon'
					onClick={handleAdd}
				>
					+
				</span>
			</div>
		</div>
	)
}

export default memo(Product)