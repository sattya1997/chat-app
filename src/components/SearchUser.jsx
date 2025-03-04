import { useLocalStorage } from "@mantine/hooks";
import { Delete, Search } from "lucide-react";
import React, { useEffect, useState } from "react";
import Avatar from "./Avatar";
import axios from "axios";
import { toast } from "sonner";

const SearchUser = ({ allUsers, setChatUser }) => {
  const [user, setUser] = useLocalStorage({
    key: "userData",
    defaultValue: {},
  });
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [searchUser, setSearchUser] = useState([]);
  const [searchList, setSearchList] = useState([]);

  const handleUser = async () => {
    try {
      setLoading(true);
      const res = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/searchUser`,
        {
          search,
        },
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
            Accept: "application/json",
          },
        }
      );
      setLoading(false);
      console.log(res);

      const data = res?.data?.users?.filter((item) => item?._id !== user?._id);
      setSearchUser(data);
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  };

  const closeResultList = () => {
    setSearchList([]);
  };

  const showAllUserList = () => {
    setSearchList(allUsers.filter((item) => item._id !== user._id));
  };

  const triggerUserSet = (user) => {
    closeResultList();
    setChatUser(user);
  }

  return (
    <div className="relative top-0 bottom-0 left-0 right-0 bg-slate-700 bg-opacity-80 p-2 z-10 w-70">
      <div className="w-70 max-w-md mx-auto">
        <div className="w-70">
          <div className="bg-gray-800 rounded h-10 overflow-hidden flex relative w-70">
            <input
              type="text"
              placeholder="Search user"
              className="w-full outline-none py-1 h-full px-4 bg-gray-800 text-white"
              onChange={(e) => setSearch(e.target.value)}
              onFocus={showAllUserList}
              // onBlur={closeResultList}
            />
            <div className="h-full w-14 flex justify-center items-center">
              <Search size={20} />
            </div>
          </div>

          <div className="absolute rounded mt-2 max-h-80 overflow-y-auto shadow-lg" style={{backgroundColor: "#2a424f", width: '305px'}}>
            {searchList.length > 0 && (
              <div className="flex justify-end">
                <div
                  className="top-3 text-2xl cursor-pointer"
                  onClick={closeResultList}
                >
                  <Delete size={25} />
                </div>
              </div>
            )}

            {searchList.length > 0 &&
              searchList.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-4 border-b border-slate-200 h-20 hover:bg-slate-800"
                  onClick={() => triggerUserSet(item)}
                >
                  <Avatar
                    name={item.name}
                    userId={item._id}
                    imageUrl={item.profilePic}
                    className="w-16 h-16"
                  />
                  <div className="flex-1 text-ellipsis overflow-hidden">
                    <p className="font-semibold text-lg text-gray-300">{item?.name}</p>
                    <p className="text-sm text-gray-500">{item.email}</p>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchUser;
