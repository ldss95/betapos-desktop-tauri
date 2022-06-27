interface RenderIfProps {
	condition: boolean;
	children: React.ReactElement;
}
function RenderIf({ condition, children }: RenderIfProps){
	if (condition) {
		return children;
	}

	return <></>;
}

export default RenderIf