import {
  Button,
  Modal,
  Table,
  Tag,
  Card,
  Row,
  Col,
  Descriptions,
  Typography,
  Image,
} from "antd";

import apiService from "./apiService";
import { useEffect, useState } from "react";
import { ShoppingOutlined, EditOutlined } from "@ant-design/icons";
import { useLocation, useHistory } from "react-router-dom";
import { base_Url } from "../../constants/Apibase";
import { useSelector, useDispatch } from "react-redux";
import { CustomizationMiddleware } from "../../store/customize/customizationMiddleware";

const { Title } = Typography;

const ProductProfile = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const CollectData = location?.state || [];
  const [data, setData] = useState({});

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [customizationData, setCustomizationData] = useState(null);
  const product = CollectData || {}; // Adjust according to your data
  const images = product.image || [];
  const {
    gemShapes,
    gemStoneColors,
    birthStones,
    gemStones,
    prongStyles,
    ringSizes,
    bandWidths,
    settingHeights,
    bespokeCustomizations,
    bespokeWithTypes,
    accentStoneTypes,
  } = useSelector((state) => state.customization);

  useEffect(() => {
    dispatch(CustomizationMiddleware.fetchAllCustomizationData());
  }, [dispatch]);

  useEffect(() => {
    setData({
      shapes: gemShapes,
      colors: gemStoneColors,
      widths: bandWidths,
      settingsHeight: settingHeights,
      ringSize: ringSizes,
      prongStyle: prongStyles,
      birthstones: birthStones,
      gemstones: gemStones,
      accentStoneTypes: accentStoneTypes,
      bespokeCustomizations: bespokeCustomizations,
      bespokeWithTypes: bespokeWithTypes,
    });
  }, [
    gemShapes,
    gemStoneColors,
    bandWidths,
    settingHeights,
    ringSizes,
    prongStyles,
    birthStones,
    gemStones,
    accentStoneTypes,
    bespokeCustomizations,
    bespokeWithTypes,
  ]);

  const [items, setItems] = useState({
    shapesUserSelected: [],
    colorsUserSelected: [],
    widthsUserSelected: [],
    settingsHeightUserSelected: [],
    ringSizeUserSelected: [],
    metalsUserSelected: [],
    prongStyleUserSelected: [],
    bespokeCustomisations: [],
    birthstonesUserSelected: [],
    gemstonesUserSelected: [],
    bespokeCustomisationsUserSelected: [],
    metalTypesUserSelected: [],
  });

  useEffect(() => {
    console.log("CollectData", CollectData);
    console.log("data", data);
  }, [data]);

  useEffect(() => {
    setItems({
      ...items,
      shapesUserSelected: CollectData?.product_customizations?.gem_shape_id
        ? Number(CollectData?.product_customizations?.gem_shape_id)
        : null,
      metalsUserSelected: CollectData?.product_customizations?.default_metal_id
        ? Number(CollectData?.product_customizations?.default_metal_id)
        : null,
      widthsUserSelected:
        CollectData?.product_customizations?.band_width_ids &&
        CollectData?.product_customizations?.band_width_ids !== "[]"
          ? CollectData?.product_customizations?.band_width_ids
              .replace("[", "")
              .replace("]", "")
              .split(",")
              .map(Number)
          : [],
      settingsHeightUserSelected:
        CollectData?.product_customizations?.setting_height_ids &&
        CollectData?.product_customizations?.setting_height_ids !== "[]"
          ? CollectData?.product_customizations?.setting_height_ids
              .replace("[", "")
              .replace("]", "")
              .split(",")
              .map(Number)
          : [],
      ringSizeUserSelected:
        CollectData?.product_customizations?.ring_size_ids &&
        CollectData?.product_customizations?.ring_size_ids !== "[]"
          ? CollectData?.product_customizations?.ring_size_ids
              .replace("[", "")
              .replace("]", "")
              .split(",")
              .map(Number)
          : [],
      prongStyleUserSelected:
        CollectData?.product_customizations?.prong_style_ids &&
        CollectData?.product_customizations?.prong_style_ids !== "[]"
          ? CollectData?.product_customizations?.prong_style_ids
              .replace("[", "")
              .replace("]", "")
              .split(",")
              .map(Number)
          : [],
      birthstonesUserSelected:
        CollectData?.product_customizations?.birth_stone_ids &&
        CollectData?.product_customizations?.birth_stone_ids !== "[]"
          ? CollectData?.product_customizations?.birth_stone_ids
              .replace("[", "")
              .replace("]", "")
              .split(",")
              .map(Number)
          : [],
      gemstonesUserSelected:
        CollectData?.product_customizations?.accent_stone_type_ids &&
        CollectData?.product_customizations?.accent_stone_type_ids !== "[]"
          ? CollectData?.product_customizations?.accent_stone_type_ids
              .replace("[", "")
              .replace("]", "")
              .split(",")
              .map(Number)
          : [],
      bespokeCustomisationsUserSelected:
        CollectData?.product_customizations?.bespoke_customization_ids &&
        CollectData?.product_customizations?.bespoke_customization_ids !== "[]"
          ? CollectData?.product_customizations?.bespoke_customization_ids
              .replace("[", "")
              .replace("]", "")
              .split(",")
              .map(Number)
          : [],
      metalTypesUserSelected:
        CollectData?.product_customizations?.metal_types &&
        CollectData?.product_customizations?.metal_types !== "[]"
          ? CollectData?.product_customizations?.metal_types
              .replace("[", "")
              .replace("]", "")
              .split(",")
              .map(Number)
          : [],
    });

    console.log("items", items);
  }, []);

  // Extract main and additional images
  const mainImage = images[0]?.image || "";
  const additionalImages = (() => {
    const collection = images[0]?.image_collection;
    try {
      return collection ? JSON.parse(collection) : [];
    } catch (error) {
      console.error("Error parsing image_collection:", error);
      return [];
    }
  })();

  console.log(additionalImages);
  const columns = [
    { title: "Product id", dataIndex: "id", key: "id" },
    { title: "Title", dataIndex: "title", key: "title" },
    { title: "stock", dataIndex: "stock", key: "stock" },
    { title: "Price", dataIndex: "price", key: "price" },
    { title: "Size", dataIndex: "size", key: "size" },

    {
      title: "Actions",
      key: "actions",
      render: (text, record) => {
        if (!record.customizables) return null;

        const hasCustomizations =
          Object.keys(record.customizables).length > 0 &&
          Object.values(record.customizables).some((value) => value !== null);

        return hasCustomizations ? (
          <Button
            icon={<EditOutlined />}
            onClick={() => handleCustomizationModal(record.customizables)}
          >
            Customize
          </Button>
        ) : null;
      },
    },
  ];

  const handleCustomizationModal = (customizables) => {
    setCustomizationData(customizables);
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setCustomizationData(null);
  };

  return (
    <div className="p-6">
      <div className="d-flex justify-content-between align-items-center">
        <Title level={2}>
          <ShoppingOutlined className="mr-2" />
          Product Profile
        </Title>
      </div>

      <Row gutter={[16, 16]}>
        {/* Main Image */}
        <Col span={24} md={12}>
          <Card title="Main Image" className="mb-4">
            {mainImage ? (
              <Image src={mainImage} alt="Main Product" width={200} />
            ) : (
              <p>No Main Image Available</p>
            )}
          </Card>
        </Col>
        <Col span={24} md={12}>
          <Card title="Category Information" className="mb-4">
            <Descriptions column={1}>
              <Descriptions.Item label="Sub Category">
                {CollectData?.sub_category?.name}
              </Descriptions.Item>
              <Descriptions.Item label="Main Category">
                {CollectData?.sub_category?.categories?.name}
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>

        {/* Additional Images */}
        {/* <Col span={24} md={12}>
          <Card title="Additional Images" className='mb-4'>
            {additionalImages.length > 0 ? (
              <Row gutter={[8, 8]}>
                {additionalImages.map((img, index) => (
                  <Col key={index} span={6}>
                    <Image
                      src={`${base_Url}/${img}`} // Replace with your base path
                      alt={`Additional Image ${index + 1}`}
                      width={100}
                      height={100}
                      style={{ objectFit: 'cover' }}
                    />
                  </Col>
                ))}
              </Row>
            ) : (
              <p>No Additional Images Available</p>
            )}
          </Card>
        </Col> */}
      </Row>
      <Row gutter={[16, 16]}></Row>

      {CollectData?.variation?.length > 0 && (
        <Card title="Product Variations" className="mb-4">
          <Table
            columns={columns}
            dataSource={CollectData?.variation.map((item) => ({
              ...item,
              key: item?.id,
            }))}
            pagination={false}
          />
        </Card>
      )}

      {CollectData?.sub_category.id === 1 && (
        <Card title="Customization Options" className="customization-card">
          {Object.entries(items).map(([key, value]) => (
            <div key={key} style={{ marginBottom: "10px" }}>
              {key === "widthsUserSelected" &&
                value &&
                (() => {
                  return (
                    <>
                      <strong>Widths:</strong>{" "}
                      {value?.map((item, index) => {
                        const width = data?.widths?.find(
                          (bw) => bw.id === item
                        );
                        return (
                          <span key={index}>
                            {width?.name}
                            {index < value.length - 1 && width?.name
                              ? ", "
                              : ""}
                          </span>
                        );
                      })}
                    </>
                  );
                })()}
              {key === "prongStyleUserSelected" &&
                value &&
                (() => {
                  return (
                    <>
                      <strong>Prong Style:</strong>{" "}
                      {value?.map((item, index) => {
                        const prongStyle = data?.prongStyle?.find(
                          (pt) => pt.id === item
                        );
                        return (
                          <span key={index}>
                            {prongStyle?.name}
                            {prongStyle?.name && index < value.length - 1
                              ? ", "
                              : ""}
                          </span>
                        );
                      })}
                    </>
                  );
                })()}
              {key === "ringSizeUserSelected" &&
                value &&
                (() => {
                  return (
                    <>
                      <strong>Ring Size:</strong>{" "}
                      {value?.map((item, index) => (
                        <span key={index}>
                          {data?.ringSize?.find((rs) => rs.id === item)?.name}
                          {data?.ringSize?.find((rs) => rs.id === item)?.name &&
                          index < value.length - 1
                            ? ", "
                            : ""}
                        </span>
                      ))}
                    </>
                  );
                })()}
              {key === "settingsHeightUserSelected" &&
                value &&
                (() => {
                  return (
                    <>
                      <strong>Setting Height:</strong>{" "}
                      {value?.map((item, index) => (
                        <span key={index}>
                          {
                            data?.settingsHeight?.find((sh) => sh.id === item)
                              ?.name
                          }
                          {data?.settingsHeight?.find((sh) => sh.id === item)
                            ?.name && index < value.length - 1
                            ? ", "
                            : ""}
                        </span>
                      ))}
                    </>
                  );
                })()}
              {key === "bespokeCustomisationsUserSelected" &&
                value &&
                (() => {
                  return (
                    <>
                      <strong>Bespoke Customizations:</strong>{" "}
                      {value?.map((item, index) => (
                        <span key={index}>
                          {
                            data?.bespokeCustomizations?.find(
                              (bc) => bc.id === item
                            )?.name
                          }
                          {data?.bespokeCustomizations?.find(
                            (bc) => bc.id === item
                          )?.name && index < value.length - 1
                            ? ", "
                            : ""}
                        </span>
                      ))}
                    </>
                  );
                })()}
              {/* {key === "metalTypesUserSelected" && value && (() => {
            return (
              <>
                <strong>Metal Type:</strong>{" "}
                {value?.map((item, index) => (
                  <span key={index}>
                    {data?.colors?.find(mt => mt.id === item)?.name}
                    {data?.colors?.find(mt => mt.id === item)?.name && index < value.length - 1 ? ", " : ""}
                  </span>
                ))}
              </>
            );
          })()} */}
              {key === "metalsUserSelected" &&
                value &&
                (() => {
                  return (
                    <>
                      <strong>Metals:</strong>{" "}
                      <span>
                        {data?.colors?.find((m) => m.id === value)?.name}
                      </span>
                    </>
                  );
                })()}
              {key === "birthstonesUserSelected" &&
                value &&
                (() => {
                  return (
                    <>
                      <strong>Birthstones:</strong>{" "}
                      {value?.map((item, index) => (
                        <span key={index}>
                          {
                            data?.birthstones?.find((bs) => bs.id === item)
                              ?.name
                          }
                          {data?.birthstones?.find((bs) => bs.id === item)
                            ?.name && index < value.length - 1
                            ? ", "
                            : ""}
                        </span>
                      ))}
                    </>
                  );
                })()}
              {key === "shapesUserSelected" &&
                value &&
                (() => {
                  const shape = data?.shapes?.find(
                    (shape) => shape?.id == value
                  );
                  return (
                    <>
                      <strong>Shapes:</strong> <span>{shape?.name}</span>
                    </>
                  );
                })()}
            </div>
          ))}
        </Card>
      )}
    </div>
  );
};

export default ProductProfile;
