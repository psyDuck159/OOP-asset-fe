import { Button, Card, Input, Space, Table } from "antd";
import React, { useEffect, useState } from "react";
import Title from "../../../../common/components/Title";
import { ASSET_STATES } from "../../../../constants/states";
import { getAllAssets } from "../../../../services/asset.service";

const columns = [
	{
		title: "Asset Code",
		dataIndex: "assetCode",
		sorter: (a, b) => a.assetCode.localeCompare(b.assetCode),
		key: "assetCode"
	},
	{
		title: "Asset Name",
		dataIndex: "name",
		ellipsis: true,
		sorter: (a, b) => a.name.localeCompare(b.name),
		key: "name"
	},
	{
		title: "Category",
		dataIndex: "category",
		sorter: (a, b) => a.category.category.localeCompare(b.category.category),
		key: "category",
		render: item => <div>{item.category}</div>
	}
];

let selectedAsset = "";

const rowSelection = {
	onChange: selectedRowKeys => {
		selectedAsset = selectedRowKeys[0];
	}
};

const SearchAssetDropdown = props => {
	const [assetList, setAssetList] = useState([]);
	const [keyword, setKeyword] = useState(null);
	const [isLoading, setIsLoading] = useState(false);
	const { onCancel, setValue } = props;

	useEffect(() => {
		fetchAssetList({
			page: 0,
			size: 1000,
			keyword: keyword
		});
	}, [keyword]);

	const fetchAssetList = async params => {
		setIsLoading(true);
		await getAllAssets(params)
			.then(res => {
				setAssetList(res.data.data.contents);
				setIsLoading(false);
			})
			.catch(err => {
				console.log(err);
				setIsLoading(false);
			});
	};

	const handleChangeSearch = value => {
		setKeyword(value.trim());
	};

	const handleSave = () => {
		setValue(selectedAsset);
	};

	const handleCancel = () => {
		onCancel();
	};

	return (
		<React.Fragment>
			<Card title={<Title content={"Select Asset"} />} extra={<Input.Search onSearch={handleChangeSearch} />}>
				<Table
					dataSource={assetList.filter(item => item.state === ASSET_STATES.AVAILABLE)}
					columns={columns}
					rowKey={obj => obj.assetCode}
					pagination={false}
					loading={isLoading}
					scroll={{
						y: 500
					}}
					rowSelection={{
						type: "radio",
						...rowSelection
					}}
				/>
				<div
					className="button-wrapper"
					style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", marginTop: "20px" }}
				>
					<Space>
						<Button style={{ width: 100, borderRadius: "6px" }} danger type="primary" onClick={handleSave}>
							Save
						</Button>
						<Button style={{ width: 100, borderRadius: "6px" }} onClick={handleCancel}>
							Cancel
						</Button>
					</Space>
				</div>
			</Card>
		</React.Fragment>
	);
};

export default SearchAssetDropdown;
