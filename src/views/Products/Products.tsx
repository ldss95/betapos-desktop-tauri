import { useState, useEffect } from 'react'
import {
	Table,
	Layout,
	Badge,
	Space,
	Modal,
	List,
	Row,
	Form,
	Input
} from 'antd'
import Swal from 'sweetalert2'

import { Header } from '../../components'
import http from '../../http'
import { format } from '../../helper'

const { Content } = Layout

const Products = () => {
	const [products, setProducts] = useState([])
	const [loading, setLoading] = useState(true)
	const [barcodes, setBarcodes] = useState([])
	const [searchPhrase, setSearchPhrase] = useState('')
	const [changePrice, setChangePrice] = useState<any>({})

	useEffect(() => {
		fetchProducts()
	}, [])

	const fetchProducts = () => {
		http.get('/products')
			.then(res => {
				setProducts(res.data)
				setLoading(false)
			}).catch(error => {
				Swal.fire('Oops!', 'No se pudo cargar la lista de productos.', 'error');
				console.error(error)
			})
	}

	const filteredProducts = () => {
		const phrase = searchPhrase.toLocaleLowerCase()

		if (phrase === '') {
			return products
		}

		const productMath = (product: any) => {
			const { id, name, barcodes, reference, price } = product
			
			if (id === Number(phrase))
				return true
			
			if (price === Number(phrase))
				return true
			
			if (name.toLowerCase().includes(phrase))
				return true
			
			if (`${reference}`.toLowerCase().includes(phrase))
				return true
			
			if (barcodes.filter(({ barcode }: any) => barcode.toLowerCase().includes(phrase)).length > 0)
				return true
			
			return false
		}

		return products.filter(product => productMath(product))
	}

	return (
		<Layout style={{ height: '100vh' }}>
			<Header title="Productos" />
			<br/>

			<Content className="main">
				<Row justify="end">
					<Form>
						<Form.Item label="Buscar">
							<Input
								onKeyUp={({ target }: any) => setSearchPhrase(target.value)} 
								autoFocus	
							/>
						</Form.Item>
					</Form>
				</Row>
				<Table
					rowKey={(record: any) => record.id}
					dataSource={filteredProducts()}
					loading={loading}
					pagination={{ pageSize: 100 }}
					scroll={{ y: 'calc(100vh - 340px)' }}
					columns={[
						{
							title: 'Nombre',
							dataIndex: 'name',
							sorter: (a, b) => a.name.localeCompare(b.name)
						},
						{
							title: 'Código de Barras',
							dataIndex: 'barcodes',
							render: (barcodes) => {
								if (!barcodes[0])
									return ''
								
								const quantity = barcodes.length
								return (
									<Space>
										{barcodes[0].barcode}
										<div onClick={() => setBarcodes(barcodes)}>
											<Badge
												count={(quantity > 1) ? `+ ${quantity - 1}` : 0}
												style={{ cursor: 'pointer' }}
											/>
										</div>
									</Space>
								)
							},
							sorter: (a, b) => (a.barcodes[0] && b.barcodes[0])
								? a.barcodes[0].barcode.localeCompare(b.barcodes[0].barcode)
								: null
						},
						{
							title: 'Referencia',
							dataIndex: 'reference',
							sorter: (a, b) => a.name.localeCompare(b.name)
						},
						{
							title: 'Precio',
							dataIndex: 'price',
							render: (price) => format.cash(price, 2),
							sorter: (a, b) => a.price - b.price
						}
					]}
				/>
			</Content>

			<Modal
				visible={barcodes.length > 0}
				onCancel={() => setBarcodes([])}
				footer={null}
				width={300}
			>
				<List
					dataSource={barcodes}
					renderItem={({ barcode }) => <List.Item>{barcode}</List.Item>}
				/>
			</Modal>
		</Layout>
	)
}

export default Products