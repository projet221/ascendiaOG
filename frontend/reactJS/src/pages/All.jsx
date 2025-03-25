import React, {useState} from "react";
import SelectUnCompte from "../components/SelectUnCompte.jsx";
import AjoutFichierBouton from "../components/AjoutFichierBouton.jsx";
import BarreHaut from "../components/BarreHaut.jsx";
import SidebarPublication from "../components/SideBarPublication.jsx";


function Publier(){


    const [posts, setPosts] = useState([]);
  const [error, setError] = useState(null);


    function publier(){

    }
    return (
        <div>
            <BarreHaut/>
            <SidebarPublication/>

        
                    <div className="ml-64 mt-16 p-6">
               
                    <div className="min-h-screen flex bg-gray-100">
                      <div className=" p-6">
                        <SelectUnCompte/>
                        
                       
    <div>
      <h1>Liste des Posts</h1>
      {posts.map(post => (
        <div key={post.id} className="p-4 mb-4 border rounded-lg shadow">
          <h2 className="text-xl font-bold">{post.title}</h2>
          <p>{post.body}</p>
        </div>
      ))}
    </div>
        
            

                </div>
                </div>
                </div>

                
        </div>
        
    );  
}
export default Publier;
