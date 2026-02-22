import { getAI, getGenerativeModel, GoogleAIBackend } from "firebase/ai";
import { app } from "./firebase";

const ai = getAI(app, { backend: new GoogleAIBackend() });

const model = getGenerativeModel(ai, {
  model: "gemini-2.5-flash",
});

export class GeminiVisionService {
  static async analyze(image: any) {
    const result = await model.generateContent([
      "อธิบายภาพนี้ข้อเป็นสรุปสั้นๆไม่ยาว เเละ จัดรูปแบบให้อ่านง่าย ใช้การขึ้นบรรทัด และแบ่งหัวข้อให้เหมาะสม",
      {
        inlineData: {
          data: image.base64,
          mimeType: image.mimeType,
        },
      },
    ]);

    return result.response.text();
  }
}