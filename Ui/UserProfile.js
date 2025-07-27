const SetUserData = (userData) => {
    localStorage.setItem("venue_venture_user_data", JSON.stringify(userData));
};

const GetUserData = () => {
    const user = localStorage.getItem("venue_venture_user_data");
    return user ? JSON.parse(user).user : null; 
};

const UpdateUserData=(userData)=>{
   
    const user = GetUserData()
    user.avatar = userData.avatar
    user.username = userData.username
    user.email = userData.email

  
    SetUserData(user)
}

const DeleteUser=()=>{
    localStorage.removeItem("venue_venture_user_data")
}

export default { SetUserData, GetUserData,UpdateUserData,DeleteUser };