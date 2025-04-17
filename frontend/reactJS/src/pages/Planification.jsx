import React, { useState,useEffect } from "react";
import Calendar from "../components/Calendrier"; 
import { axiosInstance } from "../utils/axios.jsx";
import BarreHaut from "../components/BarreHaut.jsx";

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
        setCountPerDate(res.data.reduce((acc, post) => {
          const dateStr = new Date(post.scheduledFor).toISOString().split("T")[0];
          acc[dateStr] = (acc[dateStr] || 0) + 1;
          return acc;
        
        }, {}));

      } catch (err) {
        console.error("Erreur récupération posts scheduled :", err);
        setError(`Erreur lors du chargement des publications. ${err.message}`);
      } 
    };
  useEffect(()=>{
   fetchScheduledPosts();
   
  },[]);

  return (
    <div>
        <BarreHaut/>
      <h1 className="text-xl font-bold text-center mb-4 pt-20" style={{ color: '#FF0035' }}>
        Page Planification
      </h1>

      {countPerDay && <Calendar events={calendarEvents} countPerDay={countPerDay}/>}
    </div>
  );
};

export default Planification;