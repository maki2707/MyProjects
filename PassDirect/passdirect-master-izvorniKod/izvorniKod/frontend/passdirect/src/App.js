import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import Home from './containers/Home';
import AccActivate from './containers/AccActivate';
import Login from './containers/Login';
import Signup from './containers/Signup';
import ResetPassword from './containers/ResetPassword';
import ResetPasswordConfirm  from './containers/ResetPasswordConfirm';
import Layout from './hocs/Layout';
import AccView from './containers/AccView';
import AccEdit from './containers/AccEdit';
import Admin from './containers/Admin';
import Timetable from './containers/Timetable';
import Station from './containers/Station';
import TimetableClassic from './containers/TimetableClassic';
import UserTransactions from './containers/UserTransactions'
import { Provider } from 'react-redux';
import store from './store';
import {ToastContainer} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'


const App = () => (
  <Provider store = {store} >
    <Router>
      <Layout>
        <Switch>
          <Route exact path = '/' component = {Home}/>
          <Route exact path = '/login' component = {Login}/>
          <Route exact path = '/signup' component = {Signup}/>
          <Route exact path = '/reset-password' component = {ResetPassword}/>
          <Route exact path = '/password/reset/confirm/:uid/:token' component = {ResetPasswordConfirm}/>
          <Route exact path = '/activate/:uid/:token' component = {AccActivate}/>
          <Route exact path = '/account' component = {AccView}/>
          <Route exact path = '/account/edit' component = {AccEdit}/>
          <Route exact path = '/admin' component = {Admin}/>
          <Route exact path = '/timetable/:sid' component = {Station}/>
          <Route exact path = '/timetable' component = {Timetable}/>
          <Route exact path = '/timetable-classic' component = {TimetableClassic}/>
          <Route exact path = '/user-transactions/:uid' component = {UserTransactions}/>
        </Switch>
        <ToastContainer autoClose={5000}  />
      </Layout>    
    </Router>
  </Provider>
  
)

export default App;