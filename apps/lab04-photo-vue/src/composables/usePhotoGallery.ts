import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Preferences } from '@capacitor/preferences';
import { ref } from 'vue';

export interface UserPhoto {
  filepath: string;
  webviewPath?: string;
}


const PHOTO_STORAGE = 'photos';

export function usePhotoGallery() {
  const photos = ref<UserPhoto[]>([]);

  const takePhoto = async () => {
    const photo = await Camera.getPhoto({
      resultType: CameraResultType.Uri,
      source: CameraSource.Camera,
      quality: 100,
    });

    const fileName = new Date().getTime() + '.jpeg';
    const savedFile = await savePicture(photo, fileName);

    photos.value.unshift(savedFile);

    Preferences.set({
      key: PHOTO_STORAGE,
      value: JSON.stringify(photos.value),
    });
  };

  const savePicture = async (photo: Photo, fileName: string): Promise<UserPhoto> => {
    const response = await fetch(photo.webPath!);
    const blob = await response.blob();
    const base64Data = await convertBlobToBase64(blob) as string;

    const savedFile = await Filesystem.writeFile({
      path: fileName,
      data: base64Data,
      directory: Directory.Data,
    });

    return {
      filepath: fileName,
      webviewPath: photo.webPath,
    };
  };

  const loadSaved = async () => {
    const photoList = await Preferences.get({ key: PHOTO_STORAGE });
    const photosInStorage = photoList.value ? JSON.parse(photoList.value) : [];

    photos.value = photosInStorage;
  };

  const convertBlobToBase64 = (blob: Blob) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = () => resolve(reader.result);
    reader.readAsDataURL(blob);
  });
    const deletePhoto = async (index: number, filepath: string) => {
    // ลบออกจาก state
    photos.value.splice(index, 1);

    // ลบไฟล์จริงในเครื่อง
    await Filesystem.deleteFile({
      path: filepath,
      directory: Directory.Data,
    });

    // บันทึก state ใหม่ลง Preferences
    Preferences.set({
      key: PHOTO_STORAGE,
      value: JSON.stringify(photos.value),
    });
  };
  return { photos, takePhoto, loadSaved, deletePhoto };

}
