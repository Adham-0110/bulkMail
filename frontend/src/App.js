import {useState} from "react"
import axios from "axios"
import * as XLSX from "xlsx"


function App() {

const [msg,setMsg] = useState("")
const [status,setStatus] = useState(false)
const [emailList,setEList] = useState([])


const handleMsg = (evt)=>{
  setMsg(evt.target.value)
}

const handleSend = ()=>{
  setStatus(true)
  axios.post("http://localhost:5000/sendmail",{msg:msg,emailList:emailList}).then(function(data){
    if(data.data === true){
      alert("Emails Sent Successfully")
      setStatus(false)
    }
    else{
      alert("Failed to send Emails")
    }
  })
}

const handleFile = (evt)=>{
  const file = evt.target.files[0]
    console.log(file)

    const reader = new FileReader()
    reader.onload = function(evt){
        const data = evt.target.result
        const workbook = XLSX.read(data,{type:'binary'})
        const sheetName = workbook.SheetNames[0]
        const workSheet = workbook.Sheets[sheetName]
        const emailList = XLSX.utils.sheet_to_json(workSheet,{header:'A'})
        const totalEmail = emailList.map(function(item){
          return item.A
        })
        console.log(totalEmail)
        setEList(totalEmail)
    }
    reader.readAsBinaryString(file)
}

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-purple-900 to-black text-white flex flex-col items-center">
      {/* Navbar */}
      <nav className="w-full bg-gradient-to-r from-purple-800 to-indigo-800 py-4 shadow-lg">
        <div className="max-w-screen-xl mx-auto flex justify-between items-center px-5">
          <h1 className="text-3xl font-extrabold tracking-wide">BulkMail</h1>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="w-full h-[300px] flex flex-col justify-center items-center text-center">
        <h2 className="text-5xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 text-transparent bg-clip-text pb-4">
          Simplify Your Emailing Process
        </h2>
        <p className="mt-4 text-indigo-300">
          Drag, drop, and compose emails with ease!
        </p>
      </header>

      {/* Main Content */}
      <main className="flex-grow w-full max-w-screen-lg px-5 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Compose Email Section */}
          <section className="bg-black/50 backdrop-blur-md rounded-xl shadow-xl p-6">
            <h3 className="text-2xl font-bold text-indigo-300 mb-4">
              Compose Email
            </h3>
            <textarea
              onChange={handleMsg}
              value={msg}
              className="w-full h-40 p-4 bg-black/60 text-white border border-indigo-500 rounded-lg focus:outline-none focus:ring focus:ring-pink-500 resize-none"
              placeholder="Write your email content..."
            ></textarea>
          </section>

          {/* Upload Section */}
          <section className="bg-black/50 backdrop-blur-md rounded-xl shadow-xl p-6 flex flex-col items-center">
            <h3 className="text-2xl font-bold text-indigo-300 mb-4">Upload File</h3>
            <input
            onChange={handleFile}
              type="file"
              className="border-2 border-dashed border-pink-500 bg-gradient-to-r from-purple-900 to-indigo-900 text-white rounded-lg p-5 text-center focus:outline-none focus:ring focus:ring-purple-500"
            />
            <p className="mt-4 text-indigo-300 text-sm">
              Total Emails in File: {emailList.length}
            </p>
          </section>
        </div>

        {/* Action Button */}
        <div className="text-center mt-10">
          <button onClick={handleSend} className="bg-gradient-to-r from-pink-500 to-purple-500 py-3 px-8 text-lg font-medium rounded-full shadow-md hover:scale-105 transition-transform duration-300">
           {status?"Sending...":"Send Emails"} 
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full bg-gradient-to-r from-purple-800 to-indigo-800 py-4 text-center shadow-inner">
        <p className="text-sm text-indigo-300">© 2025 BulkMail. Efficient and Reliable Emailing.</p>
      </footer>
    </div>
  );
}

export default App;
