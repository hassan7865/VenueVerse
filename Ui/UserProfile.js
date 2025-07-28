const SetUserData = (userData) => {
    localStorage.setItem("venue_venture_user_data", JSON.stringify(userData));
};

const GetUserData = () => {
    const user = localStorage.getItem("venue_venture_user_data");
    return user ? JSON.parse(user).user : null; 
};

const UpdateUserData = (userData) => {
  const raw = localStorage.getItem("venue_venture_user_data");
  if (!raw) return;

  const parsed = JSON.parse(raw);
  parsed.user = {
    ...parsed.user,
    ...userData,
  };

  
  localStorage.setItem("venue_venture_user_data", JSON.stringify(parsed));
};


const DeleteUser=()=>{
    localStorage.removeItem("venue_venture_user_data")
}

export default { SetUserData, GetUserData,UpdateUserData,DeleteUser };