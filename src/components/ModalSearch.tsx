import { useState, useEffect, memo } from 'react';
import { Modal, Table, Input, InputNumber, Form, Row, Col } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import Swal from 'sweetalert2';
import { useDispatch } from 'react-redux';

import http from '../http';
import { format } from '../helper';
import { addProductToCart } from '../redux/actions/cart';

const PAGE_SIZE = 100;

interface ModalSearchProps {
	visible: boolean;
	close: () => void;
	input: string;
}
const ModalSearch = ({ visible, close, input }: ModalSearchProps) => {
	const [form] = Form.useForm();
	const dispatch = useDispatch();

	const [products, setProducts] = useState([]);
	const [loading, setLoading] = useState(false);
	const [pagination, setPagination] = useState({ current: 1, pageSize: PAGE_SIZE });
	const [filters, setFilters] = useState({});

	useEffect(() => {
		getProducts(pagination);

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		setFilters({ ...filters, search: input })
		if(visible)
			form.setFieldsValue({ search: input })
		
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [input])

	useEffect(() => {
		if (!visible) {
			setPagination({ current: 1, pageSize: PAGE_SIZE })
			setProducts([])
			setFilters({})
		}
	}, [visible])

	useEffect(() => {
		getProducts({ current: 1, pageSize: PAGE_SIZE });

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [filters]);

	const getProducts = async (_pagination: any) => {
		try {
			setLoading(true);
			const { data }: any = await http.get('/products/table', {
				params: {
					pagination: _pagination,
					filters
				}
			})

			if (!data) {
				return;
			}

			const { products, pagination } = data;
			setProducts(products.filter(({ barcodes }: any) =>
				barcodes.length == 0 ||
				!barcodes.find(({ barcode }: any) => barcode == '999')
			));
			setPagination(pagination);
		} catch (error) {
			Swal.fire(
				'Error',
				'No se ha podido obtener la lista de productos.',
				'error'
			);
			console.error(error);
		} finally {
			setLoading(false);
		}
	};

	return (
		<Modal
			visible={visible}
			onCancel={() => {
				setFilters({});
				form.resetFields();
				close();
			}}
			footer={null}
			width={800}
			destroyOnClose
			title="Buscar Producto"
		>
			<Form layout="vertical" form={form}>
				<Row gutter={15}>
					<Col span={8}>
						<Form.Item label="Buscar" name="search">
							<Input
								className="default"
								autoFocus
								onChange={(event) =>
									setFilters({
										...filters,
										search: event.target.value
									})
								}
							/>
						</Form.Item>
					</Col>
					<Col span={6}>
						<Form.Item label="Precio" name="price">
							<InputNumber
								className="default"
								onChange={(price) =>
									setFilters({
										...filters,
										price
									})
								}
							/>
						</Form.Item>
					</Col>
				</Row>
			</Form>
			<Table
				columns={[
					{
						title: 'Nombre',
						dataIndex: 'name'
					},
					{
						title: 'C??digo de Barras',
						dataIndex: 'barcodes',
						render: (barcodes) => {
							if(barcodes.length == 0){
								return ''
							}

							const [{ barcode }] = barcodes;
							return barcode
						}
					},
					{
						title: 'Precio',
						dataIndex: 'price',
						render: (price) => format.cash(price)
					},
					{
						title: 'Agregar',
						align: 'center',
						render: ({ barcodes, ...product }) => (
							<PlusOutlined
								style={{ fontSize: 24, cursor: 'pointer' }}
								onClick={() => {
									dispatch(addProductToCart({
										...product,
										...(barcodes.length > 0) && {
											barcode: barcodes[0].barcode
										}
									}));
									setFilters({});
									form.resetFields();
									close();
								}}
							/>
						)
					}
				]}
				rowKey={({ id }) => id}
				dataSource={products}
				loading={loading}
				pagination={pagination}
				onChange={getProducts}
			/>
		</Modal>
	);
};

export default memo(ModalSearch);
