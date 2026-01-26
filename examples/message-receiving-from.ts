import type { MessageResponse } from "../types";
import { createSDK, handleExit } from "./utils";

function formatMessage(msg: MessageResponse): string {
    const sender = msg.isFromMe ? "Me" : msg.handle?.address || "Unknown";
    const time = new Date(msg.dateCreated).toLocaleTimeString();
    const text = msg.text?.slice(0, 30) || "(no text)";
    const via = msg.receivingFrom || "?";
    return `[${time}] ${sender}: "${text}" (via: ${via})`;
}

async function main() {
    const sdk = createSDK();

    sdk.on("ready", async () => {
        const messages = await sdk.messages.getMessages({ limit: 10, sort: "DESC" });
        console.log("Recent messages:");
        for (const msg of messages) {
            console.log(formatMessage(msg));
        }

        console.log("\nListening...\n");
    });

    sdk.on("new-message", (msg) => console.log(formatMessage(msg)));
    sdk.on("error", (err) => console.error(err.message));

    await sdk.connect();
    handleExit(sdk);
}

main().catch(console.error);
