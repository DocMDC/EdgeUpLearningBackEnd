const verifyRoles = (...allowedRoles) => {
    return (req, res, next) => {
        console.log('verifying roles')
        console.log(allowedRoles)
        if (!req?.roles) return res.sendStatus(401);
        const rolesArray = [...allowedRoles];
        const result = req.roles.map(role => rolesArray.includes(role)).find(val => val === true);
        if (!result) return res.sendStatus(401);
        next();
    }
}

export default verifyRoles;
