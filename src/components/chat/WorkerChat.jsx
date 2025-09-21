"use client";
import React, { useState, useEffect, useRef } from "react";
import {
  Send,
  File as FileIcon,
  Smile,
  Mic,
  Loader2,
  X,
  Paperclip,
  Circle,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import EmojiPicker from "emoji-picker-react";
import { fetchWorkers } from "@/redux/worker/WorkerSlice";
import {
  collection,
  doc,
  addDoc,
  setDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { db, storage } from "@/firebase/Firebase";

// -------- Helper functions --------
export const generateChatId = (activeChat) =>
  `chat_${String(activeChat).replace(/\s+/g, "")}`;

export const formatMessageDate = (date) => {
  const today = new Date();
  const msgDate = new Date(date);

  const isToday =
    msgDate.getDate() === today.getDate() &&
    msgDate.getMonth() === today.getMonth() &&
    msgDate.getFullYear() === today.getFullYear();

  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);
  const isYesterday =
    msgDate.getDate() === yesterday.getDate() &&
    msgDate.getMonth() === yesterday.getMonth() &&
    msgDate.getFullYear() === yesterday.getFullYear();

  if (isToday) return "Today";
  if (isYesterday) return "Yesterday";

  return msgDate.toLocaleDateString(undefined, {
    weekday: "long",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

export const formatTime = (date) => {
  return new Date(date).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

const WorkerChat = () => {
  const dispatch = useDispatch();
  const { items: workers } = useSelector((state) => state.workers);
  const loginData = useSelector((state) => state.auth);

  const user = {
    userId: loginData?.user?.userId || "",
    name: `${loginData?.user?.name || ""} ${loginData?.user?.surname || ""}`,
    email: loginData?.user?.email || "",
    token: loginData?.token || "",
  };

  // Moved state management inside the component
  const [unreadCount, setUnreadCount] = useState({});
  const [activeChat, setActiveChat] = useState(null);

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [filePreviews, setFilePreviews] = useState([]);
  const [isRecording, setIsRecording] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});
  const [lastMessages, setLastMessages] = useState({});
  const [userStatus, setUserStatus] = useState({});
  const [mediaLoaded, setMediaLoaded] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const [mediaList, setMediaList] = useState([]);

  const fileInputRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const messagesEndRef = useRef(null);

  // ---------- Effects ----------
  useEffect(() => {
    dispatch(fetchWorkers());
  }, [dispatch]);

  // Fetch status of all users
  useEffect(() => {
    const unsub = onSnapshot(collection(db, "users"), (snapshot) => {
      const statusMap = {};
      snapshot.forEach((doc) => {
        statusMap[doc.id] = doc.data().online || false;
      });
      setUserStatus(statusMap);
    });
    return () => unsub();
  }, []);

  // Fetch last message preview and unread count for sidebar
  useEffect(() => {
    const unsubs = workers.map((w) => {
      const chatId = generateChatId(w.id);
      const q = query(
        collection(db, "chats", chatId, "messages"),
        orderBy("createdAt", "desc")
      );
      return onSnapshot(q, (snap) => {
        if (!snap.empty) {
          const lastMsg = snap.docs[0].data();
          setLastMessages((prev) => ({
            ...prev,
            [w.id]: { ...lastMsg, createdAt: lastMsg.createdAt?.toDate() },
          }));

          // Calculate total unread count across all chats
          const totalUnread = snap.docs.reduce((count, doc) => {
            const msg = doc.data();
            return msg.senderId !== user.userId && !msg.read
              ? count + 1
              : count;
          }, 0);
          setUnreadCount((prev) => ({
            ...prev,
            [w.id]: totalUnread,
          }));
        } else {
          setLastMessages((prev) => ({
            ...prev,
            [w.id]: null,
          }));
          setUnreadCount((prev) => ({
            ...prev,
            [w.id]: 0,
          }));
        }
      });
    });
    return () => unsubs.forEach((u) => u());
  }, [workers, user.userId]);

  // Fetch messages for active chat and mark as read
  useEffect(() => {
    if (!activeChat) {
      setMessages([]);
      setMediaLoaded({});
      return;
    }

    const chatId = generateChatId(activeChat);
    const messagesRef = collection(db, "chats", chatId, "messages");
    const q = query(messagesRef, orderBy("createdAt", "asc"));

    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const msgs = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMessages(msgs);

      // Mark all messages as read when chat is opened
      const unreadMessages = msgs.filter(
        (m) => m.senderId !== user.userId && !m.read
      );
      for (const msg of unreadMessages) {
        await updateDoc(doc(db, "chats", chatId, "messages", msg.id), {
          read: true,
        });
      }
    });

    return () => unsubscribe();
  }, [activeChat, user.userId]);

  // Auto scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // ---------- Helpers ----------
  const ensureChatExists = async (chatId, sender, receiver) => {
    const chatDocRef = doc(db, "chats", chatId);
    await setDoc(chatDocRef, { users: [sender, receiver] }, { merge: true });
  };

  const uploadFile = (file, fileName, tempId, chatId, receiver) => {
    return new Promise((resolve, reject) => {
      const storageRef = ref(
        storage,
        `/fromMobileSide/${Date.now()}_${fileName}`
      );
      const uploadTask = uploadBytesResumable(storageRef, file);

      setUploadProgress((prev) => ({ ...prev, [tempId]: 0 }));

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress((prev) => ({ ...prev, [tempId]: progress }));
        },
        reject,
        async () => {
          const url = await getDownloadURL(uploadTask.snapshot.ref);
          setUploadProgress((prev) => {
            const { [tempId]: _, ...rest } = prev;
            return rest;
          });

          await ensureChatExists(chatId, user, receiver);
          await addDoc(collection(db, "chats", chatId, "messages"), {
            content: url,
            type: file.type.startsWith("image/")
              ? "image"
              : file.type.startsWith("video/")
                ? "video"
                : file.type.startsWith("audio/")
                  ? "audio"
                  : "document",
            fileName,
            senderId: user.userId,
            senderName: user.name,
            createdAt: serverTimestamp(),
            read: false,
          });
          resolve();
        }
      );
    });
  };

  const removeFilePreview = (index) => {
    setFilePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const sendMessage = async () => {
    if (!activeChat || (!input.trim() && filePreviews.length === 0)) return;
    setIsSending(true);
    setFilePreviews([]);

    const chatId = generateChatId(activeChat);
    const receiver = workers.find((w) => w.id === activeChat);

    try {
      if (input.trim()) {
        await ensureChatExists(chatId, user, receiver);
        await addDoc(collection(db, "chats", chatId, "messages"), {
          content: input.trim(),
          type: "text",
          senderId: user.userId,
          senderName: user.name,
          createdAt: serverTimestamp(),
          read: false,
        });
      }

      for (let preview of filePreviews) {
        const tempId = Date.now() + "_" + preview.fileName;

        setMessages((prev) => [
          ...prev,
          {
            id: tempId,
            content: preview.fileName,
            type: preview.fileType,
            senderId: user.userId,
            senderName: user.name,
            uploading: true,
          },
        ]);

        await uploadFile(
          preview.file,
          preview.fileName,
          tempId,
          chatId,
          receiver
        );
      }

      setInput("");
    } catch (e) {
      console.error("Send error:", e);
      alert("Failed to send message. Please try again.");
    } finally {
      setIsSending(false);
    }
  };

  // ---------- Voice recording ----------
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (err) {
      console.error("Recording error:", err);
      alert("Microphone access denied.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/webm",
        });
        const audioFile = new File([audioBlob], `voice_${Date.now()}.webm`, {
          type: "audio/webm",
        });

        setFilePreviews((prev) => [
          ...prev,
          { file: audioFile, fileType: "audio", fileName: audioFile.name },
        ]);
      };

      setIsRecording(false);
    }
  };

  const cancelRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stream.getTracks().forEach((t) => t.stop());
    }
    setIsRecording(false);
    audioChunksRef.current = [];
  };

  const handleMicClick = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    const previews = files.map((file) => ({
      file,
      fileType: file.type.startsWith("image/")
        ? "image"
        : file.type.startsWith("video/")
          ? "video"
          : file.type.startsWith("audio/")
            ? "audio"
            : "document",
      fileName: file.name,
    }));
    setFilePreviews((p) => [...p, ...previews]);
    fileInputRef.current.value = null;
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const openMediaModal = (mediaId) => {
    const mediaItems = messages
      .filter((m) => (m.type === "image" || m.type === "video") && m.id)
      .map((m) => ({
        id: m.id,
        content: m.content,
        type: m.type,
        fileName: m.fileName || "Media",
      }));
    const index = mediaItems.findIndex((item) => item.id === mediaId);
    if (index !== -1) {
      setMediaList(mediaItems);
      setCurrentMediaIndex(index);
      setIsModalOpen(true);
    }
  };

  const selectedWorker = workers.find((w) => w.id === activeChat);

  const groupedMessages = messages.reduce((groups, msg) => {
    const date = msg.createdAt?.toDate
      ? msg.createdAt.toDate()
      : msg.createdAt || new Date();
    const label = formatMessageDate(date);
    if (!groups[label]) groups[label] = [];
    groups[label].push(msg);
    return groups;
  }, {});

  // Sort workers by last message time
  const sortedWorkers = [...workers].sort((a, b) => {
    const msgA = lastMessages[a.id]?.createdAt || 0;
    const msgB = lastMessages[b.id]?.createdAt || 0;
    return msgB - msgA;
  });

  return (
    <div className="flex w-full h-[600px] bg-white text-gray-800">
      {/* Sidebar */}
      <aside className="w-80 bg-gradient-to-br from-gray-50 to-blue-50/30 border-r border-gray-200 custom-scrollbar">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg shadow-sm">
              <svg className="h-5 w-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Team Chat</h3>
              <p className="text-gray-600 text-sm">Select a team member to start chatting</p>
            </div>
          </div>
        </div>
        <div className="overflow-y-auto h-[calc(100%-100px)] p-3 space-y-2">
          {sortedWorkers.map((w) => {
            const lastMsg = lastMessages[w.id];
            const unread =
              lastMsg && lastMsg.senderId !== user.userId && !lastMsg.read
                ? 1
                : 0;
            return (
              <div
                key={w.id}
                onClick={() => setActiveChat(w.id)}
                className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all duration-200 relative border-2 ${activeChat === w.id
                    ? "bg-blue-50 border-blue-200 shadow-sm"
                    : "border-transparent hover:bg-white hover:border-gray-200 hover:shadow-sm"
                  }`}
              >
                <div className="relative">
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-semibold flex-shrink-0">
                    {w.profilePictureUrl ? (
                      <img
                        src={w.profilePictureUrl}
                        alt={w.firstName}
                        className="w-full h-full rounded-full object-cover"
                        onError={(e) => {
                          e.target.style.display = "none";
                          e.target.nextSibling.style.display = "flex";
                        }}
                      />
                    ) : null}
                    <span className={w.profilePictureUrl ? "hidden" : "block"}>
                      {w.firstName?.[0] || "U"}
                    </span>
                  </div>
                  <Circle
                    className={`w-3 h-3 absolute -bottom-1 -right-1 ${userStatus[w.id] ? "text-green-500" : "text-gray-400"
                      }`}
                    fill={userStatus[w.id] ? "green" : "gray"}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-gray-900 truncate text-sm">
                      {w.firstName} {w.lastName}
                    </p>
                    {lastMsg && (
                      <p className="text-xs text-gray-400 ml-2">
                        {formatTime(lastMsg.createdAt)}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-xs text-gray-500 truncate max-w-[180px]">
                      {lastMsg
                        ? lastMsg.type === "text"
                          ? lastMsg.content
                          : `[${lastMsg.type}]`
                        : "No messages yet"}
                    </p>
                    {unread > 0 && (
                      <div className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center ml-2">
                        {unread}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </aside>

      {/* Chat Section */}
      <section className="flex-1 flex flex-col bg-white">
        {selectedWorker ? (
          <>
            {/* Chat Header */}
            <header className="flex items-center gap-4 p-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-blue-50/30">
              <div className="relative">
                <div className="w-12 h-12 rounded-full overflow-hidden bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-semibold">
                  {selectedWorker.profilePictureUrl ? (
                    <img
                      src={selectedWorker.profilePictureUrl}
                      alt={selectedWorker.firstName}
                      className="w-full h-full rounded-full object-cover"
                      onError={(e) => {
                        e.target.style.display = "none";
                        e.target.nextSibling.style.display = "flex";
                      }}
                    />
                  ) : null}
                  <span
                    className={
                      selectedWorker.profilePictureUrl ? "hidden" : "block"
                    }
                  >
                    {selectedWorker.firstName?.[0] || "U"}
                  </span>
                </div>
                <Circle
                  className={`w-3 h-3 absolute -bottom-1 -right-1 ${userStatus[selectedWorker.id]
                      ? "text-green-500"
                      : "text-gray-400"
                    }`}
                  fill={userStatus[selectedWorker.id] ? "green" : "gray"}
                />
              </div>
              <div className="flex-1">
                <h2 className="font-bold text-gray-900 text-lg">
                  {selectedWorker.firstName} {selectedWorker.lastName}
                </h2>
                <div className="flex items-center gap-2">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${userStatus[selectedWorker.id]
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-600"
                    }`}>
                    <Circle
                      className={`w-2 h-2 mr-1 ${userStatus[selectedWorker.id] ? "text-green-500" : "text-gray-400"
                        }`}
                      fill={userStatus[selectedWorker.id] ? "green" : "gray"}
                    />
                    {userStatus[selectedWorker.id] ? "Online" : "Offline"}
                  </span>
                  <span className="text-sm text-gray-500">
                    {selectedWorker.specializationName || "No specialization"}
                  </span>
                </div>
              </div>
            </header>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 custom-scrollbar space-y-6 bg-gradient-to-br from-gray-50/30 to-blue-50/20">
              {Object.keys(groupedMessages).map((dateLabel) => (
                <div key={dateLabel}>
                  <div className="sticky top-0 z-10 flex justify-center my-4">
                    <span className="bg-white text-gray-600 text-xs px-4 py-2 rounded-full shadow-sm border border-gray-200 font-medium">
                      {dateLabel}
                    </span>
                  </div>

                  {groupedMessages[dateLabel].map((m) => {
                    const isSender = m.senderId === user.userId;
                    const senderWorker =
                      workers.find((w) => w.id === m.senderId) || {};
                    return (
                      <div
                        key={m.id}
                        className={`flex items-end gap-2 mb-3 ${isSender ? "justify-end" : "justify-start"
                          }`}
                      >
                        {!isSender && (
                          <div className="w-8 h-8 rounded-full overflow-hidden bg-blue-200 flex items-center justify-center text-blue-700 text-sm">
                            {senderWorker.profilePictureUrl ? (
                              <img
                                src={senderWorker.profilePictureUrl}
                                alt={senderWorker.firstName || m.senderName}
                                className="w-full h-full rounded-full object-cover"
                                onError={(e) => {
                                  e.target.style.display = "none";
                                  e.target.nextSibling.style.display = "flex";
                                }}
                              />
                            ) : null}
                            <span
                              className={
                                senderWorker.profilePictureUrl
                                  ? "hidden"
                                  : "block"
                              }
                            >
                              {senderWorker.firstName?.[0] ||
                                m.senderName?.[0] ||
                                "U"}
                            </span>
                          </div>
                        )}
                        <div
                          className={`px-4 py-3 rounded-2xl max-w-md shadow-sm relative ${isSender
                              ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white"
                              : "bg-white text-gray-900 border border-gray-200"
                            }`}
                        >
                          {/* Sender name + time */}
                          {/* <div className="flex justify-between items-center mb-1">
                            <span className="text-xs font-semibold">
                              {m.senderName || "Unknown"}
                            </span>
                            {m.createdAt && (
                              <span className="text-[10px] opacity-70"></span>
                            )}
                          </div> */}

                          {/* Message content */}
                          {m.uploading ? (
                            <div className="flex items-center gap-2">
                              <Loader2 className="w-4 h-4 animate-spin" />
                              <span>
                                Uploading...{" "}
                                {Math.round(uploadProgress[m.id] || 0)}%
                              </span>
                            </div>
                          ) : (
                            <>
                              {m.type === "image" && (
                                <div
                                  className="relative cursor-pointer"
                                  onClick={() => openMediaModal(m.id)}
                                >
                                  {!mediaLoaded[m.id] && (
                                    <div className="w-full h-40 bg-gray-200 rounded-md flex items-center justify-center">
                                      <Loader2 className="w-6 h-6 animate-spin text-gray-500" />
                                    </div>
                                  )}
                                  <img
                                    src={m.content}
                                    alt={m.fileName || "Image"}
                                    className={`rounded-md mb-2 max-w-full h-auto ${mediaLoaded[m.id] ? "block" : "hidden"
                                      }`}
                                    onLoad={() =>
                                      setMediaLoaded((prev) => ({
                                        ...prev,
                                        [m.id]: true,
                                      }))
                                    }
                                    onError={() =>
                                      setMediaLoaded((prev) => ({
                                        ...prev,
                                        [m.id]: false,
                                      }))
                                    }
                                  />
                                </div>
                              )}
                              {m.type === "video" && (
                                <div
                                  className="relative cursor-pointer"
                                  onClick={() => openMediaModal(m.id)}
                                >
                                  {!mediaLoaded[m.id] && (
                                    <div className="w-40 h-40 bg-gray-200 rounded-md flex items-center justify-center">
                                      <Loader2 className="w-6 h-6 animate-spin text-gray-500" />
                                    </div>
                                  )}
                                  <video
                                    src={m.content}
                                    controls
                                    className={`mb-2 max-w-full rounded-md ${mediaLoaded[m.id] ? "block" : "hidden"
                                      }`}
                                    onLoadedMetadata={() =>
                                      setMediaLoaded((prev) => ({
                                        ...prev,
                                        [m.id]: true,
                                      }))
                                    }
                                    onError={() =>
                                      setMediaLoaded((prev) => ({
                                        ...prev,
                                        [m.id]: false,
                                      }))
                                    }
                                  />
                                </div>
                              )}
                              {m.type === "audio" && (
                                <div className="flex flex-col items-start">
                                  <audio
                                    src={m.content}
                                    controls
                                    className="mb-1"
                                    onLoadedMetadata={(e) => {
                                      const duration = e.target.duration;
                                      const minutes = Math.floor(duration / 60);
                                      const seconds = Math.floor(duration % 60)
                                        .toString()
                                        .padStart(2, "0");
                                      e.target.nextSibling.textContent = `${minutes}:${seconds}`;
                                    }}
                                  />
                                  <span className="text-xs opacity-70">
                                    0:00
                                  </span>
                                </div>
                              )}
                              {m.type === "document" && (
                                <a
                                  href={m.content}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="underline hover:no-underline"
                                >
                                  📎 {m.fileName || "Download File"}
                                </a>
                              )}
                              {m.type === "text" && <p>{m.content}</p>}
                            </>
                          )}

                          {/* Sender name + time */}
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-xs font-semibold">
                            </span>
                            {m.createdAt && (
                              <span className="text-[10px] opacity-70">
                                {formatTime(m.createdAt.toDate())}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* File Previews */}
            {filePreviews.length > 0 && (
              <div className="p-3 bg-gray-50 border-t">
                <div className="flex flex-wrap gap-3">
                  {filePreviews.map((preview, idx) => (
                    <div
                      key={idx}
                      className="relative w-44 h-20 flex items-center justify-center border rounded-md bg-white"
                    >
                      <button
                        onClick={() => removeFilePreview(idx)}
                        className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600"
                      >
                        ×
                      </button>

                      {preview.fileType === "image" && (
                        <img
                          src={URL.createObjectURL(preview.file)}
                          alt={preview.fileName}
                          className="w-full h-full object-cover rounded-md"
                        />
                      )}

                      {preview.fileType === "video" && (
                        <video
                          src={URL.createObjectURL(preview.file)}
                          className="w-full h-full object-cover rounded-md"
                          muted
                          controls
                        />
                      )}

                      {preview.fileType === "audio" && (
                        <div className="w-full p-1 flex flex-col items-center">
                          <audio
                            src={URL.createObjectURL(preview.file)}
                            controls
                            className="w-full"
                          />
                        </div>
                      )}

                      {preview.fileType === "document" && (
                        <div className="text-center p-2">
                          <FileIcon className="w-6 h-6 mx-auto mb-1" />
                          <span className="text-xs truncate block">
                            {preview.fileName}
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Input Footer */}
            <footer className="p-4 bg-white border-t border-gray-200">
              <div className="flex items-center gap-3 relative">
                <button
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-600 hover:text-gray-800"
                >
                  <Smile className="w-5 h-5" />
                </button>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-600 hover:text-gray-800"
                >
                  <Paperclip className="w-5 h-5" />
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  onChange={handleFileSelect}
                  multiple
                  accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.txt"
                />

                {showEmojiPicker && (
                  <div className="absolute bottom-20 left-2 z-20 bg-white shadow-lg rounded-lg">
                    <EmojiPicker
                      onEmojiClick={(e) => {
                        setInput((prev) => prev + e.emoji);
                        setShowEmojiPicker(false);
                      }}
                    />
                  </div>
                )}

                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="flex-1 border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-all duration-200"
                  placeholder="Type a message..."
                  disabled={isSending}
                />

                {/* Mic + Cancel */}
                {isRecording ? (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={cancelRecording}
                      className="p-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                    <button
                      onClick={handleMicClick}
                      className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                    >
                      <Mic className="w-5 h-5" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={handleMicClick}
                    className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-600 hover:text-gray-800"
                  >
                    <Mic className="w-5 h-5" />
                  </button>
                )}

                <button
                  onClick={sendMessage}
                  disabled={
                    isSending || (!input.trim() && filePreviews.length === 0)
                  }
                  className={`p-3 rounded-lg transition-all duration-200 ${isSending || (!input.trim() && filePreviews.length === 0)
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 shadow-sm hover:shadow-md"
                    }`}
                >
                  {isSending ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Send className="w-5 h-5" />
                  )}
                </button>
              </div>
            </footer>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-center bg-gradient-to-br from-gray-50/30 to-blue-50/20">
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="p-4 bg-blue-100 rounded-full">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Welcome to Team Chat</h3>
              <p className="text-gray-500">Select a team member from the sidebar to start a conversation</p>
            </div>
          </div>
        )}

        {/* Media Carousel Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 bg-black bg-opacity-80 flex items-center justify-center p-4">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-white text-3xl font-bold z-10 hover:text-gray-300"
            >
              ×
            </button>
            <button
              onClick={() =>
                setCurrentMediaIndex(
                  (prev) => (prev - 1 + mediaList.length) % mediaList.length
                )
              }
              className="absolute left-4 text-white text-5xl opacity-75 hover:opacity-100 z-10"
            >
              ‹
            </button>
            <button
              onClick={() =>
                setCurrentMediaIndex((prev) => (prev + 1) % mediaList.length)
              }
              className="absolute right-4 text-white text-5xl opacity-75 hover:opacity-100 z-10"
            >
              ›
            </button>
            <div className="relative w-full max-w-4xl max-h-[90vh] flex items-center justify-center">
              {mediaList[currentMediaIndex].type === "image" ? (
                <img
                  src={mediaList[currentMediaIndex].content}
                  alt={mediaList[currentMediaIndex].fileName}
                  className="max-w-full max-h-full object-contain rounded-md"
                />
              ) : (
                <video
                  src={mediaList[currentMediaIndex].content}
                  controls
                  autoPlay
                  className="max-w-full max-h-full object-contain rounded-md"
                />
              )}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-60 text-white px-4 py-1 rounded-full text-sm">
                {currentMediaIndex + 1} / {mediaList.length}
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
};

export default WorkerChat;