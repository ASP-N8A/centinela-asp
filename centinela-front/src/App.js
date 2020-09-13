import React from 'react';
import { useSelector } from 'react-redux';
import { Switch, Route } from 'react-router-dom';
import { selectAuthenticated } from './Slices/accountSlice';
import { Spin } from 'antd';

function App() {
  const isAuthenticated = useSelector(selectAuthenticated);

  return (
    <Switch>
      <Route exact path="/path1">
        Component1
      </Route>
      <Route exact path="/path2">
        Component2
      </Route>
      <Route exact path="/">
        {isAuthenticated ? 'Home' : <Spin />}
      </Route>
      <Route path="/">
        Not found
      </Route>
    </Switch>
  );
}

export default App;
