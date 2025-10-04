const getCurrentuser = () => {
  const currentUser = localStorage.getItem("userlogin");

  if (currentUser) {
    return JSON.parse(currentUser);
  } else {
    return null;
  }
};

export { getCurrentuser };
