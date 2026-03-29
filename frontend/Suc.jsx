import axios from "axios";
import "./App.css";
import { useState,useRef,useEffect} from "react";
import { useNavigate,useParams} from "react-router-dom";
import { useAlarm } from "./useAlarm";
function Suc(){
    const { id,sno } = useParams();
    const[fd,setfd]=useState();
    const navigate = useNavigate();
    const recognitionRef = useRef(null);
    const [mic,setmic]=useState(false);
    const [im,setim]=useState([]);
    const [ni,setni]=useState([]);
    
    const [show, setShow] = useState(false);
    function speak() {
      setmic(false)
      if (recognitionRef.current) {
    recognitionRef.current.stop();
  }

  const speech = new SpeechSynthesisUtterance("MIC TURN OFF");
  window.speechSynthesis.speak(speech);
}

const [data, setData] = useState({});
useEffect(() => {
  axios.get("http://127.0.0.1:5000/paide")
    .then(res => setData(res.data))
    .catch(err => console.error(err));
}, []);

useEffect(() => {
  axios.get("http://127.0.0.1:5000/ifs", {
      params: { id }
    })
  .then(res=>{setfd(res.data)
    
  }
)
  .catch(err => console.error(err));
},[]);

function sem1() {
    

    axios.post("http://127.0.0.1:5000/apl", {
        id: id,
        semno: sno
    })
    .then((response) => {
        if (response.data.message) {
    setShow(true);
    setTimeout(() => {
        setShow(false);
    }, 3000);
}
        
    });
}


const fetchData = () => {
    if (!id) return;

    axios.get("http://127.0.0.1:5000/sem", {
      params: { id }
    })
    .then(response => {
    

      setni(response.data.data || []);
    })
    .catch(error => console.error(error));
  };


useEffect(() => {
    fetchData();
  }, [id]);


// ✅ 1. Declare functions FIRST
const parseDate = (dateStr) => {
  const [day, month, year] = dateStr.split("-");
  return new Date(`${year}-${month}-${day}`);
};

const getToday = () => {
  const today = new Date();
  const dd = String(today.getDate()).padStart(2, '0');
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const yyyy = today.getFullYear();
  return `${dd}-${mm}-${yyyy}`;
};

// ✅ 2. THEN use them
const today = parseDate(getToday());

const allSchedules = ni.flatMap(record =>
  (record?.data?.study_schedule || [])
);

const filteredSchedules = allSchedules.filter(item => {
  const start = parseDate(item.start_date);
  const end = parseDate(item.end_date);

  return today >= start && today <= end;
});


const getTodayDate = () => {
  const today = new Date();
  return today.toISOString().split("T")[0]; // "2026-03-23"
};


const toda = getTodayDate();

const todayData = im.filter(item => {
  const itemDate = item.date.split("T")[0]; // extract "2026-03-12"
  return itemDate === toda;
});



useEffect(() => {
  if (!id) return;   // prevent undefined call

  axios.get("http://127.0.0.1:5000/scdb", {
    params: { id }
  })
  .then(response => {
    setim(response.data);
   
  })
  .catch(error => console.error(error));

}, [id]);

function speak1() {
  setmic(true);

  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

  const recognition = new SpeechRecognition();

  recognition.lang = "en-US";
  recognition.continuous = true;   // ✅ Keep listening
  recognition.interimResults = false;

  recognition.onstart = () => {
    
  };

  recognition.onresult = (event) => {
    const text = event.results[event.results.length - 1][0].transcript;
    console.log("You said:", text);

       axios.post("http://127.0.0.1:5000/conapi", {
    message: text   // ✅ send text to backend
    })
    .then((response) => {
       const speech = new SpeechSynthesisUtterance(response.data.message);
  window.speechSynthesis.speak(speech);
        
    })
    .catch((error) => {
        console.error(error);
    });

    // ❌ DO NOT call recognition.stop() here
  };

  recognition.onerror = (event) => {
    console.log("Error:", event.error);
  };

  recognitionRef.current = recognition;
  recognition.start();
}
    
useAlarm(id);

    return(
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
        <h6 className='card' style={{width:"15%",height:"100%",marginLeft:"17px",paddingTop:"10px",textAlign:"center",display:"inline-block",cursor:"pointer"}} >Dashboard</h6>
        <h6 className='card' style={{width:"15%",height:"100%",marginLeft:"17px",paddingTop:"10px",textAlign:"center",display:"inline-block",cursor:"pointer"}} onClick={() => navigate("/Place/"+id+"/"+sno)}>Placement / ChoiceSet</h6>
        <h6 className='card' style={{width:"15%",height:"100%",marginLeft:"17px",paddingTop:"10px",textAlign:"center",display:"inline-block",cursor:"pointer"}} onClick={() => navigate("/Problem/"+id+"/"+sno)}>Practice</h6>
        <h6 className='card' style={{width:"15%",height:"100%",marginLeft:"17px",paddingTop:"10px",textAlign:"center",display:"inline-block",cursor:"pointer"}} onClick={() => navigate("/Im/"+id+"/"+sno)}>Schedule</h6>
        <h6 className='card' style={{width:"15%",height:"100%",marginLeft:"17px",paddingTop:"10px",textAlign:"center",display:"inline-block",cursor:"pointer"}} onClick={() => navigate("/Chat/"+id+"/"+sno)}>AI Mentor</h6>
        <h6 className='card' style={{width:"15%",height:"100%",marginLeft:"17px",paddingTop:"10px",textAlign:"center",display:"inline-block",cursor:"pointer"}} onClick={() => navigate("/alert/"+id+"/"+sno)}>Alerts</h6>
        </div>

{show && (
  <div style={{
    position: "fixed",
    top: "20px",
    left: "50%",
    transform: "translateX(-50%)",
    padding: "18px 25px",
    borderRadius: "12px",
    background: "linear-gradient(135deg, #36d1dc, #5b86e5)",
    color: "#fff",
    fontFamily: "Arial",
    fontSize: "16px",
    fontWeight: "500",
    boxShadow: "0 6px 15px rgba(0,0,0,0.2)",
    display: "flex",
    alignItems: "center",
    gap: "10px",
    
    // Animation
    animation: "slideDown 0.5s ease forwards"
  }}>
    ⚡ Data submitted successfully!

    <style>
      {`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translate(-50%, -30px);
          }
          to {
            opacity: 1;
            transform: translate(-50%, 0);
          }
        }
      `}
    </style>
  </div>
)}

    <button id="ber4" style={{marginLeft:"1280px",marginTop:"50px",color:"black",textSizeAdjust:"20px"}} onClick={sem1}>Add Semester</button>

        <div id="container" style={{marginTop:"50px"}}>

  <div className="card" id="a8" style={{marginLeft:"-5px"}}>
    <h3 className="title">Current Streak</h3>
    <div className="desc" style={{ textAlign: "center" }}>
      <h1 style={{color:"black"}}>{fd?.streak} days🔥</h1>
    </div>
  </div>

  <div className="card" id="a8" style={{marginLeft:"-0px"}}>
    <h2 className="title">Problem Solved</h2>
    <div className="desc" style={{ textAlign: "center" }}>
      <h1 style={{color:"black"}}>{fd?.pcount}</h1>
    </div>
  </div>

  <div className="card" id="a8" style={{marginLeft:"0px"}}>
    <h2 className="title">Overall Placement (%)</h2>
    <div className="desc" style={{ textAlign: "center" }}>
      <h1 style={{color:"black"}}>{sno * 12} %⚡</h1>
    </div>
  </div>

  <div className="card" id="a8" style={{marginLeft:"370px",marginTop:"-170px"}}>
    <h2 className="title">Accuracy</h2>
    <div className="desc" style={{ textAlign: "center" }}>
      <h1 style={{color:"black"}}>99%</h1>
    </div>
  </div>

</div>

    <div id="container" style={{marginLeft:"10px",marginTop:"80px"}}>

    <div className="card" id="a9">
      <h2 className="title">Today Goals</h2>

      
  <div className="aya1">

{filteredSchedules.map((item, index) => (
  <div
    key={index}
    style={{
      display: "flex",
      flexDirection: "column",
      gap: "6px",
      padding: "16px 18px",
      margin: "12px 0",
      borderRadius: "14px",
      background: "#ffffff",
      boxShadow: "0 6px 15px rgba(0,0,0,0.08)",
      fontFamily: "Poppins, sans-serif",
      transition: "0.3s"
    }}
  >
    
    {/* Type Badge */}
    <span
      style={{
        fontSize: "12px",
        fontWeight: "500",
        color: "#fff",
        background: "#007bff",
        padding: "4px 10px",
        borderRadius: "12px",
        width: "fit-content",
        letterSpacing: "0.5px",
        textTransform: "uppercase"
      }}
    >
    Examination
    </span>

    {/* Title */}
    <span
      style={{
        fontSize: "16px",
        fontWeight: "600",
        color: "#2c3e50",
        lineHeight: "1.4",
        textTransform: "capitalize"
      }}
    >
      {item.subject}
    </span>

    {/* Status */}
    <span
      style={{
        fontSize: "13px",
        fontWeight: "500",
        color: "#28a745"
      }}
    >
      {item.start_date} → {item.end_date}
    </span>

  </div>
))}

{todayData.map((item, index) => (
  <div
    key={index}
    style={{
      display: "flex",
      flexDirection: "column",
      gap: "6px",
      padding: "16px 18px",
      margin: "12px 0",
      borderRadius: "14px",
      background: "#ffffff",
      boxShadow: "0 6px 15px rgba(0,0,0,0.08)",
      fontFamily: "Poppins, sans-serif",
      transition: "0.3s"
    }}
  >
    
    {/* Type Badge */}
    <span
      style={{
        fontSize: "12px",
        fontWeight: "500",
        color: "#fff",
        background: "#007bff",
        padding: "4px 10px",
        borderRadius: "12px",
        width: "fit-content",
        letterSpacing: "0.5px",
        textTransform: "uppercase"
      }}
    >
      {item.type}
    </span>

    {/* Title */}
    <span
      style={{
        fontSize: "16px",
        fontWeight: "600",
        color: "#2c3e50",
        lineHeight: "1.4",
        textTransform: "capitalize"
      }}
    >
      {item.title}
    </span>

    {/* Status */}
    <span
      style={{
        fontSize: "13px",
        fontWeight: "500",
        color: "#28a745"
      }}
    >
      Today
    </span>

  </div>
))}


<div
   
    style={{
      display: "flex",
      flexDirection: "column",
      gap: "6px",
      padding: "16px 18px",
      margin: "12px 0",
      borderRadius: "14px",
      background: "#ffffff",
      boxShadow: "0 6px 15px rgba(0,0,0,0.08)",
      fontFamily: "Poppins, sans-serif",
      transition: "0.3s"
    }}
  >
    
    {/* Type Badge */}
    <span
      style={{
        fontSize: "12px",
        fontWeight: "500",
        color: "#fff",
        background: "#007bff",
        padding: "4px 10px",
        borderRadius: "12px",
        width: "fit-content",
        letterSpacing: "0.5px",
        textTransform: "uppercase"
      }}
    >
        Problem Solving
    </span>

    {/* Title */}
    <span
      style={{
        fontSize: "16px",
        fontWeight: "600",
        color: "#2c3e50",
        lineHeight: "1.4",
        textTransform: "capitalize"
      }}
    >
      To Achieve a Goal
    </span>

    {/* Status */}
    <span
      style={{
        fontSize: "13px",
        fontWeight: "500",
        color: "#28a745"
      }}
    >
      Now
    </span>

  </div>
<div
   
    style={{
      display: "flex",
      flexDirection: "column",
      gap: "6px",
      padding: "16px 18px",
      margin: "12px 0",
      borderRadius: "14px",
      background: "#ffffff",
      boxShadow: "0 6px 15px rgba(0,0,0,0.08)",
      fontFamily: "Poppins, sans-serif",
      transition: "0.3s"
    }}
  >
    
    {/* Type Badge */}
    <span
      style={{
        fontSize: "12px",
        fontWeight: "500",
        color: "#fff",
        background: "#007bff",
        padding: "4px 10px",
        borderRadius: "12px",
        width: "fit-content",
        letterSpacing: "0.5px",
        textTransform: "uppercase"
      }}
    >
        Quiz
    </span>

    {/* Title */}
    <span
      style={{
        fontSize: "16px",
        fontWeight: "600",
        color: "#2c3e50",
        lineHeight: "1.4",
        textTransform: "capitalize"
      }}
    >
      To Increase a Package
    </span>

    {/* Status */}
    <span
      style={{
        fontSize: "13px",
        fontWeight: "500",
        color: "#28a745"
      }}
    >
      Now
    </span>

  </div>
</div>
    </div>


    <div className="card" id="a9">
      <h2 className="title">Technical activities</h2>
      {[ 
        ...(data?.hackathons || []).map(i => ({ ...i, type: "Hackathon" })),
        ...(data?.internships || []).map(i => ({ ...i, type: "Internship" })),
        ...(data?.symposiums || []).map(i => ({ ...i, type: "Symposium" }))
      ].map((item, index) => (

        <div
          key={index}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "6px",
            padding: "16px 18px",
            margin: "12px 0",
            borderRadius: "14px",
            background: "#ffffff",
            boxShadow: "0 6px 15px rgba(0,0,0,0.08)",
            fontFamily: "Poppins, sans-serif",
            transition: "0.3s"
          }}
        >

          {/* Type Badge */}
          <span
            style={{
              fontSize: "12px",
              fontWeight: "500",
              color: "#fff",
              background:
                item.type === "Hackathon"
                  ? "#ff6b6b"
                  : item.type === "Internship"
                  ? "#007bff"
                  : "#6f42c1",
              padding: "4px 10px",
              borderRadius: "12px",
              width: "fit-content",
              letterSpacing: "0.5px",
              textTransform: "uppercase"
            }}
          >
            {item.type}
          </span>

          {/* Title */}
          <span
            style={{
              fontSize: "16px",
              fontWeight: "600",
              color: "#2c3e50",
              lineHeight: "1.4",
              textTransform: "capitalize"
            }}
          >
            {item.name}
          </span>

          {/* Description */}
          <span
            style={{
              fontSize: "13px",
              fontWeight: "500",
              color: "#555"
            }}
          >
            {item.description}
          </span>

        </div>

      ))}
    </div> 
   </div>
        </>
    );
}
export default Suc