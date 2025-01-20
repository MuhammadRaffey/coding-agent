"use client";

import React, { useState, useEffect, useRef } from "react";
import { Fira_Code } from "next/font/google";
import { Copy, Check } from "lucide-react";
import { Button } from "./ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { Badge } from "./ui/badge";

const firaCode = Fira_Code({ subsets: ["latin"] });

interface TerminalProps {
  code: string;
  lang: string;
}

export default function TerminalInterface({ code, lang }: TerminalProps) {
  const [text, setText] = useState(code || "// No Code to display.");
  const [cursorVisible, setCursorVisible] = useState(true);
  const [fontSize, setFontSize] = useState(18);
  const [copied, setCopied] = useState(false);
  const terminalRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setText(""); // Clear current text
    let i = 0;
    const newText = code || "// No Code to display.";

    const typingInterval = setInterval(() => {
      if (i < newText.length) {
        setText(newText.slice(0, i + 1));
        i++;
      } else {
        clearInterval(typingInterval);
      }
    }, 50);

    const cursorInterval = setInterval(() => {
      setCursorVisible((v) => !v);
    }, 500);

    return () => {
      clearInterval(typingInterval);
      clearInterval(cursorInterval);
    };
  }, [code]);

  useEffect(() => {
    const adjustFontSize = () => {
      if (terminalRef.current && contentRef.current) {
        const container = terminalRef.current;
        const content = contentRef.current;

        let size = fontSize;
        content.style.fontSize = `${size}px`;

        while (content.scrollHeight > container.clientHeight && size > 10) {
          size--;
          content.style.fontSize = `${size}px`;
        }

        setFontSize(size);
      }
    };

    adjustFontSize();
  }, [text, fontSize]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="flex items-center justify-center p-4 h-full">
      <div className="w-full max-w-2xl">
        <div className="bg-gray-900 rounded-lg shadow-2xl overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2 bg-gray-800">
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
            </div>
            <div className="flex items-center space-x-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Badge variant="secondary" className="text-xs">
                      {lang || "Shell"}
                    </Badge>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Language: {lang || "Shell"}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={copyToClipboard}
                      className="text-stone-100 hover:text-black hover:bg-slate-100"
                    >
                      {copied ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{copied ? "Copied!" : "Copy to clipboard"}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
          <div
            ref={terminalRef}
            className="p-4 text-green-400 overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:rounded-full"
            style={{ height: "300px" }}
          >
            <div
              ref={contentRef}
              className={`${firaCode.className} whitespace-pre-wrap`}
              style={{ fontSize: `${fontSize}px` }}
            >
              {text}
              {cursorVisible && <span className="animate-pulse">▋</span>}
            </div>
          </div>
        </div>
      </div>
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI1IiBoZWlnaHQ9IjUiPgo8cmVjdCB3aWR0aD0iNSIgaGVpZ2h0PSI1IiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMSI+PC9yZWN0Pgo8L3N2Zz4=')] opacity-20 pointer-events-none"></div>
    </div>
  );
}
