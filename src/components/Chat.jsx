import { useEffect } from "react";
import Form from "./Form";
import PropTypes from "prop-types";
import ReactMarkdown from "react-markdown";
import { loading } from "../signals";

const Chat = ({ submitData, messages }) => {
  useEffect(() => {
    const chatBox = document.querySelector(".messages:last-child");
    if (chatBox) {
      chatBox.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);
  return (
    <div
      className={`w-full lg:w-1/2 min-h-1/2 h-1/2 lg:h-3/4 flex flex-col lg:pb-2 lg:pl-10 justify-center gap-5`}
    >
      <div
        className={`${
          messages.length > 0 &&
          "flex-1 max-h-1/2 lg:max-h-full overflow-y-auto"
        }`}
      >
        {messages.reverse().map((message, index) => (
          <ReactMarkdown className="messages" key={index}>
            {message.content[0].text.value}
          </ReactMarkdown>
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
