import { useLocalStorage } from "@mantine/hooks";
import React, { useEffect, useRef, useState } from "react";
import Peer from "simple-peer";
import Avatar from "./Avatar";

import callImage from "../assets/12320300.gif";
import { GetSocket } from "../utils/SocketProvider";
import adapter from "webrtc-adapter";

const CallingScreen = ({
  videoCall,
  toUser,
  callerSignal,
  setToUser,
  setChatUser,
}) => {
  const socket = GetSocket();
  const [fromUser] = useLocalStorage({
    key: "userData",
    defaultValue: {},
  });
  const [callAccepted, setCallAccepted] = useState(false);
  const [callEnded, setCallEnded] = useState(false);
  const [stream, setStream] = useState(null);
  const myVideo = useRef(null);
  const userVideo = useRef(null);
  const connection = useRef(null);
  const [showCallingCard, setCallingCard] = useState(false);
  const [calling, setCalling] = useState(false);

  useEffect(() => {
    if (socket) {
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: true })
        .then((stream) => {
          setStream(stream);
          myVideo.current.srcObject = stream;
        })
        .catch((error) => {
          console.error("Error accessing media devices:", error);
        });
    }
  }, []);

  useEffect(() => {
    if (toUser && callerSignal === null && stream) {
      callUser();
    }
  }, [stream, toUser, callerSignal]);

  const callUser = () => {
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream: stream,
    });
    peer.on("signal", (data) => {
      socket.emit("callUser", {
        toUser: toUser,
        signalData: data,
        fromUser: fromUser,
      });
    });
    peer.on("stream", (stream) => {
      if (userVideo.current) {
        userVideo.current.srcObject = stream;
      }
    });
    socket.on("callAccepted", (signal) => {
      setCallAccepted(true);
      peer.signal(signal);
    });
    peer.on("connectionstatechange", () => {
      console.log("Connection state change:", peer.connectionState);
    });

    connection.current = peer;
    setCalling(true);
  };

  useEffect(() => {
    if (callAccepted && callerSignal) {
      const peer = new Peer({
        initiator: false,
        trickle: false,
        stream: stream,
      });
      peer.on("signal", (data) => {
        console.log(toUser.name);
        socket.emit("answerCall", { signal: data, toUser: toUser });
      });
      peer.on("stream", (stream) => {
        if (userVideo.current) {
          userVideo.current.srcObject = stream;
        }
      });

      peer.signal(callerSignal);
      connection.current = peer;
    }
  }, [callAccepted, callerSignal, stream, toUser]);

  const answerCall = () => {
    setCallAccepted(true);
    setCallingCard(false);
  };

  const leaveCall = () => {
    try {
      setCallEnded(true);
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
      if (toUser !== null) {
        setChatUser(toUser);
      }
      setToUser(null);
      setCalling(false);
    } catch (error) {
      console.error("Error ending the call:", error);
    }
  };

  useEffect(() => {
    if (callerSignal !== null && toUser !== null && stream !== null) {
      setChatUser(null);
      setCallingCard(true);
    }
  }, [callerSignal, toUser, stream]);

  return (
    <>
      {!callEnded && (
        <div className="w-screen">
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              flexWrap: "wrap",
              gap: "10px",
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
            }}
          >
            <div style={{ display: showCallingCard ? "none" : "block"}}>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                  justifyContent: "center",
                  alignItems: "center",
                  width: "100%",
                  height: "100%",
                }}
              >
                <span>Calling to {toUser.name}</span>
                <video ref={myVideo} autoPlay playsInline width={300}></video>
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                  justifyContent: "center",
                  alignItems: "center",
                  marginTop : window.innerWidth < 500 ? "10px": "0"
                }}
              >
                <video ref={userVideo} autoPlay playsInline width={300}></video>
              </div>

              <div className="flex justify-center p-5">
                <button
                  onClick={leaveCall}
                  className="call-btn bg-red-400 mt-5"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
          {showCallingCard && (
            <div className="w-full flex items-center flex-col">
              <div className="flex items-center gap-3 p-4 border-b border-slate-200 h-20">
                <Avatar
                  imageUrl={toUser.profilePic}
                  name={toUser.name}
                  userId={toUser._id}
                />
                <div className="flex-1 text-ellipsis overflow-hidden">
                  <p className="font-semibold text-lg text-gray-300">
                    {toUser.name}
                  </p>
                  <p className="text-sm text-gray-500">{toUser.email}</p>
                </div>
                <img src={callImage} alt="ok" style={{ height: "50px" }} />
              </div>
              <div className="caller">
                <button onClick={answerCall} className="call-btn bg-blue-400">
                  Answer
                </button>
                <button onClick={leaveCall} className="call-btn bg-red-400">
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default CallingScreen;
