import { createSDK, handleError } from "./utils";

const CHAT_GUID = process.env.CHAT_GUID || "any;-;+1234567890";

async function main() {
    const sdk = createSDK();

    sdk.on("ready", async () => {
        console.log("Message reply example...\n");

        try {
            console.log("Sending original message...");
            const originalMessage = await sdk.messages.sendMessage({
                chatGuid: CHAT_GUID,
                message: "What's your favorite color?",
            });

            console.log(`✓ Original message sent! GUID: ${originalMessage.guid}`);
            console.log(`Text: "${originalMessage.text}"\n`);

            await new Promise((resolve) => setTimeout(resolve, 2000));

            console.log("Sending reply to the original message...");
            const replyMessage = await sdk.messages.sendMessage({
                chatGuid: CHAT_GUID,
                message: "My favorite color is blue! 💙",
                selectedMessageGuid: originalMessage.guid,
            });

            console.log("\n✓ Reply sent successfully!");
            console.log(`Reply message GUID: ${replyMessage.guid}`);
            console.log(`Reply text: "${replyMessage.text}"`);
            console.log(`Replying to: ${originalMessage.guid.substring(0, 20)}...`);
        } catch (error) {
            handleError(error, "Failed to send reply");
        }

        await sdk.disconnect();
        process.exit(0);
    });

    await sdk.connect();
}

main().catch(console.error);
