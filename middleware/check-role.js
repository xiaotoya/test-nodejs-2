function checkRole(req, res, next) {
    // const role = req.query.role;
    // if (role) {
    //     next();
    // } else {
    //     res.json({
    //         message: 'failed'
    //     });
    // }
    next();
}
module.exports = checkRole;