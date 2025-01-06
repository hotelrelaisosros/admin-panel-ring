import React, { useEffect, useState } from "react";
import { useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { CustomizationMiddleware } from '../../store/customize/customizationMiddleware';

import {
  Form,
  Steps,
  Card,
  Typography,
  Col,
  Row,
  Checkbox,
  Radio,
} from "antd";
import { ToastContainer, toast } from "react-toastify";


const { Step } = Steps;
const { Title, Text } = Typography;


const MultiStepCRUDForm = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const CollectData = location?.state?.state || [];
  const [data, setData] = useState({});

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
  
  
  
  const [currentStep, setCurrentStep] = useState(0);


  const [selections, setSelections] = useState({
    colors: [],
    shapes: "",
    metals: '',
    widths: [],
    gemstones: [],
    settingsHeight: [],
    prongStyle: [],
    ringSize: [],
    bespokeCustomizations: [],
    birthstones: [],
  });

  useEffect(() => {
    if (CollectData.length > 0) {
      setSelections(CollectData);
    }
  }, [CollectData]);

 
    
  useEffect(() => {
    
    setSelections({
      ...selections,
      shapes: CollectData?.product_customizations?.gem_shape_id ? 
        Number(CollectData?.product_customizations?.gem_shape_id) : 
        null,
      colors: CollectData?.product_customizations?.default_metal_id ? 
        Number(CollectData?.product_customizations?.default_metal_id) : 
        null,
      widths:
        CollectData?.product_customizations?.band_width_ids && 
        CollectData?.product_customizations?.band_width_ids !== "[]" ?
        CollectData?.product_customizations?.band_width_ids
          .replace("[", "")
          .replace("]", "")
          .split(",")
          .map(Number) : [],
      settingsHeight:
        CollectData?.product_customizations?.setting_height_ids && 
        CollectData?.product_customizations?.setting_height_ids !== "[]" ?
        CollectData?.product_customizations?.setting_height_ids
          .replace("[", "")
          .replace("]", "")
          .split(",")
          .map(Number) : [],
      ringSize:
        CollectData?.product_customizations?.ring_size_ids && 
        CollectData?.product_customizations?.ring_size_ids !== "[]" ?
        CollectData?.product_customizations?.ring_size_ids
          .replace("[", "")
          .replace("]", "")
          .split(",")
          .map(Number) : [],
      prongStyle:
        CollectData?.product_customizations?.prong_style_ids && 
        CollectData?.product_customizations?.prong_style_ids !== "[]" ?
        CollectData?.product_customizations?.prong_style_ids
          .replace("[", "")
          .replace("]", "")
          .split(",")
          .map(Number) : [],
      birthstones:
        CollectData?.product_customizations?.birth_stone_ids && 
        CollectData?.product_customizations?.birth_stone_ids !== "[]" ?
        CollectData?.product_customizations?.birth_stone_ids
          .replace("[", "")
          .replace("]", "")
          .split(",")
          .map(Number) : [],
      gemstones:
        CollectData?.product_customizations?.accent_stone_type_ids && 
        CollectData?.product_customizations?.accent_stone_type_ids !== "[]" ?
        CollectData?.product_customizations?.accent_stone_type_ids
          .replace("[", "")
          .replace("]", "")
          .split(",")
          .map(Number) : [],
      bespokeCustomizations:
        CollectData?.product_customizations?.bespoke_customization_ids && 
        CollectData?.product_customizations?.bespoke_customization_ids !== "[]" ?
        CollectData?.product_customizations?.bespoke_customization_ids
          .replace("[", "")
          .replace("]", "")
          .split(",")
          .map(Number) : [],
      metalTypes:
          CollectData?.product_customizations?.metal_types && 
        CollectData?.product_customizations?.metal_types !== "[]" ?
        CollectData?.product_customizations?.metal_types
          .replace("[", "")
          .replace("]", "")
          .split(",")
          .map(Number) : [],
    });

  }, [CollectData]);


  const steps = [
    {
      title: "Customize Setting",
      fields: ["widths", "settingsHeight", "ringSize", "prongStyle"],
    },
    {
      title: "Bespoke Customisations",
      fields: ["bespokeCustomizations", "birthstones"],
    },
    { title: "GemStones", fields: ["gemstones"] },
  ];

  const handleSelectionChange = (field, values) => {
    const fieldMap = {
      shapes: 'shapes',
      colors: 'colors',
      widths: 'widths',
      settingsHeight: 'settingsHeight',
      prongStyle: 'prongStyle',
      ringSize: 'ringSize',
      bespokeCustomizations: 'bespokeCustomizations',
      birthstones: 'birthstones',
      gemstones: 'gemstones'
    };

    setSelections((prev) => ({
      ...prev,
      [fieldMap[field] || field]: values,
    }));
  };

 

  const renderList = (field) => (
    <div className="flex flex-wrap gap-4" style={{ minWidth: "300px" }}>
      {data[field]?.map((item, index) => {
        if (field === "colors" || field === "shapes") {
          return (
            <Radio
              key={index}
              style={{
                minWidth: "100px",
                marginBottom: "10px",
                marginLeft: "0",
              }}
              checked={selections[field] === item.id}
              onChange={(e) => {
                handleSelectionChange(field, item.id);
              }}
            >
              {item.name}
            </Radio>
          );
        }
        
        else if (field === "bespokeCustomizations") {
          return (
            <div key={index}>
              <Checkbox
                style={{
                  minWidth: "100px",
                  marginBottom: "10px",
                  marginLeft: "0",
                }}
                checked={Array.isArray(selections[field]) ? 
                  selections[field]?.includes(item.id) : 
                  selections[field] === item.id}
                onChange={(e) => {
                  // Fix: Use the current field instead of always using gemstones
                  const newSelections = e.target.checked
                    ? [...(selections[field] || []), item.id]
                    : selections[field].filter((i) => i !== item.id);
                  handleSelectionChange(field, newSelections);
                }}
              >
                {item.name}
              </Checkbox>
            
             
            </div>
          );
        }
      
       else if (field === "gemstones") {
          return (
            <Checkbox
              key={index}
              style={{
                minWidth: "100px",
                marginBottom: "10px",
                marginLeft: "0",
              }}
              checked={Array.isArray(selections[field]) ? 
                selections[field]?.includes(item.id) : 
                selections[field] === item.id}
              onChange={(e) => {
                // Fix: Use the current field instead of always using gemstones
                const newSelections = e.target.checked
                  ? [...(selections[field] || []), item.id]
                  : selections[field].filter((i) => i !== item.id);
                handleSelectionChange(field, newSelections);
              }}
            >
              Type: {item.type}
              <br />
              Carat: {item.carat}
              <br />
              Color: {item.color}
              <br />
              Shape: {item.shape}
              <br />
              Price: {item.price}
              <br />
              Clarity: {item.clarity}
              <br />
              Dimension: {item.dimension}
              <br />
              Faceting: {item.faceting}
            </Checkbox>
          );
        }

        else {

          
          return (
            <Checkbox
              key={index}
              style={{
                minWidth: "100px",
                marginBottom: "10px",
                marginLeft: "0",
              }}
              checked={Array.isArray(selections[field]) ? 
                selections[field]?.includes(item.id) : 
                selections[field] === item.id}
              onChange={(e) => {
                // Handle case where selections[field] is undefined or not an array
                const currentSelections = Array.isArray(selections[field]) ? selections[field] : [];
                const newSelections = e.target.checked
                  ? [...currentSelections, item.id]
                  : currentSelections.filter((i) => i !== item.id);
                handleSelectionChange(field, newSelections);
              }}
            >
              {item.name }
            </Checkbox>
          );
        } 
        
      })}
     </div>
  );

  const nextStep = () => {
    setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  return (
    <div className="">
      <Card
        className="ant-card criclebox tablespace mb-24 p-2 mx-auto"
        bodyStyle={{ padding: "16px" }}
      >
        <Steps current={currentStep} className="mb-8">
          {steps.map((item) => (
            <Step key={item.title} title={item.title} />
          ))}
        </Steps>
        <div
          className="mt-8 mb-4 flex flex-wrap"
          style={{ marginBottom: "20px", marginTop: "16px" }}
        >
          {steps[currentStep].fields.map((field, index) => (
            <Card
              key={field}
              className="mb-8 ant-card criclebox tablespace p-4"
              style={{ marginBottom: "16px" }}
            >
              <Row className="column" justify="space-between" align="middle">
                <Col>
                  <Title level={3} className="mb-4">
                    {field.charAt(0).toUpperCase() + field.slice(1)}
                  </Title>
                </Col>
              </Row>
              <div className="flex flex-wrap">
                {renderList(field)}
              </div>
            </Card>
          ))}
          <div
            className="mt-8"
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "space-between",
              marginLeft: "0",
            }}
          >
            {currentStep > 0 && (
              <button
                className="btn btn-outline-primary px-3"
                type="button"
                onClick={prevStep}
              >
                Previous
              </button>
            )}
            {currentStep < steps.length - 1 && (
              <button
                className="btn btn-primary px-3"
                type="button"
                onClick={nextStep}
              >
                Next
              </button>
            )}
            {currentStep === steps.length - 1 && (
              <button
                className="btn btn-primary px-3"
                type="button"
                onClick={async () => {



                  const newSelections = {
                    product_id: CollectData.id,
                    ring_size_ids: selections.ringSize,
                    bespoke_customization_ids: selections.bespokeCustomizations,
                    birth_stone_ids: selections.birthstones,
                    accent_stone_type_ids: selections.gemstones,
                    band_width_ids: selections.widths,
                    setting_height_ids: selections.settingsHeight,
                    prong_style_ids: selections.prongStyle,
                    metal_types: selections.metalTypes,
                    gem_shape_id: selections.shapes,
                    default_metal_id: selections.colors,
                   
                  };
                  console.log(newSelections);
                  try {
                    const res = await dispatch(CustomizationMiddleware.createCustomization(newSelections));
                    console.log(res);
                    if (res.success) {
                      toast.success(res.message || "Customization saved successfully");
                    } else {
                      toast.error(res.message || "Failed to save customization");
                    }
                  } catch (error) {
                    toast.error(error?.message || 'Something went wrong');
                  }

                }}
              >
                Submit
              </button>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default MultiStepCRUDForm;
