import Form from "./Form";
import PropTypes from "prop-types";
import ReactMarkdown from "react-markdown";
import { loading } from "../signals";
import { useEffect } from "react";
import { RiMap2Fill } from "react-icons/ri";
import { FaMapMarkerAlt } from "react-icons/fa";
import { LuCompass } from "react-icons/lu";

const Chat = ({ submitData, messages }) => {
  // TODO: Scroll to bottom of chat on new message
  useEffect(() => {
    const lastMessage = document.querySelector(".messages:last-child");
    const messagesContainer = document.querySelector(".messages-container");
    if (lastMessage) {
      messagesContainer.scrollTop = lastMessage.offsetTop - 100;
    }
  }, [messages]);
  return (
    <div
      className={`w-full lg:w-1/2 min-h-1/2 h-1/2 lg:h-3/4 flex flex-col lg:pb-2 lg:pl-10 justify-center gap-5`}
    >
      <div
        className={`${
          messages.length > 0 &&
          "flex-1 max-h-1/2 h-auto overflow-y-auto messages-container"
        }`}
      >
        {messages.map((message, index) => (
          <div key={index} className="flex ">
            {message.role !== "user" && renderLogo[message.role]}
            <ReactMarkdown className={`messages ${message.role} text-sm`}>
              {message.content[0].text.value}
            </ReactMarkdown>
          </div>
        ))}
      </div>
      <Form submitData={submitData} />
      {loading.value && (
        <div
          id="loader"
          className="bg-[rgba(2,132,199,0.5)] h-[4px] relative rounded-full"
        ></div>
      )}
    </div>
  );
};

export default Chat;

Chat.propTypes = {
  submitData: PropTypes.func.isRequired,
  messages: PropTypes.array,
};

const renderLogo = {
  assistant: (
    <LuCompass className="text-lg text-gray-600 min-w-fit w-max px-2 mt-3" />
  ),
  marker: <FaMapMarkerAlt className="text-lg text-gray-600 w-max mt-3 px-2" />,
  map: <RiMap2Fill className="text-lg text-gray-600 w-max mt-3 px-2" />,
};
