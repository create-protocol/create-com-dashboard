import React, { useState, useEffect } from "react";

const Prompt = () => {
  const [prompt, setPrompt] = useState("");
  const [selectedModel, setSelectedModel] = useState();
  const [models, setModels] = useState([
    "MISTRALAI/MISTRAL-7B-INSTRUCT-V0.1",
    "MISTRALAI/MISTRAL-7B-INSTRUCT-V0.2",
    "MISTRALAI/MIXTRAL-8X22B-INSTRUCT-V0.1",
    "MISTRALAI/MIXTRAL-8X7B-INSTRUCT-V0.1",
    "TOGETHERCOMPUTER/LLAMA-2-7B-32K-INSTRUCT",
    "TOGETHERCOMPUTER/REDPAJAMA-INCITE-7B-CHAT",
    "TOGETHERCOMPUTER/REDPAJAMA-INCITE-CHAT-3B-V1",
  ]); // Array to hold available models
  const [response, setResponse] = useState(null); // State for API response
  const [loading, setLoading] = useState(false);

  // Fetch available fine-tuning models on component mount
  //   useEffect(() => {
  //     const fetchModels = async () => {
  //       try {
  //         const response = await fetch("http://localhost:3000/inference", {
  //           method: "POST",
  //         }); // Replace with your API endpoint
  //         const data = await response.json();
  //         setModels(data.models); // Update state with available models
  //       } catch (error) {
  //         console.error("Error fetching models:", error);
  //       }
  //     };
  //     fetchModels();
  //   }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!prompt || !selectedModel) {
      alert("Please enter a prompt and select a fine-tuning model.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("http://localhost:3000/inference", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, model: selectedModel }),
        // body: JSON.stringify({
        //   prompt: "Suggest some fun winter family activities",
        //   model: "mistralai/Mixtral-8x7B-Instruct-v0.1",
        // }),
      });

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const data = await response.json();
      //   console.log(data.result.output.choices[0].text);
      setResponse(data.result.output.choices[0].text);
    } catch (error) {
      console.error("Error calling fine-tuning API:", error);
      setResponse("An error occurred. Please try again later.");
    }
    setLoading(false);
  };

  return (
    <div>
      <h1>Fine-Tuning Form</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="prompt">Prompt:</label>
        <textarea
          id="prompt"
          value={prompt}
          onChange={(event) => setPrompt(event.target.value)}
          rows="5"
          placeholder="Enter your prompt here"
        />

        <label htmlFor="model">Fine-Tuning Model:</label>
        <select
          id="model"
          value={selectedModel}
          onChange={(event) => setSelectedModel(event.target.value)}
        >
          <option value="">Select a Model</option>
          {models.map((model) => (
            <option key={model} value={model}>
              {model}
            </option>
          ))}
        </select>

        <button type="submit">Submit</button>
      </form>

      <div className="response-container">
        <h2>Response</h2>
        <p>{loading ? "Loading..." : response}</p>
      </div>
    </div>
  );
};

export default Prompt;
