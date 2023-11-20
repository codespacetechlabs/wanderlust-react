import OpenAI from "openai";
import { tools } from "../constants";
import { chatHistory, latitude, longitude, mapMarkers, zoom } from "../signals";

export const update_map = ({ longitude: lg, latitude: lt, zoom: z }) => {
    longitude.value = lg;
    latitude.value = lt;
    zoom.value = z;
    chatHistory.value = [...chatHistory.value, {
        content: [{ text: { value: "Map Updated" } }],
        role: "map",
    }];
    return "Map updated";
};

export const add_marker = ({ longitude, latitude, label }) => {
    mapMarkers.value = [...mapMarkers.value, {
        longitude: longitude,
        latitude: latitude,
        label: label,
    }];
    chatHistory.value = [...chatHistory.value, {
        content: [{ text: { value: "Marker Added" } }],
        role: "marker",
    }];
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
    await openai.beta.threads.messages.create(thread.id, {
        content: userQuery,
        role: "user",
    });
    await openai.beta.threads.runs.create(thread.id, {
        tools: tools,
        model: "gpt-4-1106-preview",
        assistant_id: import.meta.env.VITE_REACT_APP_OPENAI_ASSISTANT_ID,
    });
}

export function assistantToolCall(toolCall) {
    const functionName = toolCall.function.name;

    if (!toolCall.function.arguments) return;

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
            newMessage = await openai.beta.threads.runs.submitToolOutputs(
                thread.id,
                res.id,
                {
                    tool_outputs,
                }
            );
        }
        if (response.status === "completed") {
            newMessage = await (
                await openai.beta.threads.messages.list(thread.id)
            ).data;
            completed = true;
            return newMessage;
        }
    }
}