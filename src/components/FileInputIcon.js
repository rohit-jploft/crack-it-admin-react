import { IconButton } from '@mui/material';
import React, { useRef } from 'react';
import AttachFileIcon from '@mui/icons-material/AttachFile';
// import './FileInputIcon.css'; // Import your CSS file for styling

const FileInputIcon = ({file, setFile}) => {
  const fileInputRef = useRef(null);

  const handleFileInputChange = (e) => {
    const selectedFile = e.target.files[0];
    // Do something with the selected file, e.g., upload or process it
    console.log('Selected file:', selectedFile);
    setFile(selectedFile)
  };

  const handleIconClick = () => {
    // Trigger the file input when the icon is clicked
    fileInputRef.current.click();
  };

  return (
    <div className="file-input-container">
      <input type="file" ref={fileInputRef} onChange={handleFileInputChange} style={{ display: 'none' }} />

      <IconButton className="file-input-label" onClick={handleIconClick}>
        <AttachFileIcon />
      </IconButton>
    </div>
  );
};

export default FileInputIcon;
