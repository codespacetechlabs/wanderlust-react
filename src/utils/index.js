import OpenAI from "openai";
import { tools } from "../constants";
import { latitude, longitude, zoom } from "../signals";

export const update_map = (lg, lt, z) => {
    console.log("update_map");
    console.log(lg, lt, z);
    longitude.value = lg;
    latitude.value = lt;
    zoom.value = z;
    console.log("[][][][]", longitude.value, latitude.value, zoom.value);
    return "Map updated";
};

export const add_marker = (longitude, latitude, label) => {
    console.log("add_marker");
    console.log(longitude, latitude, label);
    return "Marker added";
};

export const functions = {
    update_map: update_map,
    add_marker: add_marker,
};

export const openai = new OpenAI({
    apiKey: import.meta.env.VITE_REACT_APP_OPENAI_API_KEY,
    dangerouslyAllowBrowser: true,
});

export const createThread = () => {
    return new Promise((resolve, reject) => {
        openai.beta.threads.create()
            .then((thread) => {
                resolve(thread);
            }).catch((err) => {
                reject(err);
            });
    });
};

export const initThread = async (thread, userQuery) => {
    console.log(thread);
    let newMessage = await openai.beta.threads.messages.create(thread.id, {
        content: userQuery,
        role: "user",
    });
    console.log(newMessage);
    let res = await openai.beta.threads.runs.create(thread.id, {
        tools: tools,
        model: "gpt-4-1106-preview",
        assistant_id: import.meta.env.VITE_REACT_APP_OPENAI_ASSISTANT_ID,
    });
    console.log(res.id);
}

export function assistantToolCall(toolCall) {
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

export const generateResponse = async (thread, res) => {
    let completed = false;
    let newMessage;
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
            return newMessage;
        }
    }
}