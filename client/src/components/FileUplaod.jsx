import { useState } from "react";
import axios from "axios";
import { pinata } from "../utils/pinataSetup";


const FileUpload = ({ contract, account, provider }) => {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("No image selected");
  const [uploading, setUploading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (file) {
      try {
        setUploading(true);
        const upload = await pinata.upload.file(file)
        console.log(`upload`, upload);
        const tx = await contract.add(account, upload.cid);
        await tx.wait();
        setFileName("No image selected");
        setFile(null);
      } catch (e) {
        console.log(e)
      }
      finally {
        setUploading(false);
        alert("Successfully Image Uploaded");
        setFileName("No image selected");
        setFile(null);
      }
    }

  };

  const retrieveFile = (e) => {
    e.preventDefault();
    const data = e.target.files[0];
    setFile(data);
    setFileName(data.name);
  };

  return (
    <div className="w-full max-w-lg mx-auto p-6 bg-gray-800 rounded-lg shadow-md">
      <form className="flex flex-col items-center" onSubmit={handleSubmit}>
        <label
          htmlFor="file-upload"
          className="bg-blue-600 text-white py-2 px-4 rounded-lg cursor-pointer hover:bg-blue-700 transition-colors duration-300 mb-4"
        >
          Choose Image
        </label>
        <input
          disabled={!account}
          type="file"
          id="file-upload"
          name="data"
          onChange={retrieveFile}
          className="hidden"
        />

        <span className="text-gray-300 mb-4">Image: {fileName}</span>

        <button
          type="submit"
          className={`py-2 px-6 rounded-lg font-semibold text-white ${file
              ? "bg-green-500 hover:bg-green-600"
              : "bg-gray-500 cursor-not-allowed"
            } transition-colors duration-300`}
          disabled={!file}
        >
          {
            uploading ? "Uploading..." : "Upload"
          }
        </button>
      </form>
    </div>
  );
};

export default FileUpload;
