let LocalStrategy = require("passport-local").Strategy,
    bcrypt = require('bcrypt-nodejs');

module.exports = function (passport, connection) {
    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function (id, done) {
        connection.query("SELECT * FROM user WHERE id = ? ", [id],
            function (err, rows) {
                done(err, rows[0]);
            });
    });

    passport.use(
        'local-register',
        new LocalStrategy({
                usernameField: 'username',
                passwordField: 'password',
                passReqToCallback: true
            },
            function (req, username, password, done) {
                connection.query("SELECT * FROM user WHERE username = ? ",
                    [username], function (err, rows) {
                        if (err)
                            return done(err);
                        if (rows.length) {
                            return done(null, false, req.flash('registerMessage', 'That is already taken'));
                        } else {
                            let newUserMysql = {
                                username: username,
                                password: bcrypt.hashSync(password, null, null)
                            };


                            let verification_token = generateToken(10);

                            let insertQuery = "INSERT INTO user (username, password, token, verified) values (?, ?, ?, ?)";

                            connection.query(insertQuery, [newUserMysql.username, newUserMysql.password, verification_token, false],
                                function (err, rows) {
                                    if(err)
                                    console.log(err);
                                    //console.log(rows.insertId);
                                    newUserMysql.id = rows.insertId;

                                    return done(null, newUserMysql);
                                });
                            }
                            // send verification token mail

                    });
            })
    );

    passport.use(
        'local-login',
        new LocalStrategy({
                usernameField: 'username',
                passwordField: 'password',
                passReqToCallback: true
            },
            function (req, username, password, done) {
                connection.query("SELECT * FROM user WHERE username = ? ", [username],
                    function (err, rows) {
                        if (err)
                            return done(err);

                        if (!rows.length) {
                            return done(null, false, req.flash('loginMessage', 'User not found'));
                        }
                        if (!bcrypt.compareSync(password, rows[0].password))
                            return done(null, false, req.flash('loginMessage', 'Wrong Password'));

                        return done(null, rows[0]);
                    });
            })
    );
};

function generateToken(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * 
 charactersLength));
   }
   return result;
}
