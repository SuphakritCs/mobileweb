import { IonPage } from '@ionic/react';
import './Splash.css';

export default function Splash() {
  return (
    <IonPage className="splash">
      <img src="/assets/logo.png" />
      <h1>Photo Gallery</h1>
      <p>Suphakrit App</p>
    </IonPage>
  );
}
