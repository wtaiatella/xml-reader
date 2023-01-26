import { useContext } from 'react';
import { UserContext } from '../../contexts/UserContext';
import { Container } from './styles';
import { Button, message, Upload } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

import utils from './../../utils';

export function Header() {
	const { setXmlData } = useContext(UserContext);

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
				message.success(`${info.file.name} file uploaded successfully`);
			} else if (info.file.status === 'error') {
				message.success(`${info.file.name} file uploaded successfully`);
				utils.ConfigXmlData(info.file.originFileObj, setXmlData);
			}
		},
	};

	return (
		<Container>
			<a href='/'>
				<img src='./logoSiemens.png' className='App-logo' alt='logo' />
			</a>

			<div className='fileInput'>
				<p className='FileName'>EDITOR DE WORLDMAPS</p>
			</div>

			<Upload {...props}>
				<Button icon={<UploadOutlined />}>Click to Upload</Button>
			</Upload>
		</Container>
	);
}
