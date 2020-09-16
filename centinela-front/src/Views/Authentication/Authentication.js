import React, { useState } from 'react';

import SignUp from '../../Components/SingUp/SignUp';
import SignIn from '../../Components/SignIn/SignIn';

const Authentication = () => {
  const [form, setForm] = useState('signup');

  return form === 'signup' ? <SignUp setForm={setForm} /> : <SignIn setForm={setForm} />;
};

export default Authentication;
