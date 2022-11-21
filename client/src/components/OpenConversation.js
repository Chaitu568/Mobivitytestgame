import React, { useState, useCallback, useContext, useEffect } from "react";
import { Form, InputGroup, Button } from "react-bootstrap";
import AuthContext from "../context/auth";

function OpenConversation(props) {
  const [text, setText] = useState("");
  const [messages, setMessages] = useState([]);
  const authCtx = useContext(AuthContext);
  const setRef = useCallback((node) => {
    if (node) {
      node.scrollIntoView({ smooth: true });
    }
  }, []);

  useEffect(() => {
    authCtx.socket.on("recieve-message", (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });
    return () => {
      authCtx.socket.off("recieve-messsage");
    };
  }, [authCtx.socket]);

  function handleSubmit(e) {
    e.preventDefault();

    const message = { text, fromMe: true, senderName: authCtx.userName };

    if (
      !props.isYou &&
      text.toLowerCase() === props.selectedWord.toLowerCase()
    ) {
      // props.increaseScore();
      setText("");
      if (props.scored.includes(authCtx.id)) {
        return;
      }
      authCtx.socket.emit("increase-score", authCtx.id, props.groupId);
      return;
    }

    setMessages((prevMessages) => [...prevMessages, message]);

    authCtx.socket.emit("send-message", props.groupId, {
      ...message,
      fromMe: false,
    });

    setText("");
  }

  return (
    <div
      className="d-flex flex-column flex-grow-1"
      style={{ maxHeight: "800px" }}
    >
      <div className="flex-grow-1 overflow-auto">
        <div className="d-flex flex-column align-items-start justify-content-end px-3">
          {messages.map((message, index) => {
            const lastMessage = messages.length - 1 === index;
            return (
              <div
                ref={lastMessage ? setRef : null}
                key={index}
                className={`my-1 d-flex flex-column ${
                  message.fromMe
                    ? "align-self-end align-items-end"
                    : "align-items-start"
                }`}
              >
                <div
                  className={`rounded px-2 py-1 ${
                    message.fromMe ? "bg-primary text-white" : "border"
                  }`}
                >
                  {message.text}
                </div>
                <div
                  className={`text-muted small ${
                    message.fromMe ? "text-right" : ""
                  }`}
                >
                  {message.fromMe ? "You" : message.senderName}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="m-2">
          <InputGroup>
            <Form.Control
              as="textarea"
              required
              value={text}
              onChange={(e) => setText(e.target.value)}
              style={{ height: "75px", resize: "none" }}
            />
            <InputGroup.Append>
              <Button type="submit">Send</Button>
            </InputGroup.Append>
          </InputGroup>
        </Form.Group>
      </Form>
    </div>
  );
}

export default OpenConversation;
