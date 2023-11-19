/* eslint-disable react/prop-types */
import { useState } from "react";
import Chat from "./Chat";
import Map from "./Map";
import { generateResponse } from "../utils";

const Main = ({ initiatedThread }) => {
  const [messages, setMessages] = useState([]);

  const submitData = async (data) => {
    console.log(data);
    console.log(initiatedThread.thread.value);
    console.log(initiatedThread);
    let res = await initiatedThread.initThread(data.inputQuery);

    const newMessage = await generateResponse(
      initiatedThread.thread.value,
      res
    );
    console.log(newMessage);
    setMessages(newMessage);
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
