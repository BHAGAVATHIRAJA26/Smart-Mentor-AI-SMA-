import axios from 'axios';
import "./App.css";
import F1 from "./assets/image.png";
import { useState } from "react";
import {useNavigate} from 'react-router-dom';

function App() {
  const [re,setre]=useState(false);
  const [lo,setlo]=useState(false);
  const [a1,seta1]=useState("");
  const [a2,seta2]=useState("");
  const [a3,seta3]=useState("");
  const [a4,seta4]=useState("");
  const [a5,seta5]=useState("");
  const [a6,seta6]=useState("");
  const [a7,seta7]=useState("");
  const [b1,setb1]=useState("");
  const [b2,setb2]=useState("");
  function ns(s){
  const speech = new SpeechSynthesisUtterance(s);
    speech.rate = 1;      // Speed (0.1 to 10)
    speech.pitch = 1;     // Voice pitch (0 to 2)
    speech.volume = 1;    // Volume (0 to 1)

    window.speechSynthesis.speak(speech);
}

  const navigate = useNavigate();
  function abc(){
    setre(true)
  }
  function logi(e){
    e.preventDefault();
    if(b1.length === 0 || b2.length === 0){
      alert("Invalid Message")
    }
    else{
    
     axios
      .post("http://127.0.0.1:5000/log",{b1,b2})
      .then((response)=>{
        if(response.data.message===false){
          alert("Invalid message")
        }
        else{
          alert("Successfully Login")
          ns(b1+"keep moving forward")
          navigate("/Suc/"+response.data.msg1+"/"+response.data.details[0].semester)
        }

      })
    }
  }
  function bcd(){
    setlo(true)
  }
  function regi(e){
    e.preventDefault();
    if(a1.length === 0 || a2.length === 0 || a3.length === 0 || a4.length === 0 || a5.length === 0 || a6.length === 0 || a7.length === 0){
      alert("Invalid Message")
    }
    else{
      alert(a1+a2+a3+a4+a5+a6+a7)
      axios
      .post("http://127.0.0.1:5000/reg",{a1,a2,a3,a4,a5,a6,a7})
      .then((response)=>{
        if(response.data.message===false){
          alert("Already Registered")
          setre(false)
        }
        else{
          alert("Successfully Registered")
          setre(false)
        }

      })
    }
    
  }
  return (
    <>
    <div id="a2" >
      <div>
      <span id="a1">Smart Mentor AI</span>
      <a href="#a4" style={{paddingLeft:"300px",color:"#3E4145",cursor:"pointer",fontSize:"19px",textDecoration: "none"}}>Features</a>
      <a href="#a5" style={{paddingLeft:"50px",color:"#3E4145",cursor:"pointer",fontSize:"19px",textDecoration: "none"}}>Achievements</a>
      <a  href="#footer" style={{paddingLeft:"50px",color:"#3E4145",cursor:"pointer",fontSize:"19px",textDecoration: "none"}}>Contacts</a>
      <a style={{paddingLeft:"380px",color:"#3E4145",cursor:"pointer",fontSize:"19px"}} onClick={abc}>Sign-In</a>
      <button type="button" className="btn btn-primary" style={{marginLeft:"20px"}} onClick={bcd}>Get Started</button>
    </div>
    
      <div style={{marginTop:"100px",display:"inline-block"}}>
        <div id="a3">Smarter Careers Powered by<span style={{color:"#6F63F2"}}> AI Intelligence</span>
        <p style={{color:"#3E4145",fontSize: "18px",paddingTop:"40px",textAlign: "justify"}}>AI-driven mentorship that guides students from computer fundamentals to final IT placement.
Personalized learning paths with continuous assessment, progress tracking, and smart scheduling.
Intelligent motivation, performance analysis, and placement-focused guidance powered by AI.</p>
        </div>
        <div style={{display:"inline-block",marginLeft:"100px"}} >
          <img src={F1} width={"550px"}  style={{
    border: "3px solid black",
    borderRadius: "14px"
  }}></img>        
          </div>
      </div>
    

      <div style={{paddingTop:"120px",paddingLeft:"350px"}} id="a4">Powerful AI Features</div>
      <p style={{color:"#3E4145",fontSize: "18px",paddingTop:"60px",textAlign: "justify",paddingLeft:"450px",paddingRight:"450px"}}>Discover how our advanced AI capabilities can transform student learning, skill development, and placement readiness.</p>
    
    
    
    <div id="container" style={{marginLeft:"90px"}}>

    <div className="card">
      <h2 className="title">Intelligent Automation</h2>
      <p className="desc">
        Automate repetitive tasks and workflows using advanced AI algorithms.
      </p>
    </div>

    <div className="card">
      <h2 className="title">Predictive Analytics</h2>
      <p className="desc">
        Analyze student performance to predict the best domain and career path.
      </p>
    </div>

    <div className="card">
      <h2 className="title">Personalized Learning Path</h2>
      <p className="desc">
        Generate a customized roadmap based on skills, interests, and goals.
      </p>
    </div>
    <div className="card">
      <h2 className="title">Daily Coding Assignment System</h2>
      <p className="desc">
        Automatically assign N problems daily based on difficulty and progress.
      </p>
    </div>

    <div className="card">
      <h2 className="title">Smart Schedule Management</h2>
      <p className="desc">
        Adjust study plans dynamically based on exams, availability, and deadlines.
      </p>
    </div>

    <div className="card">
      <h2 className="title">AI Voice and Alert System</h2>
      <p className="desc">
        Provide human-like reminders and wake-up alerts based on schedule and priorities.
      </p>
    </div>

  </div>
    <div style={{paddingTop:"120px",paddingLeft:"350px"}} id="a5">Our Achievements</div>
      <p style={{color:"#3E4145",fontSize: "18px",paddingTop:"60px",textAlign: "justify",paddingLeft:"450px",paddingRight:"450px"}}>AI-driven personalized learning and placement guidance from beginner level to successful IT job placement.
    </p>

        <div className="testimonials">
  <div className="card" style={{marginLeft:"0px"}}>
    <div className="stars">★★★★★</div>
    <p>
      "AIFlow has completely transformed our data analysis process.
      We're now able to make decisions 10x faster."
    </p>
    <h4><i className="bi bi-person-circle"></i> John Martinez</h4>
    <span>CEO, TechCorp</span>
  </div>

  <div className="card" style={{marginLeft:"50px"}}>
    <div className="stars">★★★★★</div>
    <p>
      "The automation features have saved us countless hours.
      Our team can now focus on strategy."
    </p>
    <h4><i className="bi bi-person-circle"></i> Sarah Chen</h4>
    <span>CTO, InnovateLab</span>
  </div>

  <div className="card" style={{marginLeft:"50px"}}>
    <div className="stars">★★★★★</div>
    <p>
      "Outstanding support and powerful AI tools.
      The ROI has been phenomenal."
    </p>
    <h4><i className="bi bi-person-circle"></i> Michael Rodriguez</h4>
    <span>VP Operations, DataFlow</span>
  </div>
</div>
    <div>
    <footer id="footer" style={{marginTop:"300px"}}>
  <div id="footer-container">

    
    <div id="footer-brand">
      <div id="brand">
        <span id="logo">🔊</span>
        <span id="brand-name">Smart Mentor AI</span>
      </div>

      <p id="brand-text" style={{ textAlign: "justify" }}>
        My project is an AI-based mentorship platform that provides personalized learning paths, placement guidance, and continuous performance tracking to help students make better career decisions and become industry-ready.
      </p>

      <div id="social-icons">
        <i className="bi bi-twitter"></i>
        <i className="bi bi-linkedin"></i>
        <i className="bi bi-github"></i>
        <i className="bi bi-whatsapp"></i>
      </div>
    </div>

 
    <div id="footer-product">
      <h4>Product</h4>
      <a href="#">Features</a>
      <a href="#">Pricing</a>
      <a href="#">API</a>
      <a href="#">Documentation</a>
    </div>


    <div id="footer-company">
      <h4>Company</h4>
      <a href="#">About</a>
      <a href="#">Blog</a>
      <a href="#">Careers</a>
      <a href="#">Contact</a>
    </div>

  </div>

  <div id="footer-bottom">
    <span>© 2024 Smart Mentor AI. All rights reserved.</span>
    <div id="policies">
      <a href="#">Privacy Policy</a>
      <a href="#">Terms of Service</a>
      <a href="#">Cookie Policy</a>
    </div>
  </div>
</footer>

    </div>
    </div>
    {re &&(
      <form onSubmit={regi}>
      <div id="pop">
            <div id="a6">
              <i className="bi bi-x fs-1" style={{marginLeft:"750px",cursor:"pointer"}} onClick={() => setre(false)}></i>
              <h4 style={{marginLeft:"50px"}}>Welcome! Let's Set Up Your Profile</h4>
              <p style={{color:"#3E4145",marginLeft:"50px"}}>Tell us about yourself to get personalized recommendations</p>
              

              <div style={{display:"inline-block",marginLeft:"50px",marginTop:"40px"}}>
                      <div className="form-group" style={{display:"inline-block"}}>
                      <label htmlFor="username">Username</label>
                      <input type="text" className="form-control" id="username" style={{width:"280px",marginTop:"5px"}} onChange={(e) => seta1(e.target.value)}/>
                      </div>

                      <div className="form-group" style={{display:"inline-block",marginLeft:"130px"}}>
                      <label htmlFor="exampleInputEmail1">Email address</label>
                      <input type="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" style={{width:"280px",marginTop:"5px"}} onChange={(e) => seta2(e.target.value)}></input>
                      
                      </div>
                        <div className="dropdown" style={{display:"inline-block",marginLeft:"0px",marginTop:"40px"}}>
                          <label>Select a Degree</label>
                          <br></br>
                        <button
                          className="btn btn-secondary dropdown-toggle"
                          type="button"
                          data-bs-toggle="dropdown" style={{marginTop:"5px"}}
                        >
                          Degree
                        </button>

                        <ul className="dropdown-menu">
                          <li><a className="dropdown-item" onClick={() => seta3("B.E/B.Tech")}>B.E/B.Tech</a></li>
                          <li><a className="dropdown-item" onClick={() => seta3("B.Sc")}>B.Sc</a></li>
                          <li><a className="dropdown-item" onClick={() => seta3("BCA")}>BCA</a></li>
                          <li><a className="dropdown-item" onClick={() => seta3("B.E/B.Tech")}>PG</a></li>
                          <li><a className="dropdown-item" onClick={() => seta3("Others")}>Others</a></li>
                        </ul>
                        </div>


                       <div className="dropdown" style={{display:"inline-block",marginLeft:"300px",marginTop:"40px"}}>
                          <label>Select a Branch</label>
                          <br></br>
                        <button
                          className="btn btn-secondary dropdown-toggle"
                          type="button"
                          data-bs-toggle="dropdown"  style={{marginTop:"5px"}}
                        >
                          Branch
                        </button>

                        <ul className="dropdown-menu">
                          <li><a className="dropdown-item" onClick={() => seta4("CSE")}>CSE</a></li>
                          <li><a className="dropdown-item" onClick={() => seta4("IT")}>IT</a></li>
                          <li><a className="dropdown-item" onClick={() => seta4("ECE")}>ECE</a></li>
                          <li><a className="dropdown-item" onClick={() => seta4("EEE")}>EEE</a></li>
                          <li><a className="dropdown-item" onClick={() => seta4("Others")}>Others</a></li>
                        </ul>
                        </div></div>
                        <div style={{display:"inline-block",marginLeft:"50px",marginTop:"40px"}}>
                      <div className="form-group" style={{display:"inline-block"}}>
                      <label htmlFor="user">Enroll-Year</label>
                      <input type="Number" className="form-control" id="user" style={{width:"280px",marginTop:"5px"}} onChange={(e) => seta5(e.target.value)}/>
                      </div>
                      </div>
                      <div style={{display:"inline-block",marginLeft:"130px"}}>
                      <div className="form-group" style={{display:"inline-block"}}>
                      <label htmlFor="name">Current Semester</label>
                      <input type="Number" className="form-control" id="name" style={{width:"280px",marginTop:"5px"}} onChange={(e) => seta6(e.target.value)}/>
                      </div>
                      </div>

                       <label  style={{marginLeft:"50px",marginTop:"40px"}}>Descrption of target</label>
                      <div className="form-floating">
                        
                        <textarea className="form-control" placeholder="Leave a comment here" id="floatingTextarea" style={{marginTop:"10px",marginLeft:"50px",width:"700px"}} onChange={(e) => seta7(e.target.value)}></textarea>
                      
                      </div>
                      <button type="submit" className="btn btn-success" style={{marginTop:"50px",width:"92%",marginLeft:"30px"}}>Create Your Profile</button>
              
            </div>
      </div></form>
    )
    }

    {lo && (
      <form onSubmit={logi}>
      <div id="pop">
            <div id="a7">
              <i className="bi bi-x fs-1" style={{marginLeft:"520px",cursor:"pointer"}} onClick={() => setlo(false)}></i>
              <span id="a1" style={{marginLeft:"200px",marginTop:"-100px"}}>Welcome Back!</span>
              <p style={{color:"#3E4145",fontSize: "18px",paddingTop:"6px",paddingLeft:"180px"}}>Keep Moving Toward Success</p>
              
              
              <div style={{marginLeft:"150px",marginTop:"40px"}}>
                      <div className="form-group" style={{display:"inline-block"}}>
                      <label htmlFor="us">Username</label>
                      <input type="text" className="form-control" id="us" style={{width:"300px",marginTop:"5px"}} onChange={(e) => setb1(e.target.value)}/>
                </div>
              </div>
                         
              <div className="form-group" style={{marginLeft:"150px",marginTop:"40px"}}>
                      <label htmlFor="exampleInputEmail1">Email address</label>
                      <input type="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" style={{width:"300px",marginTop:"5px"}} onChange={(e) => setb2(e.target.value)}></input>
                      
              </div>
              <button type="submit" className="btn btn-success" style={{marginTop:"50px",width:"60%",marginLeft:"120px"}}>Let's Start Your Journey</button>
            </div>
            </div>
            </form>
    )}
    </>
  );
}
export default App;
