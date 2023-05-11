import { useContext } from 'react';
import { UserContext } from '../../contexts/UserContext';
import { Container } from './styles';
import { Button, message, Upload } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

import utils from './../../utils';
import Link from 'next/link';
import Image from 'next/image';

export function Header() {
	const { xmlData, setXmlData, setWorldmapsTable } = useContext(UserContext);

	const props = {
		name: 'file',
		multiple: false,
		maxCount: 1,
		showUploadList: false,

		onChange(info) {
			if (info.file.status !== 'uploading') {
				console.log(info.file.originFileObj, info.fileList);
			}
			if (info.file.status === 'done') {
				message.success(
					`${info.file.name} file uploaded successfully really`
				);
				utils.ConfigXmlData(
					info.file.originFileObj,
					xmlData,
					setXmlData,
					setWorldmapsTable
				);
			} else if (info.file.status === 'error') {
				message.success(`${info.file.name} file uploaded successfully`);
				utils.ConfigXmlData(
					info.file.originFileObj,
					xmlData,
					setXmlData,
					setWorldmapsTable
				);
			}
		},
	};

	return (
		<Container>
			<Link href='/'>
				<Image
					src='/images/logoSiemens.png'
					className='App-logo'
					alt='logo'
					width='107'
					height='87'
				/>
			</Link>

			<div className='fileInput'>
				<p className='FileName'>EDITOR DE WORLDMAPS</p>
			</div>

			<Upload {...props}>
				<Button icon={<UploadOutlined />}>Click para Upload</Button>
			</Upload>
		</Container>
	);
}
