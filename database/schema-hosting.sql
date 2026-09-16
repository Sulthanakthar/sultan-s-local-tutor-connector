CREATE TABLE IF NOT EXISTS tutors (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  department VARCHAR(100) NOT NULL,
  subjects VARCHAR(255) NOT NULL,
  available_time VARCHAR(120) NOT NULL,
  mode ENUM('Online','Offline','Both') NOT NULL DEFAULT 'Both',
  contact VARCHAR(150) NOT NULL,
  bio VARCHAR(500) DEFAULT '',
  country VARCHAR(80) NOT NULL DEFAULT 'India',
  languages VARCHAR(180) NOT NULL DEFAULT 'English',
  rating DECIMAL(2,1) NOT NULL DEFAULT 5.0,
  sessions_completed INT UNSIGNED NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS help_requests (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  student_name VARCHAR(100) NOT NULL,
  subject VARCHAR(100) NOT NULL,
  topic VARCHAR(180) NOT NULL,
  description VARCHAR(700) NOT NULL,
  preferred_time VARCHAR(120) NOT NULL,
  mode ENUM('Online','Offline','Either') NOT NULL DEFAULT 'Either',
  contact VARCHAR(150) NOT NULL,
  status ENUM('Open','Closed') NOT NULL DEFAULT 'Open',
  country VARCHAR(80) NOT NULL DEFAULT 'India',
  languages VARCHAR(180) NOT NULL DEFAULT 'English',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS study_rooms (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(160) NOT NULL,
  subject VARCHAR(100) NOT NULL,
  host_name VARCHAR(100) NOT NULL,
  scheduled_time VARCHAR(120) NOT NULL,
  country VARCHAR(80) NOT NULL,
  languages VARCHAR(180) NOT NULL,
  level ENUM('Beginner','Intermediate','Advanced') NOT NULL,
  capacity INT UNSIGNED NOT NULL DEFAULT 12,
  status ENUM('Scheduled','Live','Closed') NOT NULL DEFAULT 'Scheduled',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS room_members (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  room_id INT UNSIGNED NOT NULL,
  student_name VARCHAR(100) NOT NULL,
  email VARCHAR(150) DEFAULT '',
  joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY unique_room_member (room_id, student_name),
  CONSTRAINT fk_room_member FOREIGN KEY (room_id) REFERENCES study_rooms(id) ON DELETE CASCADE
);

INSERT INTO tutors (name,department,subjects,available_time,mode,contact,bio,country,languages,rating,sessions_completed) VALUES
('Ananya Rao','MCA - Sacred Heart College','DBMS, SQL','Mon-Fri, 4:00-6:00 PM IST','Both','ananya@college.edu','Database mentor focused on normalization and query practice.','India','English, Tamil, Hindi',4.9,38),
('Mei Lin','Computer Science - NUS','Python, Data Science','Tomorrow, 7:00 PM SGT','Online','mei@university.edu','Practical support for pandas, statistics and machine learning.','Singapore','English, Mandarin',4.8,52),
('Haruto Sato','Engineering - University of Tokyo','Java, Algorithms','Saturday, 10:00 AM JST','Online','haruto@university.edu','Java problem solving and algorithm walkthroughs.','Japan','English, Japanese',4.9,44);

INSERT INTO help_requests (student_name,subject,topic,description,preferred_time,mode,contact,country,languages) VALUES
('Kavin M','DBMS','Normalization','Need help understanding 2NF, 3NF and practice questions.','Wednesday after 4 PM','Offline','kavin@college.edu','India','English, Tamil'),
('Meena P','Java','Exception handling','Looking for a one-hour session with simple coding examples.','Friday 5 PM','Online','meena@college.edu','India','English');

INSERT INTO study_rooms (title,subject,host_name,scheduled_time,country,languages,level,capacity,status) VALUES
('DBMS Exam Sprint','DBMS','Ananya Rao','Live now - 45 min','India','English, Tamil','Intermediate',16,'Live'),
('Python Data Lab','Data Science','Mei Lin','Today - 7:00 PM SGT','Singapore','English, Mandarin','Beginner',12,'Scheduled'),
('Algorithms Together','Algorithms','Haruto Sato','Saturday - 10:00 AM JST','Japan','English, Japanese','Advanced',20,'Scheduled');
