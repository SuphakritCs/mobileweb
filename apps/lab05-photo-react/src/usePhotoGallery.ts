import { useState, useEffect } from 'react';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Preferences } from '@capacitor/preferences';

export interface UserPhoto {
  filepath: string;
  webviewPath?: string;
}

const PHOTO_STORAGE = 'photos';

export function usePhotoGallery() {

  const [photos, setPhotos] = useState<UserPhoto[]>([]);

  useEffect(() => {
    loadSaved();
  }, []);

  const takePhoto = async () => {
    const photo = await Camera.getPhoto({
      resultType: CameraResultType.Uri,
      source: CameraSource.Camera,
      quality: 100
    });

    const fileName = new Date().getTime() + '.jpeg';

    const newPhoto: UserPhoto = {
      filepath: fileName,
      webviewPath: photo.webPath
    };

    const newPhotos = [newPhoto, ...photos];
    setPhotos(newPhotos);

    Preferences.set({
      key: PHOTO_STORAGE,
      value: JSON.stringify(newPhotos)
    });
  };

  const loadSaved = async () => {
    const list = await Preferences.get({ key: PHOTO_STORAGE });
    const photosInStorage = list.value ? JSON.parse(list.value) : [];
    setPhotos(photosInStorage);
  };

  const deletePhoto = async (photo: UserPhoto) => {

    const newPhotos = photos.filter(p => p.filepath !== photo.filepath);
    setPhotos(newPhotos);

    await Filesystem.deleteFile({
      path: photo.filepath,
      directory: Directory.Data
    });

    Preferences.set({
      key: PHOTO_STORAGE,
      value: JSON.stringify(newPhotos)
    });
  };

  return { photos, takePhoto, deletePhoto };
}
