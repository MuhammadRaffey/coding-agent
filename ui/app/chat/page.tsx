"use client";
import React, { useState, useEffect } from "react";
import Header from "@/app/components/header";
import { useCopilotChat } from "@copilotkit/react-core";
import { TextMessage } from "@copilotkit/runtime-client-gql";
import ChatInterface from "../components/chatInterface";
import TerminalInterface from "../components/terminal";

export default function Chat() {
  const { isLoading, appendMessage, visibleMessages } = useCopilotChat();
  const [terminalCode, setTerminalCode] = useState("");
  const [codeLang, setCodeLang] = useState("shell"); // Default language

  // Extract and update code when messages change
  useEffect(() => {
    if (visibleMessages && visibleMessages.length > 0) {
      const lastTextMessage = visibleMessages[
        visibleMessages.length - 1
      ] as TextMessage;

      if (!lastTextMessage?.content) return;

      // Updated regex to capture language identifier
      const codeRegex = /```(\w+)?\n([\s\S]*?)```/;
      const codeMatch = codeRegex.exec(lastTextMessage.content);

      if (codeMatch) {
        const [_, lang, code] = codeMatch;
        const extractedCode = code.trim();
        setTerminalCode(extractedCode);
        setCodeLang(lang?.toLowerCase() || "shell");
        console.log("Updated terminal code:", extractedCode); // Debug log
        console.log("Language of code:", lang); // Debug log
      }
    }
  }, [visibleMessages]);
  return (
    <div className="h-screen overflow-hidden">
      <Header />
      <main className="flex w-full gap-5 bg-gray-50 h-[calc(100vh-64px)] p-4">
        <div className="w-1/3 bg-slate-400 rounded-xl overflow-hidden mb-2">
          <TerminalInterface code={terminalCode} lang={codeLang} />
        </div>
        <div className="max-w-5xl w-2/3 mx-auto h-full">
          <ChatInterface
            isLoading={isLoading}
            appendMessage={appendMessage}
            visibleMessages={visibleMessages as TextMessage[]}
          />
        </div>
      </main>
    </div>
  );
}
