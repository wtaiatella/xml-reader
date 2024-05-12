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
	//siemens - 1024x538
	//xml - 512x512

	return (
		<Container>
			<Link href='/'>
				<Image
					src='/images/xml-file.png'
					className='App-logo'
					alt='logo'
					width='107'
					height='107'
				/>
			</Link>

			<div className='fileInput'>
				<p className='FileName'>EDITOR DE XML</p>
			</div>

			<Upload {...props}>
				<Button type='primary' icon={<UploadOutlined />}>
					Click para Upload
				</Button>
			</Upload>
		</Container>
	);
}
