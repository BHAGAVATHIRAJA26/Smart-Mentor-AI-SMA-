import "./App.css";
import { useState,useRef,useEffect} from "react";
import axios from "axios";
import { useAlarm } from "./useAlarm";
import { useNavigate,useParams} from 'react-router-dom';
function Place(){

    const recognitionRef = useRef(null);
    const [mic,setmic]=useState(false);
    const { id,sno  } = useParams();
    const [qu,setqu]=useState(false);
    const [questions,setquestions]=useState([]);
    const [si,setsi]=useState({});
    const [bd,setbd]=useState({});
    
  function abcd(type){
    setqu(true)
    axios.post("http://127.0.0.1:5000/qude",{type:type,id:id})
    .then((response)=>{
        
        setquestions(response.data.questions)
      })
  }

  const [selectedAnswers, setSelectedAnswers] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(null);

  const handleOptionChange = (questionIndex, optionIndex) => {
    const newSelectedAnswers = [...selectedAnswers];
    newSelectedAnswers[questionIndex] = optionIndex;
    setSelectedAnswers(newSelectedAnswers);
  };

  const handleSubmit = () => {
    let correctCount = 0;
    questions.forEach((q, index) => {
      if (selectedAnswers[index] === q.correct) {
        correctCount++;
      }
    });
    setScore(correctCount);
    setSubmitted(true);
    axios.post("http://127.0.0.1:5000/update_quiz_score", {
    id: id,
    score: correctCount
  })
  .then((res) => {
    console.log("Score updated:", res.data);
  })
  .catch((err) => {
    console.error(err);
  });
  };

  const handleRetake = () => {
    setSelectedAnswers(Array(questions.length).fill(null));
    setSubmitted(false);
    setScore(null);
  };

  const getMotivationalNote = () => {
    if (score === null) return '';
    const percentage = (score / questions.length) * 100;
    if (percentage >= 80) return "🌟 Excellent! You're a star! Keep shining!";
    if (percentage >= 50) return "👍 Good job! Keep learning and you'll master it!";
    return "💪 Don't worry, practice makes perfect. Try again!";
  };

useEffect(() => {
  axios.get("http://127.0.0.1:5000/career")
    .then((res) => {
      setsi(res.data);
      
    })
    .catch((err) => console.error(err));
}, []);

useEffect(() => {
  axios.get("http://127.0.0.1:5000/carv", {
    params: { id }
  })
  .then((res) => {
    setbd(res.data);
    
  })
  .catch((err) => console.error(err));

}, [id]); 

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
  
  const navigate=useNavigate();
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

          <br></br><br></br>
        {!qu && (<div>
        
         <div style={{ textAlign: "center",marginLeft:"-850px" }}>
  <div id="a3">Placement / ChoiceSet</div>
</div>
<div id="h1">
  <div id="h2">
    <h3 id="h3">Placement Readiness Score</h3>
    <p id="h4">Your overall readiness for campus placements</p>
  </div>

  <div id="h5">{12*sno}%</div>

  <div id="h6">
    <div id="h7" style={{ width: `${175*sno}px` }}></div>
  </div>
</div>



 <div id="a3" style={{paddingLeft:"-300px"}}>Academic Journey</div>
          <div id="g1" style={{marginTop:"50px"}}>
 


  <div id="g3">

 
    <div id="g4">
      <div id="g5">
        <span id="g6">✓</span>
        <div>
         <h1 className="title">Top Language</h1>
        </div>
      </div>

      <b id="g7" >Programming Language</b>
          <br></br><h1></h1>
      <div id="g8">
       
   <strong>{si?.programming_language?.name}</strong>

        <span>Selected Language</span>
      </div>

      <div id="g9">
        <div id="g10"></div>
      </div>
    </div>

    <div id="g11">
      <div id="g12">
        <span id="g13">🎓</span>
        <div>
         <h1 className="title">Top Domain</h1>
          <p>Selected</p>
        </div>
      </div>

      <b id="g14">Domain Specialization</b>
      <br></br><h1></h1>
          
                <div id="g15">
       
   <strong>{si?.domain?.name}</strong>
        <span>Selected Domain</span>
      </div>
          <div id="g9">
        <div id="g10"></div>
      </div>
      
    </div>


    <div id="g18">
      <div id="g19">
        <span id="g20">⏳</span>
        <div>
          <h1 className="title">Top Projects</h1>
          <p>Recommended</p>
        </div>
      </div>

      <b id="g21">Project Selection</b>
<br></br><h1></h1>
      <div id="g15">
        
{si?.domain?.projects?.map((proj, index) => (
    <p key={index}>{proj.name}</p>
  ))}
    </div><div>
  
        
      </div>
     
          
    </div>

  </div>
</div>

<div id="a3" style={{paddingLeft:"0px"}}>Placement Progress</div>

              <div id="f11" >
  <div id="f12" style={{marginLeft:"30px"}}>

    <div id="f13" >
      <div id="f14">
        <span id="f15">Problem Solving</span>
        <span id="f16">&lt;/&gt;</span>
      </div>

      <div id="f17">
        <span>Current Level</span>
        <span>Improve</span>
      </div>

      <div id="f18">
        <div id="f19"></div>
      </div>

      <div id="f20">
        <span>Problems Solved</span>
        <span>{bd.quizcorrect}/10</span>
      </div>

      <div id="f21">
        <span>Success Rate</span>
        <span>{(bd.quizcorrect/10)*100}%</span>
      </div>

      <button id="f22" onClick={() => abcd("cs")}>Solve Problems</button>
    </div>

    <div id="f23">
      <div id="f24">
        <span>Aptitude Learning</span>
        <span id="f25">◐</span>
      </div>

      <div id="f26">
        <span>Overall Progress</span>
        <span>Improve</span>
      </div>

      <div id="f27">
        <div id="f28"></div>
      </div>

      <div id="f29">
        <span>Topics Remaining</span>
        <span>{bd.quizcorrect}/10</span>
        
      </div>

      <div id="f30">
        <span>Average Score</span>
        <span>{(bd.quizcorrect/10)*100}%</span>
   
      </div>

      <button id="f31" onClick={()=>abcd("aptitude")} >Continue Learning</button>
    </div>

    <div id="f32">
      <div id="f33">
        <span>Voice Chat</span>
        <span id="f34">🎤</span>
      </div>

      <div id="f35">
        <span>Communication Score</span>
        <span>Improve</span>
      </div>

      <div id="f36">
        <div id="f37"></div>
      </div>

      <div id="f38">
        <span>Sessions Completed</span>
        <span>{bd.quizcorrect}</span>
        
      </div>

      <div id="f39">
        <span>Grammar Accuracy</span>
        <span>{(bd.quizcorrect/10)*100}%</span>
      </div>
      <button id="f40" onClick={()=>abcd("verbal")}>Start Practice</button>
    </div>
  </div>
</div>
</div>)}

{qu && (<div className="app">
      <div className="quiz-card">
        <h1 className="title">✨ Quiz Challenge ✨</h1>
        <p className="subtitle">Test your knowledge with 10 exciting questions</p>

        {!submitted ? (
          <>
            {questions.map((q, qIndex) => (
              <div key={q.id} className="question-container">
                <div className="question">
                  {qIndex + 1}. {q.question}
                </div>
                <div className="options">
                  {q.options.map((option, oIndex) => {
                    const isSelected = selectedAnswers[qIndex] === oIndex;
                    return (
                      <label
                        key={oIndex}
                        className={`option-label ${isSelected ? 'selected' : ''}`}
                      >
                        <input
                          type="radio"
                          name={`question-${qIndex}`}
                          value={oIndex}
                          checked={isSelected}
                          onChange={() => handleOptionChange(qIndex, oIndex)}
                          className="radio-input"
                        />
                        {option}
                      </label>
                    );
                  })}
                </div>
              </div>
            ))}

            <div className="button-container">
              <button className="submit-btn" onClick={() => setqu(false)}> Back</button>
              <button
                className="submit-btn"
                onClick={handleSubmit}
                disabled={selectedAnswers.includes(null)}
              >
                Submit Quiz
              </button>
            </div>
          </>
        ) : (
          <div className="result-card">
            <h2>Your Score</h2>
            <div className="score">
              {score} / {questions.length}
            </div>
            <div className="motivational-note">{getMotivationalNote()}</div>
            <div className="button-container">
              <button className="retake-btn" onClick={handleRetake}>
                🔄 Retake Quiz
              </button>
            </div>
          </div>
        )}
      </div>
    </div>

      )}

        </>
    );
}
export default Place