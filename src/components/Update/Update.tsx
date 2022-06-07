import React, { useState } from 'react';
import { Popover, message, Badge } from 'antd'
import { SyncOutlined } from '@ant-design/icons'
import moment from 'moment'

import http from '../../http'

const Update = () => {
	const [lastUpdate, setLastUpdate] = useState('')
	const [loading, setLoading] = useState(false)

	const getLastUpdate = () => {
		http.get('/meta')
			.then(({ data }) => {
				if(data.lastUpdate)
					setLastUpdate(moment(data.lastUpdate).calendar())
				else
					setLastUpdate('Desconocida.')
				
				setLoading(false)
			}).catch(error => {
				setLoading(false)
				console.error(error)
				message.error('No se pudo obtener los datos de la ultima actualización.')
			})
	}

	const update = () => {
		setLoading(true)
		http.post('/sync')
			.then(() => {
				getLastUpdate()
			}).catch(error => {
				setLoading(false)
				console.error(error)
				message.error('No se pudo reiniciar la sincronización.')
			})
	}

	return (
		<Popover
			placement='bottomRight'
			content={lastUpdate}
			title='Ultima Sincronización'
		>
			<Badge>
				<SyncOutlined
					spin={loading}
					className='header-btn'
					onMouseEnter={getLastUpdate}
					onClick={update}
				/>
			</Badge>
		</Popover>
	);
}

export default React.memo(Update);
