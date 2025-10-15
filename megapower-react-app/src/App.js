import React, {  } from "react";
import { BrowserRouter as Router, Route, Routes,  } from 'react-router-dom';

import './App.css';

import { Login } from "./Login";

import { ForgotPassword  } from "./Forgotpw";

import { Reset } from "./Resetpw";

import { Dashboard } from "./Dashboard";
import { StaffDashboard } from "./staffDashboard";
import { MemberDashboard } from "./MemberDashboard";

import { Admin } from "./Admin";

import { Staff } from "./staff";
import StaffTable   from "./staffTable";
import { EditStaff } from "./Editstaff";

import {Member  } from "./Member";
import {MemberTable  } from "./MemberTable";
import {EditMember  } from "./EditMember";

import {Equipment  } from "./Equipment";
import {EditEquipment  } from "./EditEquipment";
import Equipmenttable   from "./Equipmenttable";

import {Schedule  } from "./Schedule";
import {Scheduletable  } from "./Scheduletable";
import {EditSchedule  } from "./EditSchedule";


import {Attendance  } from "./Attendance";
import {EditAttendance  } from "./EditAttendance";
import {Attendancetable  } from "./Attendancetable";

import {Payment  } from "./Payment";
import {Paymenttable}   from "./Paymenttable";


import {Announcement  } from "./Announcement";
import {EditAnnouncement  } from "./EditAnnouncement";
import {Announcementtable}   from "./Announcementtable";

import Chat   from "./Chat";
import {Trainerrate  } from "./Trainerrate";
import {Trainerratetable  } from "./Trainerratetable";

import {Feedback  } from "./Feedback";
import {EditFeedback  } from "./EditFeedback";
import {Feedbacktable  } from "./Feedbacktable";

import {Appoinment  } from "./Appoinment";
import {EditAppoinment  } from "./EditAppoinment";
import {Appoinmenttable  } from "./Appoinmenttable";





















function App() {

  

 
  
  return (

    

    <div className="App">


  <Router>

     <Routes>

    
        <Route path="/" element={<Login />} />
        
        <Route path="/Forgotpw" element={<ForgotPassword  />} />
        
        <Route path="/Resetpw" element={<Reset />} />
        <Route path="/Dashboard" element={<Dashboard />} />
        <Route path="/StaffDashboard" element={<StaffDashboard />} />
        <Route path="/MemberDashboard" element={<MemberDashboard />} />
        
        
        <Route path="/Admin" element={<Admin />} />
        <Route path="/staff" element={<Staff />} />
        <Route path="/Member" element={<Member />} />
        <Route path="/Equipment" element={<Equipment />} />
        <Route path="/Trainerrate" element={<Trainerrate />} />
        
        <Route path="/Schedule" element={<Schedule />} />
        <Route path="/Attendance" element={<Attendance />} />
        <Route path="/Payment" element={<Payment />} />
        <Route path="/Paymenttable" element={<Paymenttable />} />

        
        <Route path="/Chat" element={<Chat />} />
        <Route path="/Announcement" element={<Announcement />} />
        <Route path="/Announcementtable" element={<Announcementtable />} />
        <Route path="/Feedback" element={<Feedback />} />
        <Route path="/Appoinment" element={<Appoinment />} />
        <Route path="/MemberTable" element={<MemberTable />} />
        <Route path="/StaffTable" element={<StaffTable />} />
        <Route path="/Equipmenttable" element={<Equipmenttable />} />
        <Route path="/Appoinmenttable" element={<Appoinmenttable />} />
        <Route path="/Scheduletable" element={<Scheduletable />} />
        <Route path="/Attendancetable" element={<Attendancetable />} />
        <Route path="/Trainerratetable" element={<Trainerratetable />} />
        <Route path="/Feedbacktable" element={<Feedbacktable />} />

        <Route path="/Equipment/:id" element={<EditEquipment />} />
        <Route path="/Member/:id" element={<EditMember />} />
        <Route path="/staff/:id" element={<EditStaff />} />
        <Route path="/Announcement/:id" element={<EditAnnouncement />} />
        <Route path="/Appoinment/:id" element={<EditAppoinment/>} />
        <Route path="/Attendance/:id" element={<EditAttendance/>} />
        <Route path="/Feedback/:id" element={<EditFeedback/>} />
        <Route path="/Schedule/:id" element={<EditSchedule/>} />



    </Routes>
   
  </Router>
  
  
  </div>

 
  );

}
  
  
  export default App;
