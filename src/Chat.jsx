import axios from "axios";
import "./App.css";
import { useState,useRef } from "react";
import { useAlarm } from "./useAlarm";
import ReactMarkdown from "react-markdown";
import { useNavigate,useParams} from "react-router-dom";
function Chat(){
     const { id,sno  } = useParams();
    const navigate = useNavigate();
    const recognitionRef = useRef(null);
    const [mic,setmic]=useState(false);
    const [text, setText] = useState("");
    const [ch,setch]=useState(true);
    const [rr,setrr]=useState("");
    const [text1,settext1]=useState("");

const formatResponse = (text) => {
  return text
    // Convert **Title:** → proper heading
    .replace(/\*\*(.*?)\*\*:/g, "\n## $1\n")

    // Convert numbered list → markdown list
    .replace(/^\d+\.\s/gm, "- ")

    // Convert * → -
    .replace(/^\*\s/gm, "- ")

    // Fix Java/Python/C++ sections
    .replace(/###\s/g, "\n### ")

    // IMPORTANT: DO NOT break all lines
    .replace(/\n{2,}/g, "\n\n"); // keep only proper spacing
};


    function ac(){
      settext1(text)
      axios
      .post("http://127.0.0.1:5000/cb",{cb:text})
      .then((response)=>{
        setrr(response.data.message)
      })
      setch(false);
      setText("")
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
  recognition.continuous = true;   // ✅ Keep listening
  recognition.interimResults = false;

  recognition.onstart = () => {
    console.log("🎤 Mic started (Continuous Mode)");
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
        console.log("AI Message: " + response.data.message);
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

        
<div id="c1" style={{marginLeft:"175px",marginTop:"50px"}}>

    {!ch &&(<div className="chat-container">

  {/* USER MESSAGE */}
  <div className="chat-user">
    {text1}
  </div>

  {/* AI MESSAGE */}
  <div className="chat-ai">
    <ReactMarkdown
      components={{
        h1: (props) => <h1 className="chat-h1" {...props} />,
        h2: (props) => <h2 className="chat-h2" {...props} />,
        h3: (props) => <h3 className="chat-h3" {...props} />,
        p: (props) => <p className="chat-p" {...props} />,
        li: (props) => <li className="chat-li" {...props} />,
        pre: (props) => <pre className="chat-pre" {...props} />,
        code: (props) => <code className="chat-code" {...props} />
      }}
    >
      {formatResponse(rr)}

    </ReactMarkdown>
  </div>

</div>)}

   {ch &&(<div>
    <div id="c2">🎓</div>

   
    <h2 id="c3">Hello, Student</h2>
    <h1 id="c4">How can Smart Mentor AI assist you today?</h1>

  <div id="c8">

      <div id="c9">
        <h3>📘 Generating Learning Path</h3>
        <p>Guided roadmap for coding & CS fundamentals</p>
      </div>

      <div id="c10">
        <h3>💼 Domain Recommendations
</h3>
        <p>Learning & Projects</p>
      </div>

      <div id="c11">
        <h3>Motivational Guide</h3>
        <p>24/7 personalized mentoring support</p>
      </div>

    </div>


    </div>)}
   <div id="c5" style={{marginTop:"30px",marginTop:"100px"}}>

  <input
    id="c6"
    type="text" style={{paddingLeft:"50px"}} value={text}
    placeholder="Ask about placements, coding, roadmap..." onChange={(e) => setText(e.target.value)}
  />


  
  <button id="c14" onClick={ac}>➤</button>
</div>


   
    

  </div>




<br></br><br></br><br></br><br></br><br></br>

    </>
    );
}
export default Chat