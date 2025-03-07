import React, { useEffect, useState } from "react";
import { GetSocket } from "../utils/SocketProvider";
import { LogOut, MessageCircle, PhoneCall } from "lucide-react";
import Avatar from "./Avatar";
import { useLocalStorage } from "@mantine/hooks";
import { useNavigate } from "react-router-dom";
import SearchUser from "./SearchUser";
import EditProfile from "./EditProfile";
import axios from "axios";

const SideBar = ({
  triggerChatUser,
  chatUser,
  hideSideBar,
  toggleCalling,
  toggleSideBar,
  callingBar,
}) => {
  const navigate = useNavigate();
  const [user, setUser] = useLocalStorage({
    key: "userData",
    defaultValue: {},
  });
  const socket = GetSocket();
  const [editProfile, setEditProfile] = useState(false);
  const [allConversation, setAllConversation] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const REACT_APP_BACKEND_URL = "https://chat-app-server-euua.onrender.com";

  useEffect(() => {
    const fetchData = async () => {
      const getAllUsers = async () => {
        const res = await axios.get(
          `${REACT_APP_BACKEND_URL}/api/getAllUsers`,
          {
            headers: {
              Authorization: `Bearer ${user?.token}`,
              Accept: "application/json",
            },
          }
        );
        setAllUsers(res.data);
      };

      const getAllConversations = async () => {
        const params = {
          user: user._id,
        };
        const res = await axios.get(`${REACT_APP_BACKEND_URL}/api/getAllConv`, {
          headers: {
            Authorization: `Bearer ${user?.token}`,
            Accept: "application/json",
          },
          params: params,
        });
        var convs = res?.data;
        let data = [];
        convs.forEach((conv) => {
          let temp = conv.receiver;
          if (temp._id === user._id) {
            temp = conv.sender;
          }
          temp.seen = conv.unseenMsg;
          data.push(temp);
        });
        setAllConversation(data);
      };

      if (user && user._id) {
        await getAllConversations();
        await getAllUsers();
      }
    };

    fetchData();
  }, [user._id]);

  useEffect(() => {
    if (socket) {
      socket.emit("sidebar", user?._id);

      socket.on("conversation", (convs) => {
        let data = [];
        convs.forEach((conv) => {
          let temp = conv.receiver;
          if (temp._id === user._id) {
            temp = conv.sender;
          }
          temp.seen = conv.unseenMsg;
          data.push(temp);
        });
        setAllConversation(data);
      });
    }

    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, [socket, user?._id]);

  const handleLogout = () => {
    setUser(null);
    navigate("/login");
  };

  const setChatUser = (user) => {
    triggerChatUser(user);
  };

  return (
    <div className="h-svh flex flex-row bg-slate-700">
      <div
        className="bg-secondary h-full py-5 flex flex-col items-center justify-between"
        style={{ position: "relative" }}
      >
        <div>
          <div
            title="Chat Menu"
            className="w-12 h-12 flex justify-center items-center cursor-pointer text-slate-300 hover:text-slate-200 rounded"
            onClick={toggleSideBar}
          >
            <MessageCircle size={20} />
          </div>

          <div
            title="Calling Menu"
            onClick={() => toggleCalling()}
            className="w-12 h-12 flex justify-center items-center cursor-pointer text-slate-300 hover:text-slate-200 rounded"
          >
            <PhoneCall size={20} />
          </div>
        </div>
        <div className="flex flex-col items-center">
          <button onClick={() => setEditProfile(true)}>
            <Avatar
              imageUrl={user?.profilePic}
              name={user?.name}
              userId={user?._id}
            />
          </button>
          <button title="logout" onClick={handleLogout}>
            <span className="-ml-2 text-slate-300 hover:text-slate-200">
              <LogOut size={20} />
            </span>
          </button>
        </div>
      </div>
      <div
        className={`h-full bg-slate-600 ${
          hideSideBar ? "w-0 hide-sidebar" : "w-64 sidebar show-sidebar"
        }`}
      >
        <SearchUser allUsers={allUsers.users} setChatUser={setChatUser} />
        {allConversation &&
          allConversation.map((item, index) => (
            <div
              key={index}
              className="flex items-center gap-3 p-4 border-b border-slate-200 h-20 hover:bg-slate-800"
              style={{
                backgroundColor: chatUser?._id === item._id ? "#364044" : "",
              }}
              onClick={() => setChatUser(item)}
            >
              <Avatar
                name={item.name}
                userId={item._id}
                imageUrl={item.profilePic}
                className="w-16 h-16"
              />
              <div className="flex-1 text-ellipsis overflow-hidden">
                <p className="font-semibold text-lg text-gray-300">
                  {item?.name}
                </p>
                <p className="text-sm text-gray-500">{item.email}</p>
              </div>
              {item.seen > 0 && (
                <div className="text-gray-400 text-xs">{item.seen}</div>
              )}
            </div>
          ))}
      </div>
      {callingBar && (
        <div className={`h-full w-64 bg-slate-600`}>
          <p>working</p>
        </div>
      )}
      {/* {openSearchUser && <AddUser setOpenSearchUser={setOpenSearchUser} />} */}
      {editProfile && (
        <EditProfile
          setEditProfile={setEditProfile}
          user={user}
          setUser={setUser}
        />
      )}
    </div>
  );
};

export default SideBar;
