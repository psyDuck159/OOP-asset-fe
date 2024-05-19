import { CloseCircleOutlined, CloseSquareOutlined, EditOutlined } from "@ant-design/icons";
import { Button, Input, message, Modal, Select, Table } from "antd";
import { snakeCase } from "lodash";
import React from "react";
import { useNavigate } from "react-router-dom";
import { COMPONENT_PATHS } from "../../constants/componentPath";
import { CONFIG } from "../../constants/config";
import { PATHS } from "../../constants/paths";
import { ASSET_STATES } from "../../constants/states";
import { getAllAssets } from "../../services/asset.service";
import { getAllCategories } from "../../services/category.service";
import AssetDetails from "./components/AssetDetails";
import Title from "../../common/components/Title";
import "./index.css";

let counter = 0;
let selectedSortKey = "";
let selectedAssetData = {};

const Asset = () => {
	const navigate = useNavigate();
	const [tableLoading, setTableLoading] = React.useState(false);
	const [assetList, setAssetList] = React.useState([]);
	const [categoryList, setCategoryList] = React.useState([]);
	const [keyword, setKeyword] = React.useState("");
	const [assetCategory, setAssetCategory] = React.useState("");
	const [assetState, setAssetState] = React.useState("");
	const [pageable, setPageable] = React.useState({
		page: 0,
		size: 10
	});
	const [pagination, setPagination] = React.useState({
		totalPages: 0,
		totalItems: 0
	});
	const [sortOptions, setSortOptions] = React.useState("");
	const [isShowAssetDetails, setIsShowAssetDetails] = React.useState(false);

	React.useEffect(() => {
		fetchAssetList({
			keyword: keyword === "" ? null : keyword,
			category: assetCategory === "" ? null : assetCategory,
			state: assetState === "" ? null : assetState,
			page: pageable.page,
			size: pageable.size,
			sort: sortOptions === "" || sortOptions === null ? null : sortOptions
		});
	}, [keyword, assetCategory, assetState, pageable, sortOptions]);

	const fetchAssetList = async param => {
		setTableLoading(true);
		await getAllAssets(param)
			.then(res => {
				const newAsset = JSON.parse(localStorage.getItem(CONFIG.NEW_ASSET));
				let content = res.data?.data?.contents;

				if (newAsset) {
					setAssetList([newAsset, ...content.filter(asset => asset.assetCode !== newAsset.assetCode)]);

					localStorage.removeItem(CONFIG.NEW_ASSET);
				} else {
					setAssetList(content);
				}
				setPagination({
					...pagination,
					totalItems: res.data?.data?.totalItems,
					totalPages: res.data?.data?.totalPages
				});
				setTableLoading(false);
			})
			.catch(err => {
				setTableLoading(false);
				message.error(err);
			});
	};

	React.useEffect(() => {
		fetchCategoryList();
	}, []);

	const fetchCategoryList = async () => {
		setTableLoading(true);
		await getAllCategories()
			.then(res => {
				setCategoryList(res.data.data);
				setAssetCategory(categoryList.map(category => category.prefix).join(","));
				setTableLoading(false);
			})
			.catch(err => {
				setTableLoading(false);
				message.error(err);
			});
	};

	const columns = [
		{
			title: "Asset Code",
			dataIndex: "assetCode",
			width: "10%",
			sorter: true,
			onHeaderCell: column => {
				return {
					onClick: () => handleChangeSortKey(column)
				};
			},
			key: "assetCode"
		},
		{
			title: "Asset Name",
			key: "name",
			dataIndex: "name",
			sorter: true,
			onHeaderCell: column => {
				return {
					onClick: () => handleChangeSortKey(column)
				};
			},
			width: "30%"
		},
		{
			title: "Category",
			width: "15%",
			dataIndex: "category",
			key: "category",
			render: category => category.category,
			sorter: true,
			onHeaderCell: column => {
				return {
					onClick: () => handleChangeSortKey(column)
				};
			}
		},
		{
			title: "State",
			dataIndex: "state",
			sorter: true,
			onHeaderCell: column => {
				return {
					onClick: () => handleChangeSortKey(column)
				};
			},
			width: "10%",
			key: "state"
		},
		{
			title: "",
			width: "15%",
			key: "action",
			render: item => (
				<div>
					<Button style={{ border: "none", borderRadius: "10px" }}>
						<EditOutlined />
					</Button>
					<Button style={{ border: "none", borderRadius: "10px", color: "red" }}>
						<CloseCircleOutlined />
					</Button>
				</div>
			)
		}
	];

	const handleChangeSortKey = sortKey => {
		if (selectedSortKey === sortKey.key) {
			counter++;
		} else {
			selectedSortKey = sortKey.key;
			counter = 1;
		}
		let sortingKey;
		switch (counter % 3) {
			case 1:
				sortingKey = selectedSortKey === "category" ? "category_id" : snakeCase(selectedSortKey);
				setSortOptions(sortingKey + ",asc");
				break;
			case 2:
				sortingKey = selectedSortKey === "category" ? "category_id" : snakeCase(selectedSortKey);
				setSortOptions(sortingKey + ",desc");
				break;
			case 0:
				setSortOptions(null);
				break;
			default:
				console.log("null default");
		}
	};

	const handleClickOnRow = value => {
		selectedAssetData = value;
		setIsShowAssetDetails(true);
	};

	const handleCloseAssetDetailsModal = () => {
		setIsShowAssetDetails(false);
	};

	const handleChangeCategoryFilter = e => {
		if (e.length === 0) {
			setAssetCategory(categoryList.map(category => category.prefix).join(","));
		} else {
			setAssetCategory(e.join(","));
		}
		setPageable({ ...pageable, page: 0 });
	};

	const handleChangeStateFilter = e => {
		if (e.length === 0) {
			setAssetState([ASSET_STATES.AVAILABLE, ASSET_STATES.NOT_AVAILABLE, ASSET_STATES.ASSIGNED].join(","));
		} else {
			setAssetState(e.join(","));
		}
		setPageable({ ...pageable, page: 0 });
	};

	const handleChangeSearchBar = e => {
		setKeyword(e.trim());
		setPageable({ ...pageable, page: 0 });
	};

	const handleChangePage = pageNumb => {
		setPageable({ ...pageable, page: pageNumb - 1 });
	};

	const navToCreateAssetPage = () => {
		navigate(PATHS.ASSET + COMPONENT_PATHS.CREATE_ASSET);
	};

	return (
		<React.Fragment>
			<div className="asset-container">
				<div className="asset-title">
					<Title content={"Asset List"} />
				</div>
				<div className="asset-function-bar">
					<div style={{ width: "20%" }}>
						<Select
							placeholder="State"
							mode="multiple"
							maxTagCount={1}
							maxTagTextLength={8}
							allowClear={true}
							style={{ width: "100%" }}
							onChange={handleChangeStateFilter}
							options={[
								{
									value: ASSET_STATES.AVAILABLE,
									label: ASSET_STATES.AVAILABLE
								},
								{
									value: ASSET_STATES.NOT_AVAILABLE,
									label: ASSET_STATES.NOT_AVAILABLE
								},
								{
									value: ASSET_STATES.ASSIGNED,
									label: ASSET_STATES.ASSIGNED
								},
								{
									value: ASSET_STATES.WAITING_FOR_RECYCLING,
									label: ASSET_STATES.WAITING_FOR_RECYCLING
								},
								{
									value: ASSET_STATES.RECYCLED,
									label: ASSET_STATES.RECYCLED
								}
							]}
						/>
					</div>
					<div style={{ width: "20%" }}>
						<Select
							placeholder="Category"
							mode="multiple"
							maxTagCount={1}
							maxTagTextLength={8}
							allowClear={true}
							style={{ width: "100%" }}
							onChange={handleChangeCategoryFilter}
							options={[
								...categoryList.map(category => {
									return { value: category.prefix, label: category.category };
								})
							]}
						/>
					</div>
					<Input.Search onSearch={handleChangeSearchBar} style={{ width: "30%" }} />
					<Button type="primary" danger onClick={navToCreateAssetPage}>
						Create New Asset
					</Button>
				</div>
				<div className="asset-table">
					<Table
						columns={columns}
						dataSource={assetList}
						rowKey={obj => obj.assetCode}
						pagination={{
							current: pageable.page === 0 ? 1 : pageable.page + 1,
							total: pagination.totalItems,
							onChange: handleChangePage,
							position: "bottomRight",
							showSizeChanger: false
						}}
						onRow={record => {
							return {
								onClick: () => handleClickOnRow(record)
							};
						}}
						loading={tableLoading}
					/>
				</div>
			</div>
			<Modal
				title={<Title content={"Detailed Asset Information"} />}
				closeIcon={
					<div style={{ color: "red" }}>
						<CloseSquareOutlined />
					</div>
				}
				open={isShowAssetDetails}
				footer={false}
				onCancel={handleCloseAssetDetailsModal}
				destroyOnClose
			>
				<AssetDetails assetCode={selectedAssetData.assetCode} />
			</Modal>
		</React.Fragment>
	);
};

export default Asset;
