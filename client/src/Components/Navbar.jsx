import React, { useEffect, useState } from "react";
import { getCurrentuser } from "./../utils/utils.js";
function Navbar() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    setUser(getCurrentuser());
  }, []);
  return (
    <div className="bg-white shadow px-6 py-4 flex justify-between items-center">
      <h2 className="text-xl font-bold">Stock Dashboard</h2>
      <div className="flex items-center gap-4">
        {user ? (
          <>
            <span className="font-semibold">Welcome {user.name}</span>
          </>
        ) : (
          <span className="font-semibold">Welcome Guest</span>
        )}
        <div className="flex items-center justify-center font-semibold w-[50px] h-[50px] bg-orange-300 text-center text-white rounded-full text-3xl">
          {user?.name.substring(0, 1)}
        </div>
      </div>
    </div>
  );
}

export default Navbar;
