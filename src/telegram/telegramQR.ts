import QRCode from "qrcode";
import { botUsername } from "../../config/config";

export const generateTelegramQR = async (userToken: string) => {
  try {
      const link = `https://t.me/${botUsername}?start=${userToken}`;
      const base64Data = await QRCode.toDataURL(link);
      return base64Data;
    } catch (err) {
      console.error("Ошибка генерации QR-кода:", err);
    }
  };
