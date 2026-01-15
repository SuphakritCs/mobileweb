import React from 'react';
import {
  IonContent, IonHeader, IonPage, IonTitle, IonToolbar,
  IonFab, IonFabButton, IonIcon, IonGrid, IonRow, IonCol,
  IonCard, IonButton
} from '@ionic/react';
import { camera, trash } from 'ionicons/icons';
import { usePhotoGallery } from '../usePhotoGallery';
import './Tab2.css';

const Tab2: React.FC = () => {

  const { photos, takePhoto, deletePhoto } = usePhotoGallery();

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="success">
          <IonTitle>📸 My Gallery</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <IonCard className="profile-card">
          <img className="avatar" src="public/profile.jpg" />
            <h2>663380403-1</h2>
              <p>นายศุภกฤต สังข์มณีวงศ์</p>
        </IonCard>


        <IonGrid>
          <IonRow>
            {photos.map((photo, index) => (
              <IonCol size="6" size-md="4" size-lg="3">
                <IonCard className="photo-card">

                  <img src={photo.webviewPath} />

                  <IonButton
                    color="danger"
                    fill="clear"
                    className="delete-btn"
                    onClick={() => deletePhoto(photo)}
                  >
                    <IonIcon icon={trash} />
                  </IonButton>

                </IonCard>
              </IonCol>
            ))}
          </IonRow>
        </IonGrid>

        <IonFab vertical="bottom" horizontal="center" slot="fixed">
          <IonFabButton color="success" onClick={takePhoto}>
            <IonIcon icon={camera}></IonIcon>
          </IonFabButton>
        </IonFab>

      </IonContent>
    </IonPage>
  );
};

export default Tab2;
