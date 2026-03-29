import axios from "axios";
import "./App.css";
import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";

function Alert() {

  const { id, sno } = useParams();
  const navigate = useNavigate();
  const recognitionRef = useRef(null);

  const [rr, setrr] = useState(false);
  const [iq, setiq] = useState([]);
  const [mic, setmic] = useState(false);

  const [a1, seta1] = useState("");
  const [a2, seta2] = useState("");
  const [a3, seta3] = useState("");

  const triggered = useRef(new Set());

  // ✅ DELETE
  function abcd(v) {
    axios.post("http://127.0.0.1:5000/alde", { v })
      .then(() => {
        setiq(prev => prev.filter(item => item._id !== v));
      });
  }

  // 🎤 MIC OFF
  function speak() {
    setmic(false);
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    window.speechSynthesis.speak(
      new SpeechSynthesisUtterance("MIC TURN OFF")
    );
  }

  // 🎤 MIC ON
  function speak1() {
    setmic(true);

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.continuous = true;

    recognition.onresult = (event) => {
      const text = event.results[event.results.length - 1][0].transcript;

      axios.post("http://127.0.0.1:5000/conapi", {
        message: text
      })
        .then((response) => {
          window.speechSynthesis.speak(
            new SpeechSynthesisUtterance(response.data.message)
          );
        });
    };

    recognitionRef.current = recognition;
    recognition.start();
  }

  // 🔊 ALARM SOUND
  const playAlarm = (message) => {
    const speak = () => {
      const speech = new SpeechSynthesisUtterance(message);
      window.speechSynthesis.speak(speech);
    };

    const interval = setInterval(speak, 3000);

    setTimeout(() => {
      clearInterval(interval);
      window.speechSynthesis.cancel();
    }, 40000);
  };

  // 📥 FETCH ALARMS
  useEffect(() => {
    if (!id) return;

    axios.get("http://127.0.0.1:5000/aldb", { params: { id } })
      .then(res => setiq(res.data))
      .catch(err => console.error(err));

  }, [id]);

  // ⏰ TIME CHECK (FIXED LOGIC)
  useEffect(() => {

    if (iq.length === 0) return;

    const interval = setInterval(() => {
      const now = new Date();

      iq.forEach(alarm => {
        const alarmTime = new Date(alarm.date);

        const diff = alarmTime - now;

        // ✅ FIXED CONDITION (VERY IMPORTANT)
        if (diff <= 5000 && diff > -5000 && !triggered.current.has(alarm._id)) {
          playAlarm(alarm.ring);
          triggered.current.add(alarm._id);
        }
      });

    }, 3000);

    return () => clearInterval(interval);

  }, [iq]);

  // ➕ ADD ALARM
  function ia(e) {
    e.preventDefault();

    const formattedDate = new Date(a3).toISOString(); // ✅ FIX

    axios.post("http://127.0.0.1:5000/al", {
      a1,
      a2,
      a3: formattedDate,
      id
    })
      .then(res => {
        if (res.data.message === true) {
          alert("Alarm set ✅");
          window.location.reload();
        }
      });
  }

  // 🔊 TEST SOUND
  function ns(s) {
    const speech = new SpeechSynthesisUtterance(s);
    window.speechSynthesis.speak(speech);
  }

  // 🔓 UNLOCK AUDIO (IMPORTANT)
  useEffect(() => {
    const unlock = () => {
      const speech = new SpeechSynthesisUtterance(" ");
      window.speechSynthesis.speak(speech);
    };

    document.addEventListener("click", unlock, { once: true });

    return () => document.removeEventListener("click", unlock);
  }, []);



    
    return (
        <>
        <div id="a">
    <div id="b">🎓 Smart Mentor AI</div>

    <div id="c">
      {mic && (<button id="d"  onClick={speak}><i className="bi bi-mic-fill"></i>Voice On</button>)}
    {!mic && (<button id="d" onClick={speak1}><i className="bi bi-mic-mute"></i>Voice Off</button>)}
      <div id="e"></div>
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
       

        <div id="b1">
  <div id="b2">
    <span id="b3"><i className="bi bi-alarm"></i> Alarms</span>
    <button id="b4" onClick={() => setrr(true)}>+ Add Alerts</button>
  </div>

  <div id="b5">Total Alarms ({iq.length})</div>
  
  {iq.map((item) => (
  <div id="b8" key={item._id}>
    <center><div id="b5">{item.type}</div></center>
    <p style={{marginTop:"10px"}}></p>
    <div id="b11" style={{color:"blue",display:"inline-block",marginLeft:"20px"}}>Timing:{new Date(item.date).toLocaleString()}</div><div style={{display:"inline-block",marginLeft:"800px"}} id="b5"><button type="button" className="btn btn-primary " style={{marginTop:"10px"}} onClick={() => ns(item.ring)}><i className="bi bi-volume-up-fill"></i>Test Your Alarm</button></div>
    <center><button type="button" className="btn btn-primary " style={{marginTop:"10px"}}>Snooze</button><button style={{marginTop:"10px",marginLeft:"30px"}} type="button" className="btn btn-danger" onClick={()=>abcd(item._id)}>Cancel</button></center>
  </div>))}
  </div>
        {rr && (
          <form onSubmit={ia}>
          <div id="pop2" >
            <div id="b122" >
                
                    <div id="b21">
                <div id="b22">
                  <span id="b23">Add Schedule Item</span>
                  <span id="b24" onClick={() => setrr(false)}>✕</span>
                </div>

                <label id="b25">Type</label>
                <select
                  id="b26"
                  onChange={(e) => seta1(e.target.value)}>
                  <option value="">Select Type</option>
                  <option value="Assignment">Assignment</option>
                  <option value="Class">Class</option>
                  <option value="Exam">Exam</option>
                  <option value="LeetCode Solver Alarm">LeetCode Solver Alarm</option>
                </select>

                <label id="b27">Rington</label>
                <input id="b28" type="text" placeholder="Enter a Rington && Use Mic" onChange={(e) => seta2(e.target.value)}/>

                <label id="b29">Date & Time</label>
                <input id="b30" type="datetime-local" onChange={(e) => seta3(e.target.value)}/>

            

                <button id="b33">Add Item</button>
              </div>

            </div>
      </div>
      </form>
      )}







    </>
    );
}
export default Alert




