import { memo } from 'react';

interface TileProps {
	text: string;
	Icon: any;
	selected: boolean;
	onClick: () => void;
	disabled?: boolean;
}
const Tile = ({ text, Icon, selected, onClick, disabled }: TileProps) => (
	<div
		style={{
			display: 'flex',
			flexDirection: 'column',
			justifyContent: 'center',
			alignItems: 'center',
			marginRight: 15,
			background: disabled ? '#cdcdcd' : '#fff',
			padding: 15,
			borderRadius: 5,
			width: 180,
			height: 100,
			fontSize: 40,
			cursor: 'pointer',
			borderWidth: 4,
			borderStyle: 'solid',
			borderColor: selected ? '#ebc444' : '#fff',
			...(disabled) && {
				borderColor: '#cdcdcd',
			}
		}}
		{
			...!disabled && {
				onClick
			}
		}
	>
		<Icon twoToneColor={selected ? '#ebc444' : '#cdcdcd'} />
		<span
			style={{
				fontSize: 16,
				marginTop: 15,
				color: selected ? '#ebc444' : '#8c8c8c',
			}}
		>
			{text}
		</span>
	</div>
)

export default memo(Tile);