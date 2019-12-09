import React, { useState, useEffect, Fragment } from 'react';
import './styles.css';
import axios from 'axios';
import { Header, Icon, Container } from 'semantic-ui-react'
import { IActivity } from '../models/activity';
import NavBar from '../../features/nav/NavBar';
import { ActivityDashboard } from '../../features/activities/dashboard/ActivityDashboard';


const App = () => {
  const [activities, setActivities] = useState<IActivity[]>([])

  useEffect(() => {
    axios.get<IActivity[]>('http://localhost:5000/api/activities')
      .then((response) => {
        setActivities(response.data)
      });
  }, []);

  return (
    <Fragment>
      <NavBar />
      <Icon name='users' />
      <Header.Content>Reactivities</Header.Content>
      <Container style={{ marginTop: '7em' }}>
        <ActivityDashboard activities={activities} />
      </Container>
    </Fragment >

  );

}

export default App;
