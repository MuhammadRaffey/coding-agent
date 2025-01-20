import { NextRequest } from "next/server";
import {
  CopilotRuntime,
  copilotRuntimeNextJSAppRouterEndpoint,
  GroqAdapter,
} from "@copilotkit/runtime";
import { Groq } from "groq-sdk";

const groq = new Groq({ apiKey: process.env["GROQ_API_KEY"] });

const serviceAdapter = new GroqAdapter({
  groq,
  model: "llama-3.3-70b-versatile",
});

const runtime = new CopilotRuntime({
  remoteEndpoints: [
    {
      url: process.env.REMOTE_ACTION_URL || "http://localhost:8000/copilotkit",
    },
  ],
});

export const POST = async (req: NextRequest) => {
  const { handleRequest } = copilotRuntimeNextJSAppRouterEndpoint({
    runtime,
    serviceAdapter,
    endpoint: "/api/copilotkit",
  });

  return handleRequest(req);
};
