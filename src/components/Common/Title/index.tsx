import { Container } from './styles';

export interface TitleProps {
	children: React.ReactNode;
}

export function Title({ children }: TitleProps) {
	return <Container>{children}</Container>;
}
