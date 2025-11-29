import path from "node:path";
import type { AttachmentResponse } from "../types";
import { createSDK, handleError } from "./utils";

const CHAT_GUID = process.env.CHAT_GUID || "any;-;+16504444652";
const STICKER_PATH = process.env.STICKER_PATH || path.join(__dirname, "test-image.jpg");

async function main() {
    const sdk = createSDK();

    sdk.on("ready", async () => {
        try {
            // Send a text message first
            const textMessage = await sdk.messages.sendMessage({
                chatGuid: CHAT_GUID,
                message: "Here comes a sticker!",
            });
            console.log(`sent: ${textMessage.guid}`);

            await new Promise((resolve) => setTimeout(resolve, 2000));

            // Send sticker as a reply
            const stickerMessage = await sdk.attachments.sendSticker({
                chatGuid: CHAT_GUID,
                filePath: STICKER_PATH,
                selectedMessageGuid: textMessage.guid,
            });

            console.log(`sticker sent: ${stickerMessage.guid}`);
            console.log(`attachments: ${stickerMessage.attachments?.length || 0}`);
            if (stickerMessage.attachments?.[0]) {
                const attachment = stickerMessage.attachments[0] as AttachmentResponse;
                console.log(`type: ${attachment.mimeType || "unknown"}`);
            }
        } catch (error) {
            handleError(error, "Failed to send sticker");
        }

        await sdk.close();
        process.exit(0);
    });

    await sdk.connect();
}

main().catch(console.error);
