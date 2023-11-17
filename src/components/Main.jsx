import { useState } from "react";
import Chat from "./Chat";
import Map from "./Map";
import { openai, thread } from "../App";

const tools = [
  {
    type: "function",
    function: {
      name: "update_map",
      description: "Update map to center on a particular location",
      parameters: {
        type: "object",
        properties: {
          longitude: {
            type: "number",
            description: "Longitude of the location to center the map on",
          },
          latitude: {
            type: "number",
            description: "Latitude of the location to center the map on",
          },
          zoom: {
            type: "integer",
            description: "Zoom level of the map",
          },
        },
        required: ["longitude", "latitude", "zoom"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "add_marker",
      description: "Add marker to the map",
      parameters: {
        type: "object",
        properties: {
          longitude: {
            type: "number",
            description: "Longitude of the location to the marker",
          },
          latitude: {
            type: "number",
            description: "Latitude of the location to the marker",
          },
          label: {
            type: "string",
            description: "Text to display on the marker",
          },
        },
        required: ["longitude", "latitude", "label"],
      },
    },
  },
];

const update_map = (longitude, latitude, zoom) => {
  console.log("update_map");
  console.log(longitude, latitude, zoom);
  return "Map updated";
};

const add_marker = (longitude, latitude, label) => {
  console.log("add_marker");
  console.log(longitude, latitude, label);
  return "Marker added";
};

const functions = {
  update_map: update_map,
  add_marker: add_marker,
};

const Main = () => {
  const [messages, setMessages] = useState([]);

  function assistantToolCall(toolCall) {
    // actually executes the tool call the OpenAI assistant wants to perform
    const functionName = toolCall.function.name;
    const args = JSON.parse(toolCall.function.arguments);
    const returnValue = functions[functionName](args);

    const toolOutputs = {
      tool_call_id: toolCall.id,
      output: returnValue,
    };

    return toolOutputs;
  }

  const submitData = async (data) => {
    console.log(data);
    let newMessage = await openai.beta.threads.messages.create(thread.id, {
      content: data.inputQuery,
      role: "user",
    });
    console.log(newMessage);
    let res = await openai.beta.threads.runs.create(thread.id, {
      tools: tools,
      model: "gpt-4-1106-preview",
      assistant_id: import.meta.env.VITE_REACT_APP_OPENAI_ASSISTANT_ID,
    });
    console.log(res.id);
    let completed = false;
    while (!completed) {
      let response = await openai.beta.threads.runs.retrieve(thread.id, res.id);
      if (response.status === "in_progress") {
        continue;
      }
      console.log(response);
      if (response.status === "requires_action") {
        const tool_outputs = [];
        for (
          let i = 0;
          i < response.required_action.submit_tool_outputs.tool_calls.length;
          i++
        ) {
          const tool =
            response.required_action.submit_tool_outputs.tool_calls[i];
          const toolOutput = assistantToolCall(tool);
          tool_outputs.push(toolOutput);
        }
        console.log(tool_outputs);
        newMessage = await openai.beta.threads.runs.submitToolOutputs(
          thread.id,
          res.id,
          {
            tool_outputs,
          }
        );
      }
      if (response.status === "completed") {
        completed = true;
        newMessage = await (
          await openai.beta.threads.messages.list(thread.id)
        ).data;
        console.log(newMessage);
        setMessages([...messages, newMessage]);
      }
    }
    // setMessages([...messages, newMessage]);
  };

  return (
    <main className="h-screen w-screen flex flex-col justify-stretch items-center">
      <h1 className="text-5xl text-center">Wanderlust</h1>
      <section className="h-full w-full flex flex-col-reverse items-center gap-5 p-10 lg:flex-row lg:px-10">
        <Chat submitData={submitData} messages={messages} />
        <Map />
      </section>
    </main>
  );
};
export default Main;
