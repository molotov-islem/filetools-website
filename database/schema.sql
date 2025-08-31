-- Database schema for FileTools application
CREATE DATABASE IF NOT EXISTS filetools;
USE filetools;

-- Tools table
CREATE TABLE IF NOT EXISTS tools (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100),
    icon VARCHAR(50),
    is_featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert sample tools
INSERT INTO tools (name, description, category, icon, is_featured) VALUES
('PDF to Word', 'Convert PDF files to editable Word documents', 'PDF Tools', 'file-text', TRUE),
('Image Converter', 'Convert between different image formats (JPG, PNG, WebP)', 'Image Tools', 'image', TRUE),
('PDF Compressor', 'Reduce PDF file size without quality loss', 'PDF Tools', 'compress', TRUE),
('Video Converter', 'Convert video files between different formats', 'Video Tools', 'video', FALSE),
('Audio Converter', 'Convert audio files to MP3, WAV, FLAC', 'Audio Tools', 'audio', FALSE),
('Archive Extractor', 'Extract files from ZIP, RAR, 7Z archives', 'Archive Tools', 'archive', FALSE);

-- Users table (for future features)
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Conversion history table (for future features)
CREATE TABLE IF NOT EXISTS conversions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tool_id INT,
    user_id INT NULL,
    file_name VARCHAR(255),
    file_size INT,
    conversion_time DECIMAL(5,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (tool_id) REFERENCES tools(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
);
