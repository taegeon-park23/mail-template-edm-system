const getCheckEmail = (email) => {
    const checkEmail = /^([0-9a-zA-Z_\.-]+)@([0-9a-zA-Z_-]+)(\.[0-9a-zA-Z_-]+){1,2}$/;
    return checkEmail.test(email);
}

export default getCheckEmail;