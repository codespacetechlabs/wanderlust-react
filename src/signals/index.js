import { signal } from "@preact/signals-react";
import { createThread, openai } from "../utils";
import { tools } from "../constants";

export function createAppState() {
    const thread = signal();
    const createNewThread = async () => {
        let newThread = await createThread();
        thread.value = newThread;
    }
    const initThread = async (userQuery) => {
        loading.value = true;
        await openai.beta.threads.messages.create(thread.value.id, {
            content: userQuery,
            role: "user",
        });
        let res = await openai.beta.threads.runs.create(thread.value.id, {
            tools: tools,
            model: "gpt-4-1106-preview",
            assistant_id: import.meta.env.VITE_REACT_APP_OPENAI_ASSISTANT_ID,
        });
        if (runId.value != res.id) {
            runId.value = res.id;
            mapMarkers.value = [];
        }
        return res;
    }

    return {
        thread,
        createNewThread,
        initThread,
    };
}

export const loading = signal(false);

export const latitude = signal(37.7749);
export const longitude = signal(-122.4194);
export const zoom = signal(13);

export const mapMarkers = signal([]);

export const runId = signal(null);

export const chatHistory = signal([]);