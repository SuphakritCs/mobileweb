import { Camera, CameraResultType, CameraSource } from "@capacitor/camera";

export class PhotoService {

  // 📸 ถ่ายภาพจากมือถือ
  static async fromCamera() {
    const photo = await Camera.getPhoto({
      source: CameraSource.Prompt,
      resultType: CameraResultType.Base64,
      quality: 85,
    });

    return {
      base64: photo.base64String!,
      mimeType: `image/${photo.format}`,
    };
  }

  // 📂 เลือกรูปจากเครื่องคอม
  static async fromFile(file: File) {
    const base64 = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();

      reader.onloadend = () => {
        const result = reader.result as string;
        const b64 = result.split(",")[1]; // ตัด prefix data:image/...
        resolve(b64);
      };

      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

    return {
      base64,
      mimeType: file.type || "image/jpeg",
    };
  }
}