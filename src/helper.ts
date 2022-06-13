/**
 * Evita que un input pueda recibir caracteres no numericos
 * Esta funcion puede ser insertada en un Event Listener de tipo keydown
 */
function avoidNotNumerics(event: any, decimals = false){
	if(event.key === 'Backspace')
		return;

	if(event.key === ' ')
		return event.preventDefault();
		
	if(!decimals && event.key === '.')
		return event.preventDefault();
		
	const hasPoint = event.target.value.includes('.');
	const have2Decimals = hasPoint && event.target.value.split('.').pop().length === 2;
	if(have2Decimals)
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
	phone: (phone: string) =>
		phone
			? `(${phone.substr(0, 3)}) ${phone.substr(3, 3)}-${phone.substr(
					6,
					4
			  )}`
			: 'N/A',
	cash: (amount: number, decimals = 0) =>
		Intl.NumberFormat('en-IN', { minimumFractionDigits: decimals, maximumFractionDigits: decimals }).format(
			amount
		)
};

async function wait(time: number) {
	return new Promise(resolve => setTimeout(resolve, time * 1000));
}

export { format, avoidNotNumerics, wait };
