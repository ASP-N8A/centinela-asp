import React from 'react';
import { useSelector } from 'react-redux';
import { Switch, Route } from 'react-router-dom';
import { selectAuthenticated } from './Slices/accountSlice';
import Authentication from './Views/Authentication/Authentication';
import Issues from './Views/Issues/Issues';
import IssueDetails from './Views/IssueDetails/IssueDetails';

function App() {
  const isAuthenticated = useSelector(selectAuthenticated);

  return (
    <Switch>
      <Route exact path="/issue/:id">
        <IssueDetails />
      </Route>
      <Route exact path="/">
        {!isAuthenticated ? <Issues /> : <Authentication />}
      </Route>
      <Route path="/">Not found</Route>
    </Switch>
  );
}

export default App;
