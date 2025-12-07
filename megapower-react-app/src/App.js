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
import { StaffSignup } from "./StaffSignup";
import StaffTable   from "./staffTable";
import StaffInfoTable from "./StaffInfoTable";
import { EditStaff } from "./Editstaff";

import {Member  } from "./Member";
import {MemberTable  } from "./MemberTable";
import {EditMember  } from "./EditMember";
import {MemberProfile  } from "./MemberProfile";
import {MemberPayment  } from "./MemberPayment";
import {MemberAnnouncements  } from "./MemberAnnouncements";
import {MemberAttendance  } from "./MemberAttendance";
import MemberAppointment from "./MemberAppointment";
import {MemberChat  } from "./MemberChat";

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
import StaffAnnouncementView from "./StaffAnnouncementView";
import StaffPaymentView from "./StaffPaymentView";
import StaffAttendanceView from "./StaffAttendanceView";
import StaffAppointmentView from "./StaffAppointmentView";

import Chat from "./Chat";
import StaffChat from "./StaffChat";
import {Trainerrate  } from "./Trainerrate";
import {Trainerratetable  } from "./Trainerratetable";
import {RatingSubmitted  } from "./RatingSubmitted";
import {WorkoutTracker  } from "./WorkoutTracker";

import {Feedback  } from "./Feedback";
import {EditFeedback  } from "./EditFeedback";
import {Feedbacktable  } from "./Feedbacktable";

import {Appoinment  } from "./Appoinment";
import {EditAppoinment  } from "./EditAppoinment";
import {Appoinmenttable  } from "./Appoinmenttable";
import Reports from "./Reports";
import Chatbot from "./components/Chatbot";





















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
        <Route path="/MemberProfile" element={<MemberProfile />} />
        <Route path="/MemberPayment" element={<MemberPayment />} />
        <Route path="/MemberAnnouncements" element={<MemberAnnouncements />} />
        
        
        <Route path="/Admin" element={<Admin />} />
        <Route path="/staff" element={<Staff />} />
        <Route path="/staffSignup" element={<StaffSignup />} />
        <Route path="/Member" element={<Member />} />
        <Route path="/Equipment" element={<Equipment />} />
        <Route path="/Trainerrate" element={<Trainerrate />} />
        <Route path="/RatingSubmitted" element={<RatingSubmitted />} />
        <Route path="/WorkoutTracker" element={<WorkoutTracker />} />
        
        <Route path="/Schedule" element={<Schedule />} />
        <Route path="/Attendance" element={<Attendance />} />
        <Route path="/Payment" element={<Payment />} />
        <Route path="/Paymenttable" element={<Paymenttable />} />

        
        <Route path="/chat" element={<MemberChat />} />
        <Route path="/staffChat" element={<StaffChat />} />
        <Route path="/adminChat" element={<Chat />} />
        <Route path="/Announcement" element={<Announcement />} />
        <Route path="/Announcementtable" element={<Announcementtable />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/staffAnnouncement" element={<StaffAnnouncementView />} />
        <Route path="/staffPayment" element={<StaffPaymentView />} />
        <Route path="/staffAttendance" element={<StaffAttendanceView />} />
        <Route path="/staffAppointment" element={<StaffAppointmentView />} />
        <Route path="/Feedback" element={<Feedback />} />
        <Route path="/Appoinment" element={<Appoinment />} />
        <Route path="/MemberTable" element={<MemberTable />} />
        <Route path="/StaffTable" element={<StaffTable />} />
        <Route path="/StaffInfo" element={<StaffInfoTable />} />
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
        
        <Route path="/MemberAnnouncements" element={<MemberAnnouncements />} />
        <Route path="/MemberAttendance" element={<MemberAttendance />} />
        <Route path="/MemberAppointment" element={<MemberAppointment />} />



    </Routes>
   
  </Router>
  
  {/* AI Chatbot - Available on all pages */}
  <Chatbot />
  
  </div>

 
  );

}
  
  
  export default App;
