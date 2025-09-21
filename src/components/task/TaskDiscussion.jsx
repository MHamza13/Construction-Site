"use client";
import { useState, useRef, useEffect } from "react";
import {
  Send,
  Paperclip,
  MoreVertical,
  Users,
  Smile,
  FileText,
  Download,
} from "lucide-react";
import EmojiPicker from "emoji-picker-react"; // <-- added

export default function TaskDiscussion({ task }) {
  const [messages, setMessages] = useState(
    task?.discussions || [
      {
        user: "Sarah Chen",
        role: "Project Manager",
        text: "Team, please provide your status updates for this week's sprint review.",
        time: new Date(Date.now() - 3600000).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        timestamp: new Date(Date.now() - 3600000),
        avatar: "SC",
        color: "bg-blue-500",
      },
      // ... other default messages
    ]
  );

  const [input, setInput] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [activeUsers] = useState([
    { name: "Sarah Chen", role: "Project Manager", online: true },
    { name: "Michael Rodriguez", role: "Senior Developer", online: true },
    { name: "Emma Thompson", role: "UI/UX Designer", online: false },
  ]);

  const fileInputRef = useRef(null);
  const messagesEndRef = useRef(null);
  const emojiPickerRef = useRef(null);
  const textareaRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(event.target)
      ) {
        setShowEmojiPicker(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [input]);

  const getAvatarColor = (name) => {
    const colors = [
      "bg-blue-500",
      "bg-green-500",
      "bg-purple-500",
      "bg-orange-500",
      "bg-red-500",
      "bg-indigo-500",
      "bg-teal-500",
      "bg-pink-500",
    ];
    const index = name
      .split("")
      .reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[index % colors.length];
  };

  const sendMessage = (
    content,
    type = "text",
    fileName = null,
    fileData = null
  ) => {
    if (!content.trim() && type === "text") return;

    const newMessage = {
      user: "You",
      role: "Team Member",
      text: content,
      type,
      fileName,
      fileData,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      timestamp: new Date(),
      avatar: "YO",
      color: "bg-gray-500",
    };

    setMessages((prev) => [...prev, newMessage]);
    setInput("");
    setShowEmojiPicker(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (file.type.startsWith("image/")) {
          sendMessage(e.target.result, "image", file.name, file);
        } else {
          sendMessage(`📎 ${file.name}`, "file", file.name, file);
        }
      };
      reader.readAsDataURL(file);
    }
    e.target.value = "";
  };

  const handleEmojiSelect = (emoji) => {
    setInput(input + emoji.emoji); // emoji-picker-react returns object
    setShowEmojiPicker(false);
  };

  const formatTimestamp = (timestamp) => {
    const now = new Date();
    const diff = now - timestamp;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (days === 0) return "Today";
    if (days === 1) return "Yesterday";
    if (days < 7) return `${days} days ago`;
    return timestamp.toLocaleDateString();
  };

  const groupMessagesByDate = (messages) => {
    const groups = {};
    messages.forEach((message) => {
      const date = formatTimestamp(message.timestamp);
      if (!groups[date]) groups[date] = [];
      groups[date].push(message);
    });
    return groups;
  };

  const messageGroups = groupMessagesByDate(messages);

  const downloadFile = (fileData, fileName) => {
    const link = document.createElement("a");
    link.href = fileData;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white rounded-md shadow-lg border border-gray-200 flex flex-col h-[calc(100vh-4rem)] max-h-[530px]">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50 rounded-t-xl">
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-blue-600" />
          <div>
            <h3 className="text-sm font-semibold text-gray-900">
              Team Discussion
            </h3>
            <p className="text-xs text-gray-500">
              {activeUsers.filter((u) => u.online).length} online •{" "}
              {messages.length} messages
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex -space-x-1">
            {activeUsers.slice(0, 3).map((user, index) => (
              <div key={index} className="relative">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-[10px] font-semibold border-2 border-white ${
                    user.color || getAvatarColor(user.name)
                  }`}
                >
                  {user.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()}
                </div>
                {user.online && (
                  <div className="absolute -bottom-0.5 -right-0.5 w-2 h-2 bg-green-500 rounded-full border-2 border-white"></div>
                )}
              </div>
            ))}
          </div>
          <button className="p-1 hover:bg-gray-200 rounded-lg transition-colors cursor-pointer">
            <MoreVertical className="w-3 h-3 text-gray-500" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-3 space-y-4 bg-gray-50 custom-scrollbar">
        {Object.entries(messageGroups).map(([date, dateMessages]) => (
          <div key={date}>
            <div className="flex items-center justify-center mb-4">
              <div className="bg-white text-gray-500 text-[10px] px-2 py-1 rounded-full font-medium border border-gray-200 shadow-sm">
                {date}
              </div>
            </div>
            {dateMessages.map((message, i) => (
              <div
                key={i}
                className={`flex items-start gap-2 mb-3 ${
                  message.user === "You" ? "flex-row-reverse" : ""
                }`}
              >
                <div
                  className={`flex-shrink-0 w-8 h-8 rounded-full text-white flex items-center justify-center text-[10px] font-semibold ${message.color} border-2 border-white shadow-sm`}
                >
                  {message.avatar}
                </div>
                <div
                  className={`flex-1 max-w-md ${
                    message.user === "You" ? "text-right" : ""
                  }`}
                >
                  <div
                    className={`flex items-baseline gap-1 mb-1 ${
                      message.user === "You" ? "justify-end" : ""
                    }`}
                  >
                    <p className="text-xs font-semibold text-gray-900">
                      {message.user}
                    </p>
                    <p className="text-[9px] text-gray-500">{message.role}</p>
                    <p className="text-[8px] text-gray-400">{message.time}</p>
                  </div>
                  <div
                    className={`rounded-xl p-3 ${
                      message.user === "You"
                        ? "bg-blue-600 text-white"
                        : "bg-white border border-gray-200 shadow-sm"
                    }`}
                  >
                    {message.type === "image" ? (
                      <div>
                        <img
                          src={message.text}
                          alt="Shared image"
                          className="max-w-full h-auto rounded-lg mb-1"
                        />
                        <p
                          className={`text-[10px] ${
                            message.user === "You"
                              ? "text-blue-100"
                              : "text-gray-500"
                          }`}
                        >
                          {message.fileName}
                        </p>
                      </div>
                    ) : message.type === "file" ? (
                      <div className="flex items-center gap-2 p-2 bg-white bg-opacity-20 rounded-lg">
                        <FileText className="w-4 h-4" />
                        <div className="flex-1">
                          <p className="text-xs font-medium">
                            {message.fileName}
                          </p>
                          <p className="text-[9px] opacity-80">
                            {(message.fileData?.size / 1024).toFixed(1)} KB
                          </p>
                        </div>
                        <button
                          onClick={() =>
                            downloadFile(message.text, message.fileName)
                          }
                          className="p-1 rounded-lg bg-white bg-opacity-20 hover:bg-opacity-30 transition-colors cursor-pointer"
                        >
                          <Download className="w-3 h-3" />
                        </button>
                      </div>
                    ) : (
                      <p className="text-xs leading-relaxed whitespace-pre-wrap">
                        {message.text}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      {/* Input Area */}
      <div className="p-3 border-t border-gray-200 bg-white rounded-b-xl">
        <div className="flex items-center gap-2">
          <div className="flex-1 relative flex items-center">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-xs resize-none focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all"
              placeholder="Type your message..."
              rows={1}
              style={{ minHeight: "36px", maxHeight: "100px" }}
            />
            {showEmojiPicker && (
              <div
                ref={emojiPickerRef}
                className="absolute bottom-12 left-0 rounded-md z-10"
              >
                <EmojiPicker
                  onEmojiClick={(emojiObject) => {
                    // Insert emoji at cursor position
                    const start = textareaRef.current.selectionStart;
                    const end = textareaRef.current.selectionEnd;
                    const newText =
                      input.substring(0, start) +
                      emojiObject.emoji +
                      input.substring(end);
                    setInput(newText);
                    setShowEmojiPicker(false);
                    // Move cursor after inserted emoji
                    setTimeout(() => {
                      textareaRef.current.selectionStart =
                        textareaRef.current.selectionEnd =
                          start + emojiObject.emoji.length;
                      textareaRef.current.focus();
                    }, 0);
                  }}
                />
              </div>
            )}
          </div>

          <button
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-all cursor-pointer"
            title="Add emoji"
          >
            <Smile className="w-4 h-4" />
          </button>

          <button
            onClick={() => fileInputRef.current?.click()}
            className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-all cursor-pointer"
            title="Attach file"
          >
            <Paperclip className="w-4 h-4" />
          </button>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            className="hidden"
            accept="image/*,.pdf,.doc,.docx,.txt,.zip"
            multiple
          />

          <button
            onClick={() => sendMessage(input)}
            disabled={!input.trim()}
            className="p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all cursor-pointer"
            title="Send message"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
