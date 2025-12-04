// src/utils/api.js
import axios from "axios";

export const api = axios.create({
  baseURL: "https://hospital-management-16wx.onrender.com
", // backend ka URL
});
