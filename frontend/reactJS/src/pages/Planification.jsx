import React, { useState,useEffect } from "react";
import Calendar from "../components/Calendrier"; 
import { axiosInstance } from "../utils/axios.jsx";

const Planification = () => {
  const [calendarEvents, setCalendarEvents] = useState([]);
  const [countPerDay,setCountPerDate] = useState(null);
  const fetchScheduledPosts = async () => {
  
      try {
        const res = await axiosInstance.get(`/api/posts/scheduled/${localStorage.getItem("user_id")}`, {
                            headers: {
                                "Authorization": `Bearer ${sessionStorage.getItem("token")}`,
                                "Content-Type": "application/json"
                            }
                        });
        
        console.log("Publications a venir reçues :", res.data);
        setCalendarEvents(res.data);
      } catch (err) {
        console.error("Erreur récupération posts scheduled :", err);
        setError(`Erreur lors du chargement des publications. ${err.message}`);
      } 
    };
  useEffect(()=>{
   fetchScheduledPosts();
  },[]);

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold text-center mb-4" style={{ color: '#FF0035' }}>
        Page Planification
      </h1>

      <Calendar events={calendarEvents} />
    </div>
  );
};

export default Planification;