import AppPage from '../components/AppPage';
import AvatarPicker from '../components/AvatarPicker';

export default function ProfilePage() {


   return (
      <AppPage>
         <div className="flex flex-col items-center justify-between">
            <h1>Profile Page</h1>
            <AvatarPicker></AvatarPicker>

         </div>
      </AppPage>
   );
}