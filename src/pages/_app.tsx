import type { AppProps } from 'next/app';
import { ConfigProvider } from 'antd';
import { GlobalStyle, Container, Content } from '../styles/global';
import { UserStorage } from '../contexts/UserContext';

export default function App({ Component, pageProps }: AppProps) {
	return (
		<>
			<UserStorage>
				<GlobalStyle />
				<ConfigProvider
					theme={{
						token: {
							colorPrimary: '#00b96b',
						},
					}}
				>
					<Container>
						<Content>
							<Component {...pageProps} />
						</Content>
					</Container>
				</ConfigProvider>
			</UserStorage>
		</>
	);
}
