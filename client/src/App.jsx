import React from 'react'
import { BrowserRouter as Router, Routes , Route } from 'react-router'
import Index from './pages/public'
import './App.css'
import Notfound from './pages/public/Notfound'
import Login from './pages/componants/Login'
import Dashboard from './pages/admin/Dashboard'
import Role from './pages/admin/Role'
import Session from './pages/admin/Session'
import Programme from './pages/admin/Programme'
import Branch from './pages/admin/Branch'
import College from './pages/admin/College'
import Batch from './pages/admin/Batch'
import Technology from './pages/admin/Technology'
import Subject from './pages/admin/Subject'
import User from './pages/admin/User'
import Location from './pages/admin/Location'
import ManageUser from './pages/admin/ManageUser'
import ManageNotification from './pages/admin/ManageNotification'
import ContentManager from './pages/admin/ContentManager'
import AddTopic from './pages/admin/AddTopic'
import ViewContent from './pages/admin/ViewContent'
import ChangePassword from './pages/admin/ChangePassword'
import UserDashboard from './pages/user/UserDashboard'
import ManageContent from './pages/admin/ManageContent'
import StudentViewContent from './pages/user/StudentViewContent'
import ViewSubjectContent from './pages/user/ViewSubjectContent'

function App() {
 

  return (
    <>
      <Router>
        <Routes>
            {/* public route start */}
              <Route path='*' element={<Notfound/>}></Route>
              <Route path='/' element={<Index/>}></Route>
              <Route path='/signin' element={<Login/>}></Route>
            {/* public route end */}

            {/* admin route start*/}
            <Route path='/admin' element={<Dashboard/>}>
            <Route path='role' element={<Role/>}></Route>
            <Route path='session' element={<Session/>}></Route>
            <Route path='location' element={<Location/>}></Route>
            <Route path='programme' element={<Programme/>}></Route>
            <Route path='branch' element={<Branch/>}></Route>
            <Route path='college' element={<College/>}></Route>
            <Route path='batch' element={<Batch/>}></Route>
            <Route path='technology' element={<Technology/>}></Route>
            <Route path='subject' element={<Subject/>}></Route>
            <Route path='topic' element={<AddTopic/>}></Route>
            <Route path='user' element={<User/>}></Route>
            <Route path='manage-user' element={<ManageUser/>}></Route>
            <Route path='send-notification' element={<ManageNotification/>}></Route>
            <Route path='add-content' element={<ContentManager/>}></Route>
            <Route path='view-content' element={<ViewContent/>}></Route>
            <Route path='manage-content' element={<ManageContent/>}></Route>
            <Route path='change-password' element={<ChangePassword/>}></Route>
            </Route>
            {/* admin route end*/}

            {/* user route start */}
            <Route path='/userDashboard' element={<UserDashboard/>}>
              <Route path='content' element={<StudentViewContent/>}></Route>
              <Route path="view-content/:subjectId" element={<ViewSubjectContent />} />
            </Route>
            {/* user route end */}
        </Routes>
       </Router>
    </>
  )
}

export default App
