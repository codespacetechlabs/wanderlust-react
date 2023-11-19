import { signal } from "@preact/signals-react";
import { createThread, openai } from "../utils";
import { tools } from "../constants";

export function createAppState() {
    const thread = signal();
    const createNewThread = async () => {
        loading.value = true;
        let newThread = await createThread();
        thread.value = newThread;
        loading.value = false;
    }
    const initThread = async (userQuery) => {
        console.log(thread);
        let newMessage = await openai.beta.threads.messages.create(thread.value.id, {
            content: userQuery,
            role: "user",
        });
        console.log(newMessage);
        let res = await openai.beta.threads.runs.create(thread.value.id, {
            tools: tools,
            model: "gpt-4-1106-preview",
            assistant_id: import.meta.env.VITE_REACT_APP_OPENAI_ASSISTANT_ID,
        });
        console.log(res.id);
        return res;
    }

    return {
        thread,
        createNewThread,
        initThread,
    };
}

export const loading = signal(false);

export const latitude = signal(23.0498928);

export const longitude = signal(72.5330175);

export const zoom = signal(13);

export const mapMarkers = signal([]);