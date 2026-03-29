import { useState,useRef,useEffect} from "react";
import "./App.css";
import axios from "axios";
import { useAlarm } from "./useAlarm";
import { useNavigate,useParams} from 'react-router-dom';
function Pract(){


const[yu,setyu]=useState();
const recognitionRef = useRef(null);
const [mic,setmic]=useState(false);
const { id,sno  } = useParams();
const [to,setto]=useState([]);
const [prd,setprd]=useState([]);
const [pcou,setpcou]=useState();


useEffect(() => {
    if (!id) return;

    axios.get("http://127.0.0.1:5000/prto", { params: { id } })
      .then(res => setto(res.data))
      .catch(err => console.error(err));
  }, [id]);


function inbd(){
      axios.post("http://127.0.0.1:5000/pci",{id:id,p:pcou})
      .then(res => {
      console.log(res.data)
       
        setrr(false)
        window.location.reload();
      
    })

    }



useEffect(() => {
  if (!id) return;
  axios.get("http://127.0.0.1:5000/snbi",{ params: { id } })
.then(res => {
      setyu(res.data.pcount);
      
    })
.catch(err => console.error(err));
},[id]);



useEffect(() => {
  if (!id) return;

  axios.get("http://127.0.0.1:5000/prclai", { params: { id } })
    .then(res => {
      setprd(res.data);
      
    })
    .catch(err => console.error(err));

}, [id]);


  function sau() {
  axios.post("http://127.0.0.1:5000/prtoai", { id })
    .then(() => {
      // fetch topics again
      return axios.get("http://127.0.0.1:5000/prto", { params: { id } });
    })
    .then(res => {
      setto(res.data);
      

      // fetch problem list
      return axios.get("http://127.0.0.1:5000/prclai", { params: { id } });
    })
    .then(res => {
      setprd(res.data);
      
    })
    .catch(err => console.error(err));
}
 function speak() {
      setmic(false)
      if (recognitionRef.current) {
    recognitionRef.current.stop();
  }

  const speech = new SpeechSynthesisUtterance("MIC TURN OFF");
  window.speechSynthesis.speak(speech);
}


function speak1() {
  setmic(true);

  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

  const recognition = new SpeechRecognition();

  recognition.lang = "en-US";
  recognition.continuous = true;  
  recognition.interimResults = false;

  recognition.onstart = () => {
  
  };

  recognition.onresult = (event) => {
    const text = event.results[event.results.length - 1][0].transcript;
    console.log("You said:", text);

       axios.post("http://127.0.0.1:5000/conapi", {
    message: text   
    })
    .then((response) => {
       const speech = new SpeechSynthesisUtterance(response.data.message);
  window.speechSynthesis.speak(speech);
        console.log("AI Message: " + response.data.message);
    })
    .catch((error) => {
        console.error(error);
    });
   
  };

  recognition.onerror = (event) => {
    console.log("Error:", event.error);
  };

  recognitionRef.current = recognition;
  recognition.start();
}
useAlarm(id);
  
  const navigate=useNavigate();
  const [rr,setrr]=useState(false);
    return (
        <>
        <div id="a">
    <div id="b">🎓 Smart Mentor AI</div>

    <div id="c">
     {mic && (<button id="d" onClick={speak}><i className="bi bi-mic-fill"></i>Voice On</button>)}
    {!mic && (<button id="d" onClick={speak1}><i className="bi bi-mic-mute"></i>Voice Off</button>)}
      <div id="e">
        <div id="f">{id}</div>
        <div id="g">Semester {sno}</div>
      </div>
    </div>
  </div>
        <div id='h'>
        <h6 className='card' style={{width:"15%",height:"100%",marginLeft:"17px",paddingTop:"10px",textAlign:"center",display:"inline-block",cursor:"pointer"}} onClick={() => navigate("/Suc/"+id+"/"+sno)}>Dashboard</h6>
        <h6 className='card' style={{width:"15%",height:"100%",marginLeft:"17px",paddingTop:"10px",textAlign:"center",display:"inline-block",cursor:"pointer"}} onClick={() => navigate("/Place/"+id+"/"+sno)}>Placement / ChoiceSet</h6>
        <h6 className='card' style={{width:"15%",height:"100%",marginLeft:"17px",paddingTop:"10px",textAlign:"center",display:"inline-block",cursor:"pointer"}} onClick={() => navigate("/Problem/"+id+"/"+sno)}>Practice</h6>
        <h6 className='card' style={{width:"15%",height:"100%",marginLeft:"17px",paddingTop:"10px",textAlign:"center",display:"inline-block",cursor:"pointer"}} onClick={() => navigate("/Im/"+id+"/"+sno)}>Schedule</h6>
        <h6 className='card' style={{width:"15%",height:"100%",marginLeft:"17px",paddingTop:"10px",textAlign:"center",display:"inline-block",cursor:"pointer"}} onClick={() => navigate("/Chat/"+id+"/"+sno)}>AI Mentor</h6>
        <h6 className='card' style={{width:"15%",height:"100%",marginLeft:"17px",paddingTop:"10px",textAlign:"center",display:"inline-block",cursor:"pointer"}} onClick={() => navigate("/alert/"+id+"/"+sno)}>Alerts</h6>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", marginTop: "100px" }}>
        <button id="ber4" style={{marginLeft:"50px"}} onClick={sau}>Change a Topic</button>
         <button id="b4" style={{marginRight:"50px"}} onClick={() => setrr(true)}>+ Add Problem</button>
        </div>
         
   {rr && (
  <div
    style={{
      position: "fixed",
      top: "0",
      left: "0",
      width: "100%",
      height: "100vh",
      background: "rgba(0,0,0,0.45)",   // overlap
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: "999"
    }}
  >
    <div
      style={{
        background: "#fff",
        width: "420px",
        padding: "25px",
        borderRadius: "18px",
        boxShadow: "0 20px 40px rgba(0,0,0,0.25)"
      }}
    >
      <div id="b22" style={{display:"flex",justifyContent:"space-between"}}>
        <span id="b23">Add Problem/Topic</span>
        <span
          id="b24"
          style={{cursor:"pointer"}}
          onClick={() => setrr(false)}
        >
          ✕
        </span>
      </div>

      <label id="b25">Today Problem Solved Count</label>
      <input type="Number" className="form-control" id="user" style={{marginTop:"5px"}} onChange={(e) => setpcou(e.target.value)}/>

      <label id="b25">ADD Topics (option) </label>
      <input type="text" className="form-control" id="user" style={{marginTop:"5px"}}/>
      <label id="b31">Description</label>
      <textarea
        id="b32"
        rows="4" placeholder="Add a details for a Chatbox"
        style={{width:"100%",marginBottom:"15px"}}
      />

      <button
        id="b33"
        style={{
          width:"100%",
          background:"black",
          color:"white",
          padding:"10px",
          borderRadius:"8px",
          border:"none"
        }} onClick={inbd}
      >
        Add Item
      </button>
    </div>
  </div>
)}




        <div id="container" style={{marginTop:"20px"}}>

    <div className="card" id="a8" style={{marginLeft:"25px"}}>
      <h3 className="title">Total Solved Problem</h3>
      <center><h1 style={{paddingTop:"20px"}}>{yu}</h1></center>
    </div>
    <div className="card" id="a8" style={{marginLeft:"5px"}}>
      <h2 className="title">Target count</h2>
      <center><h1 style={{paddingTop:"20px"}}>23</h1></center>
    </div>
    <div className="card" id="a8" style={{marginLeft:"5px"}}>
      <h2 className="title">Total Topics</h2>
      <center><h1 style={{paddingTop:"20px"}}>150</h1></center>
    </div>
    </div>


<div id="container" style={{marginLeft:"10px",marginTop:"80px"}}>

    <div className="card" id="a9">
      <h2 className="title">Today Problems</h2>
      


<div className="problem-container" style={{marginLeft:"0px"}}>

  {/* EASY */}
  {prd?.easy?.map((item, index) => (
    <div className="problem-card easy" key={item._id} style={{margin:"20px"}}>
      <span className="problem-id" style={{color:"white"}}>Problem {index + 1}</span>

      <h4 className="problem-name">{item.name}</h4>

      <p className="problem-info" style={{ color: "white" }}>
        Topic: {item.topic} | Platform: {item.platform}
      </p>

      <span className="difficulty easy-badge">Easy</span>
    </div>
  ))}

  {/* MEDIUM */}
  {prd?.medium?.map((item, index) => (
    <div className="problem-card medium" key={item._id} style={{margin:"20px"}}>
      <span className="problem-id" style={{color:"white"}}>Problem {index + 1}</span>

      <h4 className="problem-name">{item.name}</h4>

      <p className="problem-info">
        Topic: {item.topic} | Platform: {item.platform}
      </p>

      <span className="difficulty medium-badge">Medium</span>
    </div>
  ))}

  {/* HARD */}
  {prd?.hard?.map((item, index) => (
    <div className="problem-card hard" key={item._id} style={{margin:"20px"}}>
      <span className="problem-id" style={{color:"white"}}>Problem {index + 1}</span>

      <h4 className="problem-name">{item.name}</h4>

      <p className="problem-info">
        Topic: {item.topic} | Platform: {item.platform}
      </p>

      <span className="difficulty hard-badge">Hard</span>
    </div>
  ))}

</div>
    </div>
    {to && to.map((item) => (<div className="card" id="a9" key={item._id}>
      <h2 className="title">Topics Schedule</h2>
      <div className="topic-card">
  <div className="topic-left">
    <h5>{item.ctopic}</h5>
    

<p style={{color:"white"}}>
  📅 DayCount :
  <b style={{color:"red"}}>
    {Math.floor(
      (new Date() - new Date(item.date)) / (1000 * 60 * 60 * 24)
    )} Days
  </b>
</p>

  </div>

  <div className="topic-divider"></div>

  <div className="topic-right">
    <div className="stat-box">
      <h4>Appointment At</h4>
      <p className="stat-number">{item.date}</p>
    </div>

    <div className="stat-box">
      <h4>⏱ Practice Time</h4>
      <p className="stat-number">5 Hours</p>
    </div>

    <div className="stat-box">
      <h4>📈 Progress</h4>
      <p className="stat-number">80% 🚀</p>
    </div>
  </div>
</div>
    </div>))}
    </div>
        </>
    );
}
export default Pract