import * as signalR from "@microsoft/signalr";

let connection = null;

export const startConnection = async () => {
  const token = localStorage.getItem("token");

  connection = new signalR.HubConnectionBuilder()
    .withUrl("https://localhost:7181/notificationHub", {
      accessTokenFactory: () => token
    })
    .withAutomaticReconnect()
    .build();

  try {
    await connection.start();
    console.log("SignalR Connected");
  } catch (error) {
    console.error("Connection error:", error);
  }
};

export const getConnection = () => connection;
