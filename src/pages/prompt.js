"use client"; // This is a client component 👈🏽


import React, { useState } from "react";
import "../app/prompt.css";
import logo from "../../public/Group 165.svg"
import chatIcon from "../../public/chat.png";
import Image from "next/image";
import Select from 'react-dropdown-select';
import Model from "../customcomponents/Model"

const Prompt = () => {
  const [prompt, setPrompt] = useState("");
  const [tokenUsage, setTokenUsage] = useState(0);
  const [outputLength, setOutputLength] = useState(300);
  const [responseTime, setResponseTime] = useState(0);
  const [selectedModel, setSelectedModel] = useState([]);

  const models = [
    {
      label: "Meta Models",
      options: [
        { label: "META-LLAMA/LLAMA-2-13B-CHAT-HF", value: "META-LLAMA/LLAMA-2-13B-CHAT-HF" },
        { label: "META-LLAMA/LLAMA-2-70B-CHAT-HF", value: "META-LLAMA/LLAMA-2-70B-CHAT-HF" },
        { label: "META-LLAMA/LLAMA-2-7B-CHAT-HF", value: "META-LLAMA/LLAMA-2-7B-CHAT-HF" },
        { label: "META-LLAMA/LLAMA-3-70B-CHAT-HF", value: "META-LLAMA/LLAMA-3-70B-CHAT-HF" },
        { label: "META-LLAMA/LLAMA-3-8B-CHAT-HF", value: "META-LLAMA/LLAMA-3-8B-CHAT-HF" },
      ]
    },
    {
      label: "Mistral Models",
      options: [
        { label: "MISTRALAI/MISTRAL-7B-INSTRUCT-V0.1", value: "MISTRALAI/MISTRAL-7B-INSTRUCT-V0.1" },
        { label: "MISTRALAI/MISTRAL-7B-INSTRUCT-V0.2", value: "MISTRALAI/MISTRAL-7B-INSTRUCT-V0.2" },
        { label: "MISTRALAI/MIXTRAL-8X22B-INSTRUCT-V0.1", value: "MISTRALAI/MIXTRAL-8X22B-INSTRUCT-V0.1" },
        { label: "MISTRALAI/MIXTRAL-8X7B-INSTRUCT-V0.1", value: "MISTRALAI/MIXTRAL-8X7B-INSTRUCT-V0.1" },
      ]
    },
    {
      label: "NousResearch Models",
      options: [
        { label: "NOUSRESEARCH/NOUS-CAPYBARA-7B-V1P9", value: "NOUSRESEARCH/NOUS-CAPYBARA-7B-V1P9" },
        { label: "NOUSRESEARCH/NOUS-HERMES-2-MISTRAL-7B-DPO", value: "NOUSRESEARCH/NOUS-HERMES-2-MISTRAL-7B-DPO" },
        { label: "NOUSRESEARCH/NOUS-HERMES-2-MIXTRAL-8X7B-DPO", value: "NOUSRESEARCH/NOUS-HERMES-2-MIXTRAL-8X7B-DPO" },
      ]
    }
  ];
  
  


  const groupedOptions = models.flatMap(group => [
    { label: group.label, value: group.label, isGroupLabel: true },
    ...group.options
  ]);


  const handleModelChange = (selectedItems) => {
    const filteredItems = selectedItems.filter(item => !item.isGroupLabel);
    setSelectedModel(filteredItems);
  };


  const customItemRenderer = ({ item, methods }) => {
    if (item.isGroupLabel) {
      // Render a non-selectable group label
      return (
        <div style={{ fontWeight: 'bold', color: '#888', padding: '10px 20px' }}>
          {item.label}
        </div>
      );
    } else {
      // Render a selectable option
      return (
        <div
          onClick={() => methods.addItem(item)}
          style={{ cursor: 'pointer', padding: '10px 20px' }}
        >
          {item.label}
        </div>
      );
    }
  };



  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);


  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!prompt || !selectedModel) {
      alert("Please enter a prompt and select a fine-tuning model.");
      return;
    }
    const startTime = Date.now();
    setLoading(true);
    try {
      console.log(selectedModel[0].value)
      const response = await fetch("https://fine-tuning-backend-t76cvz6sta-el.a.run.app/inference", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, model: selectedModel[0].value }),
      });

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const data = await response.json();
      console.log(data.result.output.choices[0].text)
      setResponse(data.result.output.choices[0].text);
      setTokenUsage(data.result.usage.total_tokens);
      const endTime = Date.now(); // Capture end time
      const durationInSeconds = (endTime - startTime) / 1000;
      setResponseTime(durationInSeconds.toFixed(2));
    } catch (error) {
      console.error("Error calling fine-tuning API:", error);
      setResponse("An error occurred. Please try again later.");
    }
    setLoading(false);
  };


  const [showModal, setShowModal] = useState(false);

  // Update your playgroundOptions to remove the disabled property since you'll manage the alert with modal
  const playgroundOptions = [
    { label: "CHAT", value: "CHAT" },
    { label: "IMAGE", value: "IMAGE" }
  ];
  const [selectedOption, setSelectedOption] = useState([{ label: "CHAT", value: "CHAT" }]);


  const handleSelectionChange = (values) => {
    // Handle the change. You might want to display a modal for the "Image" option
    if (values[0] && values[0].value === 'IMAGE') {
      setShowModal(true);
    } else {
      setSelectedOption(values);
    }
  };
  const handleSliderChange = (event) => {
    setOutputLength(event.target.value);
  };



  // Function to truncate the response
  const truncateResponse = (response, maxLength) => {
    return response && response.length > maxLength
      ? response.substring(0, maxLength) + "..."
      : response;
  };

  return (
    <>
      <header className="header">
        <div className="logo-and-dropdown-container">
          <div className="logo-container">
            <Image src={logo} alt="Logo" width={100} height={80} />
            <span className="create-protocol">Create Protocol</span>
          </div>
          <div className="dropdown-container">
            <Select
              options={playgroundOptions}
              onChange={handleSelectionChange}
              values={selectedOption}
              labelField="label"
              valueField="value"
              searchable={false}
              dropdownHandle={true}
            />

          </div>

        </div>
      </header>
      <Model
        isOpen={showModal}
        message="Feature Coming Soon!"
        onClose={() => setShowModal(false)}
      />

      <div className="main-container">
        <div className="left-container">
          <div className="header-container">
            <Image src={chatIcon} alt="Chat Icon" width={24} height={24} />

            <h1 style={{ fontSize: "14px" }}>CHAT</h1>
            {selectedModel && (
              <div className="model-display">{selectedModel.length > 0 ? selectedModel[0].value : 'No model selected'}</div>

            )}
          </div>
          <h1>Ask Anything</h1>
          <form onSubmit={handleSubmit}>
            <textarea
              id="prompt"
              value={prompt}
              onChange={(event) => setPrompt(event.target.value)}
              rows="5"
              placeholder="e.g Suggest some fun activities"
            />
            <button
              type="submit"
              style={{
                background: loading ? "grey" : "black",
                color: "white"
              }}
              disabled={loading}
            >
              Get your answer
            </button>
            <div className="response-container">
              <p>{loading ? "Loading..." : truncateResponse(response, outputLength)}</p>
              {!loading && tokenUsage > 0 && (
                <p className="token-usage">
                  {tokenUsage} TOKENS | {(tokenUsage / responseTime).toFixed(2)} TOKENS/S
                </p>
              )}
            </div>
          </form>
        </div>
        <div className="right-container">
          <label htmlFor="model">Fine-Tuning Model:</label>
          <Select
            options={groupedOptions}
            onChange={handleModelChange}
            values={selectedModel}
            itemRenderer={customItemRenderer}
            labelField="label"
            valueField="value"
            dropdownHandle={true}
            searchable={true}
          />

          <div style={{ display: "flex", justifyContent: "space-between", marginTop: "20px" }}>
            <label htmlFor="output-length">Output Length:</label>
            <div style={{ display: "flex", alignItems: "center" }}>
              <p className="outputlen">{outputLength}</p>
            </div>

          </div>
          <input
            type="range"
            id="output-length"
            min="0"
            max="1000" // Max characters you want to allow
            value={outputLength}
            onChange={handleSliderChange}
          />


        </div>
      </div>
    </>

  );
};

export default Prompt;
