
import React, { useState } from "react";
import axios from "axios";
import * as XLSX from "xlsx";

function App() {
  const [emailContent, setEmailContent] = useState("");
  const [status, setStatus] = useState(false);
  const [emailList, setEmailList] = useState([]);

  // Handle textarea
  const handleChange = (e) => {
    setEmailContent(e.target.value);
  };
 
  
  const handleFileChange = (e) => {
    const file = e.target.files[0];

    

    const reader = new FileReader();

     reader.onload = (e) => {
      const data = e.target.result;

      const workbook = XLSX.read(data, { type: "array" });

      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const emailList=XLSX.utils.sheet_to_json(worksheet, { header: 'A' })
      const totalemail=emailList.map(function(item){return item.A})
      console.log(totalemail)
      setEmailList(totalemail);
     }
    reader.readAsArrayBuffer(file);
  };

  // Send email
  const send = () => {
    if (!emailContent.trim()) {
      alert("Please enter email content");
      return;
    }

    if (emailList.length === 0) {
      alert("Please upload recipient file");
      return;
    }

    setStatus(true);

    axios.post("http://localhost:5000/sendemail", {
      emailContent,
      emailList
    })
      .then((response) => {
        alert("Email sent successfully!");
      })
      .catch((error) => {
        console.log(error);
        alert("Error occurred while sending email");
      })
      .finally(() => {
        setStatus(false);
      });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-indigo-100 to-purple-200 flex items-center justify-center p-6">

      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden">

        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-8 text-center">
          <h1 className="text-3xl font-bold text-white mb-2">
            Bulk Mailer
          </h1>
          <p className="text-blue-100">
            Send emails to multiple recipients easily
          </p>
        </div>

        <div className="p-8 space-y-6">

          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Email Content
            </label>

            <textarea
              className="w-full border border-gray-300 rounded-xl p-4 outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              placeholder="Write your email message here..."
              rows="8"
              value={emailContent}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Upload Recipients File
            </label>

            <input
              onChange={handleFileChange}
              type="file"
              accept=".csv,.xlsx,.xls"
              className="w-full border border-gray-300 rounded-xl p-3 bg-gray-50"
            />

            <p className="text-sm text-gray-500 mt-2">
              {emailList.length} recipient rows loaded
            </p>
          </div>

          <button
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold py-4 rounded-xl"
            onClick={send}
            disabled={status}
          >
            {status ? "Sending..." : "Send"}
          </button>

        </div>

        <div className="bg-gray-50 border-t p-4 text-center">
          Bulk Mailer
        </div>

      </div>
    </div>
  );
}

export default App;
