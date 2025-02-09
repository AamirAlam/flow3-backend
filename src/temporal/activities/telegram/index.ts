import axios from "axios";
import { ActivityArgs } from "../../../types";

const TELEGRAM_API = `https://api.telegram.org/bot${process.env.TELEGRAM_TOKEN}`;

async function fetchUserId(username: string) {
  try {
    let response = await axios.get(`${TELEGRAM_API}/getUpdates`);

    let userId = null;
    if (response.data.ok) {
      let filterdObj = response.data.result?.filter(
        (el: any) => el.message.from.username === username
      );

      userId = filterdObj?.length > 0 ? filterdObj?.[0].message.from.id : null;
    } else {
      console.log("faild to fetch chats ");
    }

    return userId;
  } catch (error) {
    throw new Error("Error fetching telegram user id");
    return null;
  }
}

async function sendNotification(userId: string, message: string) {
  try {
    // get latest chats info

    if (!userId) {
      console.log("invalid user id ");
      return;
    }

    await axios.post(
      `${TELEGRAM_API}/sendMessage?chat_id=${userId}&text=${message}`
    );

    console.log("message sent");
  } catch (error) {
    console.log("sendNotification failed ", error);
    throw new Error("Error sending telegram notification");
  }
}

// Send telegram notification
export async function executeTelegramNotification(args: ActivityArgs) {
  try {
    const { config } = args;

    const userId = await fetchUserId(config.username);
    await sendNotification(userId, config.message);
  } catch (error) {
    //: todo define the error message structure
    throw new Error("Error executing executeTelegramNotification");
  }
}
