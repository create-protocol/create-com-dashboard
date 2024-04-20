import React, { useState } from 'react';
import Select from 'react-dropdown-select';

const Prompt = () => {
  const [selectedModel, setSelectedModel] = useState([]);

  // Custom item renderer to simulate optgroup behavior
  const customItemRenderer = ({ item, itemIndex, props, state, methods }) => {
    const isGroupStart = itemIndex === 0 || item.group !== state.options[itemIndex - 1].group;
    return (
      <div onClick={() => methods.addItem(item)} style={{ cursor: 'pointer' }}>
        {isGroupStart && (
          <div style={{ fontWeight: 'bold', fontSize: '14px', color: '#333' }}>{item.group}</div>
        )}
        <div>{item.label}</div>
      </div>
    );
  };

  return (
    <div>
      <Select
        options={models}
        onChange={(values) => setSelectedModel(values)}
        labelField="label"
        valueField="value"
        itemRenderer={customItemRenderer}
        values={selectedModel}
        multi={false}
        searchable={true}
        dropdownHandle={true} // Show the dropdown handle icon
      />
    </div>
  );
};

export default Prompt;
