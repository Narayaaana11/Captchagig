import React, { createContext, useContext, useEffect, ReactNode } from "react";
import {
  connectSocket,
  disconnectSocket,
  joinUserRoom,
  joinAdminRoom,
  onNotification,
  offNotification,
  onAdminNotification,
  offAdminNotification,
  onTaskUpdate,
  offTaskUpdate,
  onSubmissionUpdate,
  offSubmissionUpdate,
  onLeaderboardUpdate,
  offLeaderboardUpdate,
  onWalletUpdate,
  offWalletUpdate,
} from "../lib/socket";
import {
  onConnectionStatus,
  offConnectionStatus,
  waitForConnection,
} from "../lib/socket";

interface WebSocketContextType {
  isConnected: boolean;
  connectionStatus: {
    status:
      | "connecting"
      | "connected"
      | "disconnected"
      | "error"
      | "reconnecting";
    retries?: number;
    error?: string;
  };
  notifications: any[];
  taskUpdates: any[];
  submissionUpdates: any[];
  leaderboardUpdates: any[];
  walletUpdates: any[];
  adminNotifications: any[];
}

const WebSocketContext = createContext<WebSocketContextType | undefined>(
  undefined
);

export const WebSocketProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [isConnected, setIsConnected] = React.useState(false);
  const [connectionStatus, setConnectionStatus] = React.useState<{
    status:
      | "connecting"
      | "connected"
      | "disconnected"
      | "error"
      | "reconnecting";
    retries?: number;
    error?: string;
  }>({ status: "connecting" });
  const [notifications, setNotifications] = React.useState<any[]>([]);
  const [taskUpdates, setTaskUpdates] = React.useState<any[]>([]);
  const [submissionUpdates, setSubmissionUpdates] = React.useState<any[]>([]);
  const [leaderboardUpdates, setLeaderboardUpdates] = React.useState<any[]>([]);
  const [walletUpdates, setWalletUpdates] = React.useState<any[]>([]);
  const [adminNotifications, setAdminNotifications] = React.useState<any[]>([]);

  useEffect(() => {
    // Connect socket on mount
    const socket = connectSocket();

    socket?.on("connect", () => {
      setIsConnected(true);
      if (!(import.meta as any).env?.PROD) console.log("WebSocket connected");
    });

    socket?.on("disconnect", () => {
      setIsConnected(false);
      if (!(import.meta as any).env?.PROD)
        console.log("WebSocket disconnected");
    });

    // Connection status telemetry
    onConnectionStatus((s) => setConnectionStatus(s));
    // Ensure initial status updates if connection is slow
    waitForConnection(4000).catch(() =>
      setConnectionStatus({ status: "error", error: "socket_connect_timeout" })
    );

    // Subscribe to events
    onNotification((data) => {
      setNotifications((prev) => [data, ...prev.slice(0, 49)]);
    });

    onTaskUpdate((data) => {
      setTaskUpdates((prev) => [data, ...prev.slice(0, 49)]);
    });

    onSubmissionUpdate((data) => {
      setSubmissionUpdates((prev) => [data, ...prev.slice(0, 49)]);
    });

    onLeaderboardUpdate((data) => {
      setLeaderboardUpdates((prev) => [data, ...prev.slice(0, 49)]);
    });

    onWalletUpdate((data) => {
      setWalletUpdates((prev) => [data, ...prev.slice(0, 49)]);
    });

    onAdminNotification((data) => {
      setAdminNotifications((prev) => [data, ...prev.slice(0, 49)]);
    });

    return () => {
      offConnectionStatus();
      offNotification();
      offTaskUpdate();
      offSubmissionUpdate();
      offLeaderboardUpdate();
      offWalletUpdate();
      offAdminNotification();
      disconnectSocket();
    };
  }, []);

  return (
    <WebSocketContext.Provider
      value={{
        isConnected,
        connectionStatus,
        notifications,
        taskUpdates,
        submissionUpdates,
        leaderboardUpdates,
        walletUpdates,
        adminNotifications,
      }}
    >
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error("useWebSocket must be used within WebSocketProvider");
  }
  return context;
};

export const useJoinRoom = (
  userId: string | undefined,
  isAdmin: boolean = false
) => {
  useEffect(() => {
    if (userId) {
      if (isAdmin) {
        joinAdminRoom(userId);
      } else {
        joinUserRoom(userId);
      }
    }
  }, [userId, isAdmin]);
};
