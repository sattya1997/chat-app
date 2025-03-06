import { useLocalStorage } from "@mantine/hooks";
import React, { useEffect, useRef, useState } from "react";
import Peer from "simple-peer";
import Avatar from "./Avatar";

import callImage from "../assets/12320300.gif";
import { GetSocket } from "../utils/SocketProvider";

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
        .getUserMedia({ video: videoCall, audio: true })
        .then((stream) => {
          myVideo.current.srcObject = stream;
          setStream(stream);
        })
        .catch((error) => {
          console.error("Error accessing media devices:", error);
        });
    }
  }, [socket, videoCall]);

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
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream: stream,
    });

    peer.on("signal", (data) => {
      socket.emit("answerCall", { signal: data, toUser: fromUser });
    });

    peer.on("stream", (userStream) => {
      if (userVideo.current) {
        userVideo.current.srcObject = userStream;
      }
    });

    if (callerSignal) {
      peer.signal(callerSignal);
      connection.current = peer;
    } else {
      console.error("Caller signal is not available");
    }
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
    if (callerSignal !== null && toUser !== null) {
      setCallingCard(true);
    }
  }, [callerSignal, toUser]);

  return (
    <>
      {!callEnded && (
        <div className="w-screen p-5">
          <div
            style={{
              display: "flex",
              gap: "10px",
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
            }}
          >
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
              }}
            >
              <video ref={userVideo} autoPlay playsInline width={300}></video>
              <button onClick={leaveCall} className="call-btn bg-red-400">
                Cancel
              </button>
            </div>
          </div>

          {showCallingCard && (
            <div className="w-svw flex items-center flex-col">
              <div className="flex items-center gap-3 p-4 border-b border-slate-200 h-20">
                <Avatar
                  imageUrl={fromUser.profilePic}
                  name={fromUser.name}
                  userId={fromUser._id}
                />
                <div className="flex-1 text-ellipsis overflow-hidden">
                  <p className="font-semibold text-lg text-gray-300">
                    {fromUser.name}
                  </p>
                  <p className="text-sm text-gray-500">{fromUser.email}</p>
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