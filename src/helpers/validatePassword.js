export const validatePassword = (password) => {
  const expresionRegular = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
  return expresionRegular.test(password);
};
