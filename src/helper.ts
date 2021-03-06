/**
 * Evita que un input pueda recibir caracteres no numericos
 * Esta funcion puede ser insertada en un Event Listener de tipo keydown
 */
function avoidNotNumerics(event: any, decimals = 0){
	if(['Backspace', 'Delete', 'Tab', 'ArrowRight', 'ArrowLeft', 'Enter'].includes(event.key))
		return;

	if(event.key === ' ')
		return event.preventDefault();
		
	if(!decimals && event.key === '.')
		return event.preventDefault();
		
	const hasPoint = event.target.value.includes('.');
	const limitDecimals = hasPoint && event.target.value.split('.').pop().length === decimals;
	if(limitDecimals)
		return event.preventDefault()
		
	const isFirstPoint = (event.key === '.' && !event.target.value.includes('.'));
	const isNumber = !isNaN(Number(event.key));
	if(!isNumber && !isFirstPoint)
		event.preventDefault();
}


const format = {
	rnc: (rnc: string) =>
		rnc
			? `${rnc.substr(0, 3)}-${rnc.substr(3, 5)}-${rnc.substr(8, 1)}`
			: 'N/A',
	dui: (dui: string) =>
			dui
				? `${dui.substr(0, 3)}-${dui.substr(3, 7)}-${dui.substr(-1)}`
				: 'N/A',
	phone: (phone: string) =>
		phone
			? `(${phone.substr(0, 3)}) ${phone.substr(3, 3)}-${phone.substr(
					6,
					4
			  )}`
			: 'N/A',
	cash: (amount: number, decimals = 0, decimalsRequired = false) =>
		Intl.NumberFormat(
			'en-US', {
				minimumFractionDigits: (decimalsRequired || amount % 1 != 0 ) ? decimals : 0,
				maximumFractionDigits: decimals
			}
		).format(amount)
};

async function wait(time: number) {
	return new Promise(resolve => setTimeout(resolve, time * 1000));
}

export { format, avoidNotNumerics, wait };
