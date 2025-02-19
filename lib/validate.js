
export default function login_validate(values) {
  const errors = {};

  if(!values.email){
    errors.email = 'Email is required';
  }else if(!/\S+@\S+\.\S+/.test(values.email)){
    errors.email = 'Email is invalid';
  }

//   validation for Password
  if(!values.password){
    errors.password = 'Password is required';
  }else if(values.password.length < 8 || values.password.length > 20){
    errors.password = 'Password must be at least 8 characters';
  }else if(values.password.includes(" ")){
    errors.password = 'Invalid Password';
  }

  return errors;

}

export function register_validate(values) {
  const errors={};
  if(!values.username){
    errors.username = 'Name is required';
  }else if(values.username.includes(" ")){
    errors.username = 'Invalid Name';
  }

  if(!values.email){
    errors.email = 'Email is required';
  }else if(!/\S+@\S+\.\S+/.test(values.email)){
    errors.email = 'Email is invalid';
  }

  if(!values.password){
    errors.password = 'Password is required';
  }else if(values.password.length < 8 || values.password.length > 20){
    errors.password = 'Password must be at least 8 characters';
  }else if(values.password.includes(" ")){
    errors.password = 'Invalid Password';
  }

  // validate confirm Passord
  if(!values.confirmPassword){
    errors.confirmPassword = 'Confirm Password is required';
  }else if(values.password !== values.confirmPassword){
    errors.confirmPassword = 'Password does not match';
  }else if(values.confirmPassword.includes(" ")){
    errors.confirmPassword = "Invalid Confirm Password"
  }

  return errors;

}