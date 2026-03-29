import axios from "axios";
import "./App.css";
import { useAlarm } from "./useAlarm";
import { useState,useEffect,useRef} from "react";
import { useNavigate,useParams} from "react-router-dom";
function Im(){

    const navigate = useNavigate();
    const { id,sno } = useParams();
    const [rr,setrr]=useState(false);
    const [a1,seta1]=useState("");
    const [a2,seta2]=useState("");
    const [a3,seta3]=useState("");
    const [a4,seta4]=useState("");
    const [mic,setmic]=useState(false);
    const [im,setim]=useState([]);
    const recognitionRef = useRef(null);
    const fileRef = useRef();
    const [file, setFile] = useState(null);
    const [fileName, setFileName] = useState("");
    const [vi,setvi]=useState([]);
    const [ni,setni]=useState([]);
    const [my,setmy]=useState(true)
    const [fun,setfun]=useState(false);
    const [loading, setLoading] = useState(false);

 const [formData, setFormData] = useState({
    Subject: "",
    Date: ""
  });

 const [editIndex, setEditIndex] = useState(null);



  const handleFileChange = (e) => {
  const selectedFile = e.target.files[0];
  if (selectedFile) {
    setFile(selectedFile);        
    setFileName(selectedFile.name);
    
  }
};

const uploadFile = async () => {

  
  if (!file) {
    alert("Please select a file");
    return;
  }

  const formData = new FormData();
  formData.append("file", file);

  try {
     setLoading(true);
     
    const res = await axios.post(
      "http://127.0.0.1:5000/upload",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

   
    setvi(res.data.data);
    alert("File uploaded successfully ✅");
    setfun(true);
  } catch (err) {
    console.error(err);
    alert("Upload failed ❌");
  }
  finally {
    setLoading(false);  // ✅ STOP loading
  }
};


function ns(s){
  const speech = new SpeechSynthesisUtterance(s);
    speech.rate = 1;      // Speed (0.1 to 10)
    speech.pitch = 1;     // Voice pitch (0 to 2)
    speech.volume = 1;    // Volume (0 to 1)

    window.speechSynthesis.speak(speech);
}



function abcd(q,r){
  if (q===1){
      ns("Great Job"+id)
  }
axios.post("http://127.0.0.1:5000/scde", {r})

      setim(im.filter(user => user._id !== r));
}


function notu(){
  axios.post("http://127.0.0.1:5000/sdelete",{id:id})
  .then((response)=>{
    console.log(response.data.message)
    setni([])
  })
}

const handleDelete = (index) => {
  const updatedData = vi.filter((_, i) => i !== index);
  setvi(updatedData);
};


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
    console.log("");
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

    function wo(e){
      e.preventDefault();
      axios
      .post("http://127.0.0.1:5000/pa1",{a1,a2,a3,a4,id})
      .then((response)=>{
        if(response.data.message===true){
          alert("inserted")
          window.location.reload();
        }
      })
      setrr(false)
    }


 function az() {
    const formattedData = vi.map(item => ({
      subject: item.Subject,
      date: item.Date
    }));

    axios.post("http://127.0.0.1:5000/semcrud", {
      vi: formattedData,
      id: id
    })
    .then((response) => {
      console.log(response.data);

      // ✅ refresh after insert
      fetchData();
      setfun(false)
    })
    .catch(err => console.error(err));
  }

  // ------------------ GET ------------------
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

  // ------------------ SAFE FLATTEN ------------------
  const allSchedules = ni.flatMap(record =>
    record?.data?.study_schedule || []
  );


const handleChange = (e) => {
  const { name, value } = e.target;

  if (name === "Date") {
    const [year, month, day] = value.split("-");
    const formattedDate = `${day}-${month}-${year}`;

    setFormData({
      ...formData,
      [name]: formattedDate,
    });
  } else {
    setFormData({
      ...formData,
      [name]: value,
    });
  }
};

  // Add OR Update
  const handleSubmit = () => {
    if (!formData.Subject) {
      alert("Enter all fields");
      return;
    }

    if (editIndex !== null) {
      // UPDATE
      const updated = [...vi];
      updated[editIndex] = formData;
      setvi(updated);
      setEditIndex(null);
    } else {
      // ADD
      setvi([...vi, formData]);
    }

    // Reset form
    setFormData({
      Subject: "",
      Date: ""
    });
  };

  // Delete
  useAlarm(id);

  // Edit (fill form)
  const handleEdit = (index) => {
    setFormData(vi[index]);
    setEditIndex(index);
  };

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
        <h6 className='card' style={{width:"15%",height:"100%",marginLeft:"17px",paddingTop:"10px",textAlign:"center",display:"inline-block",cursor:"pointer"}} onClick={() => navigate("/Suc/"+id+"/"+sno)}>Dashboard</h6>
        <h6 className='card' style={{width:"15%",height:"100%",marginLeft:"17px",paddingTop:"10px",textAlign:"center",display:"inline-block",cursor:"pointer"}} onClick={() => navigate("/Place/"+id+"/"+sno)}>Placement / ChoiceSet</h6>
        <h6 className='card' style={{width:"15%",height:"100%",marginLeft:"17px",paddingTop:"10px",textAlign:"center",display:"inline-block",cursor:"pointer"}} onClick={() => navigate("/Problem/"+id+"/"+sno)}>Practice</h6>
        <h6 className='card' style={{width:"15%",height:"100%",marginLeft:"17px",paddingTop:"10px",textAlign:"center",display:"inline-block",cursor:"pointer"}} onClick={() => navigate("/Im/"+id+"/"+sno)}>Schedule</h6>
        <h6 className='card' style={{width:"15%",height:"100%",marginLeft:"17px",paddingTop:"10px",textAlign:"center",display:"inline-block",cursor:"pointer"}} onClick={() => navigate("/Chat/"+id+"/"+sno)}>AI Mentor</h6>
        <h6 className='card' style={{width:"15%",height:"100%",marginLeft:"17px",paddingTop:"10px",textAlign:"center",display:"inline-block",cursor:"pointer"}} onClick={() => navigate("/alert/"+id+"/"+sno)}>Alerts</h6>
        </div>
  


{loading && (
  <div style={{
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0,0,0,0.4)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 999
  }}>
    <div style={{
      background: "#fff",
      padding: "30px 40px",
      borderRadius: "12px",
      textAlign: "center",
      boxShadow: "0 10px 25px rgba(0,0,0,0.2)"
    }}>
      
      {/* Spinner */}
      <div style={{
        width: "40px",
        height: "40px",
        border: "5px solid #e5e7eb",
        borderTop: "5px solid #6366f1",
        borderRadius: "50%",
        margin: "0 auto 15px",
        animation: "spin 1s linear infinite"
      }}></div>

      <div style={{
        fontSize: "18px",
        fontWeight: "600",
        color: "#333"
      }}>
        ⏳ AI Generating Schedule...
      </div>

      <div style={{
        fontSize: "14px",
        color: "#777",
        marginTop: "5px"
      }}>
        Please wait a moment
      </div>
    </div>

    {/* Animation */}
    <style>
      {`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}
    </style>
  </div>



)}
        {my && (<div>
        <button id="ber4" style={{marginLeft:"150px",marginTop:"50px",color:"black",textSizeAdjust:"20px"}} onClick={() => setmy(false)}>AI ✨ Schedule</button>
       
      
      <div id="b1">
  <div id="b2">
    <span id="b3">📅 Academic Schedule</span>
    <button id="b4" onClick={() => setrr(true)}>+ Add Event</button>
  </div>

  <div id="b5">Upcoming Events ({im.length})</div>
  

  <div id="b7">Events</div>
  {im.map((item) => (
  <div id="b8" key={item._id}>
    <span id="b9">{item.type}</span>
    <span id="b10" style={{paddingLeft:"50px"}}>{item.title}</span>
    <p style={{marginTop:"10px"}}>{item.desc}</p>
    <div id="b11" style={{color:"red"}}>{new Date(item.date).toLocaleString()}</div>
    <center><button type="button" className="btn btn-primary " style={{marginTop:"10px"}} onClick={()=>abcd(1,item._id)}>Completed</button><button style={{marginTop:"10px",marginLeft:"30px"}} type="button" className="btn btn-danger" onClick={()=>abcd(0,item._id)}>Cancel</button></center>
  </div>))}

      {rr && (
        <form onSubmit={wo}>
        <div id="pop2" >
            <div id="b122">
                
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
      </select>

                <label id="b27">Title</label>
                <input id="b28" type="text" placeholder="Enter title" onChange={(e) => seta2(e.target.value)}/>

                <label id="b29">Date & Time</label>
                <input id="b30" type="datetime-local" onChange={(e) => seta3(e.target.value)}/>

                <label id="b31">Description</label>
                <textarea id="b32" rows="4" onChange={(e) => seta4(e.target.value)}></textarea>

                <button  type="submit" id="b33">Add Item</button>
              </div>

            </div>
      </div>
      </form>
      )}
</div>
</div>)}

{!my && (<div>
  <button id="d" style={{marginLeft:"100px",marginTop:"100px"}} onClick={() => setmy(true)}>Manual Schedule</button>
  
    <div
      style={{
        height: "100vh",
        marginTop:"-60px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "Arial, sans-serif",
      }}
      onClick={(e) => {
        if (e.target.dataset.upload) fileRef.current.click();
      }} 
    >
      <div
        style={{
          width: "550px",
          padding: "35px",
          borderRadius: "18px",
          background: "#fff",
          boxShadow: "0 12px 35px rgba(0,0,0,0.12)",
          textAlign: "center",
          transition: "0.3s",
        }}
      >
        <h2 style={{ marginBottom: "8px", color: "#222" }} id="funnn">
          Drag & Drop
        </h2>

        <p style={{ color: "#666", marginBottom: "25px", fontSize: "14px" }}>
          Upload Syllabus, Schedule or Image (PDF, JPG, PNG)
        </p>

        <div
          data-upload="true"
          style={{
            padding: "40px 20px",
            borderRadius: "15px",
            border: "2px dashed #a78bfa",
            background: "#f5f3ff",
            cursor: "pointer",
            marginBottom: "15px",
          }}
        >
          <p style={{ color: "#555" }}>
            Drop files here or click to upload
          </p>

          <span style={{ fontSize: "12px", color: "#888" }}>
            Supports: PDF, JPG, PNG
          </span>

          <br />

          <button
            data-upload="true"
            style={{
              marginTop: "15px",
              padding: "10px 24px",
              borderRadius: "10px",
              border: "none",
              background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
              color: "#fff",
              cursor: "pointer",
              boxShadow: "0 5px 15px rgba(99,102,241,0.4)",
            }}
          >
            ⬆ Upload Material
          </button>
        </div>

        {/* ✅ Hidden file input */}
        <input
          type="file"
          ref={fileRef}
          style={{ display: "none" }}
          onChange={handleFileChange}
        />

      <button id="ber4" style={{marginLeft:"00px",marginTop:"30px",color:"black",textSizeAdjust:"20px"}} onClick={uploadFile}>✨Generate</button>
        {/* ✅ Show file name */}
        {fileName && (
          <p style={{ color: "#333", fontSize: "14px", marginTop: "10px" }}>
            📄 Selected File: <strong>{fileName}</strong>
          </p>
        )}        
      </div>
    </div>

{fun &&(<div id="ax1">
  <h2 className="ax2">📚 Exam Planner</h2>

  {/* HEADER */}
  <div className="ax3 ax4">
    <span>Subject</span>
    <span>Date</span>
    <span>Edit</span>
    <span>Delete</span>
  </div>

  {/* LIST */}
  {vi?.map((item, index) => (
    <div className="ax3" key={index}>
      <span className="ax5">{item.Subject}</span>
      <span className="ax6">{item.Date}</span>

      <span>
        <button
          className="ax7 ax8"
          onClick={() => handleEdit(index)}
        >
          Edit
        </button>
      </span>

      <span>
        <button
          className="ax7 ax9"
          onClick={() => handleDelete(index)}
        >
          Delete
        </button>
      </span>
    </div>
  ))}


  <div className="ax10">
   
    <input
      type="text"
      name="Subject"
      placeholder="Enter Subject"
      value={formData.Subject}
      onChange={handleChange}
    />

    
    <input
      type="date"
      name="Date"
      value={formData.Date}
      onChange={handleChange}
    />

   
    <button
      className={`ax11 ${
        editIndex !== null ? "update" : "add"
      }`}
      onClick={handleSubmit}
    >
      {editIndex !== null ? "Update" : "Add"}
    </button>
  </div>

 
  <button className="ax12" onClick={az}>
    Schedule
  </button>
</div>

)}

<div className="aya1">
  <h2 className="aya2">📅 Study Schedule</h2>

  <div className="aya3 aya4">
    <span>Subject</span>
    <span style={{marginLeft:"20px"}}>Date Range</span>
    <span style={{marginLeft:"90px"}}>Type</span>
  </div>

 
  {allSchedules.length === 0 ? (
    <p className="aya10">No schedule found</p>
  ) : (
    allSchedules.map((item, index) => (
      <div className="aya3" key={index}>
        
        <span className="aya5">{item.subject}</span>

        <span className="aya6">
          {item.start_date} → {item.end_date}
        </span>

        <span className="aya7">{item.type}</span>

      </div>
    ))
  )}
  <button type="submit" id="b33a" className="btn btn-danger" onClick={notu}>
  Delete
</button>
  
</div>

</div>)}
        </>
    );
}
export default Im