import React, { useRef } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// import Attach from "../images/attach.svg";
import { IconButton } from "@mui/material";
import AttachmentIcon from '@mui/icons-material/Attachment';

const FileInputIcon = ({ file, setFile }) => {
  const fileInputRef = useRef(null);

  const handleFileInputChange = (e) => {
    const selectedFile = e.target.files[0];

    if (selectedFile) {
      const fileType = selectedFile.type;
      const acceptedTypes = ["audio/*", "application/pdf", "image/*"];
      if (acceptedTypes.some((type) => fileType.match(type))) {
        // File type is valid, you can handle the file here
        console.log("Selected file:", selectedFile);
        setFile(selectedFile);
      } else {
        toast.error(
          "Invalid file type. Please select an audio, PDF, or image file."
        );
        setFile();
        fileInputRef.current.value = "";
      }
    }
  };

  const handleIconClick = () => {
    fileInputRef.current.click();
  };

  const handleIconKeyDown = (e) => {
    if (e.key === "Enter" || e.key === "Space") {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="file-input-container">
      <ToastContainer />
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileInputChange}
        style={{ display: "none" }}
      />
      <IconButton onClick={handleIconClick}>
        <AttachmentIcon/>
      </IconButton>
      {/* <img
        className="attachment"
        src={Attach}
        alt="img"
        onClick={handleIconClick}
        onKeyDown={handleIconKeyDown}
      /> */}
    </div>
  );
};

export default FileInputIcon;
