/* eslint-disable react/prop-types */
import Chat from "./Chat";
import Map from "./Map";
import { generateResponse } from "../utils";
import { chatHistory, loading } from "../signals";

const Main = ({ initiatedThread }) => {
  const submitData = async (data) => {
    chatHistory.value.push({
      content: [{ text: { value: data.inputQuery } }],
      role: "user",
    });
    loading.value = true;
    let res = await initiatedThread.initThread(data.inputQuery);

    const newMessage = await generateResponse(
      initiatedThread.thread.value,
      res
    );
    loading.value = false;
    console.log(
      newMessage.filter((message) => message.role === "assistant")[0]
    );
    chatHistory.value.push(
      newMessage.filter((message) => message.role === "assistant")[0]
    );
  };

  return (
    <main className="h-screen w-screen flex flex-col justify-stretch items-center py-10">
      <h1 className="text-5xl text-center">Wanderlust</h1>
      <section className="h-full w-full flex flex-col-reverse items-center gap-5 p-10 lg:flex-row lg:px-10">
        <Chat submitData={submitData} messages={chatHistory.value} />
        <Map />
      </section>
    </main>
  );
};
export default Main;
