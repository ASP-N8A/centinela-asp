import React from 'react';
import { Result } from 'antd';
import { Switch, Route, useHistory } from 'react-router-dom';
import { ReactQueryDevtools } from 'react-query-devtools';
import Authentication from './Views/Authentication/Authentication';
import Issues from './Views/Issues/Issues';
import IssueDetails from './Views/IssueDetails/IssueDetails';
import Invite from './Views/Invite/Invite';
import Keys from './Views/Keys/Keys';
import auth from './Utils/auth';

function App() {
  const history = useHistory();
  if (auth.isAuthenticated() && history.location.pathname === '/') {
    history.push('/issues');
  }
  if (!auth.isAuthenticated() && history.location.pathname !== '/') {
    history.push('/');
  }
  return (
    <React.Fragment>
      <Switch>
        <Route exact path="/issue/:id">
          <IssueDetails />
        </Route>
        <Route exact path="/invite">
          <Invite />
        </Route>
        <Route exact path="/keys">
          <Keys />
        </Route>
        <Route exact path="/issues">
          <Issues />
        </Route>
        <Route exact path="/">
          <Authentication />
        </Route>
        <Route path="/">
          <Result
            status="404"
            title="404"
            subTitle="Sorry, the page you visited does not exist."
          />
        </Route>
      </Switch>
      <ReactQueryDevtools initialIsOpen={false} />
    </React.Fragment>
  );
}

export default App;
