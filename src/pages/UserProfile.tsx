import { useGetCurrentUser, useUpdateMyUser } from "@/api/MyUserApi";
import UserProfileForm from "@/forms/UserProfileForm"

const UserProfile = () => {
  const { currentUser, isLoading : isGetLoading} = useGetCurrentUser();
  const { updateUserProfile, isLoading : isUpdateLoading} = useUpdateMyUser();
  
  if(isGetLoading){
      <span>Loading...</span>
      return
  }

  if(!currentUser){
      <span>Unable to load user profile</span>
      return
  }
  return (
    <div className="w-full p-7 space-y-6">
      
      <div className="p-6 bg-white rounded-xl">
      <UserProfileForm currentUser={currentUser} onSave={updateUserProfile} isLoading={isUpdateLoading}/>
      </div>
      
    </div>
  )
}

export default UserProfile